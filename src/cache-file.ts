import crypto from "crypto";
import Axios, { AxiosInstance } from "axios";

import createFile from "./create-file";

abstract class CacheFile {
    protected _path: string | undefined;
    protected _type: string;

    private _axiosClient: AxiosInstance | undefined;
    private _cache: any;

    private _hash: string;
    private _guid: string;
    private _cacheId: string;
    private _isCached: boolean;

    protected constructor(cache: any, hash: string) {
        this._cache = cache;
        this.hash = hash;

        this.checkCache();

        if (!this._isCached) {
            this._axiosClient = Axios.create({
                method: "GET",
                responseType: "arraybuffer",
            });
        }
    }

    protected async getPath(store: any, url: string, ext: string) {
        if (this._path) return { path: this._path, hash: this._hash };

        if (!this._isCached) {
            return this.downloadFile(url).then(async response => {
                const path: string = await this.createFile(
                    response.data,
                    store,
                    ext
                );
                await this.setCache(path);
                this._path = path;

                return { path, hash: this._hash };
            });
        }
        const path = await this.fetchCache();

        return { path, hash: this._guid };
    }

    private async createFile(data: Buffer, store: any, ext: string) {
        return createFile(data, store, ext, this._guid);
    }

    private async downloadFile(url: string) {
        return await this._axiosClient.get(url);
    }

    private set hash(newHash: string) {
        this._hash = newHash;
        this._guid = this.generateGUID();
        this._cacheId = `google-maps-static-cache-${this._guid}`;
    }

    private async checkCache() {
        const cached = await this._cache.get(this._cacheId);
        this._isCached = !!cached;

        if (cached) {
            this._path = cached;
        }
    }

    private async setCache(path: string) {
        return await this._cache.set(this._cacheId, path);
    }

    private async fetchCache() {
        return this._cache.get(this._cacheId);
    }

    private generateGUID() {
        return crypto
            .createHash("sha256")
            .update(this._hash)
            .digest("hex");
    }
}

export default CacheFile;
