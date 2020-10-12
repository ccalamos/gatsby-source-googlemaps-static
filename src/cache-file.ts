import { Store, NodePluginArgs } from "gatsby";

import crypto from "crypto";
import Axios, { AxiosInstance, AxiosResponse } from "axios";

import createFile from "./create-file";

abstract class CacheFile {
    protected _path: string | undefined;
    protected _type = "";

    private _axiosClient: AxiosInstance;
    private _cache: NodePluginArgs["cache"];

    private _hash = "";
    private _guid = "";
    private _cacheId = "";
    private _isCached = false;

    protected constructor(cache: NodePluginArgs["cache"], hash: string) {
        this._cache = cache;
        this.hash = hash;

        this.checkCache();

        this._axiosClient = Axios.create({
            method: "GET",
            responseType: "arraybuffer",
        });
    }

    protected async getPath(
        store: Store,
        url: string,
        ext: string
    ): Promise<{ path: string; hash: string }> {
        if (this._path) return { path: this._path, hash: this._hash };

        if (!this._isCached) {
            return this.downloadFile(url).then(async (response) => {
                const newPath: string = await this.createFile(
                    response.data,
                    store,
                    ext
                );
                await this.setCache(newPath);
                this._path = newPath;

                return { path: newPath, hash: this._hash };
            });
        }
        const path = await this.fetchCache();

        return { path, hash: this._guid };
    }

    private async createFile(
        data: Buffer,
        store: Store,
        ext: string
    ): Promise<string> {
        return createFile(data, store, ext, this._guid);
    }

    private async downloadFile(url: string): Promise<AxiosResponse> {
        return await this._axiosClient.get(url);
    }

    private set hash(newHash: string) {
        this._hash = newHash;
        this._guid = this.generateGUID();
        this._cacheId = `google-maps-static-cache-${this._guid}`;
    }

    private async checkCache(): Promise<void> {
        const cached = await this._cache.get(this._cacheId);
        this._isCached = !!cached;

        if (cached) {
            this._path = cached;
        }
    }

    private async setCache(path: string): Promise<NodePluginArgs["cache"]> {
        return await this._cache.set(this._cacheId, path);
    }

    private async fetchCache(): Promise<string> {
        return this._cache.get(this._cacheId);
    }

    private generateGUID(): string {
        return crypto.createHash("sha256").update(this._hash).digest("hex");
    }
}

export default CacheFile;
