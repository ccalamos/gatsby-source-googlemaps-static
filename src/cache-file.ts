import { Store, NodePluginArgs } from "gatsby";

import crypto from "crypto";
import Axios, { AxiosInstance, AxiosResponse } from "axios";

import createFile from "./create-file";

abstract class CacheFile {
  protected path?: string;
  protected type = "";

  private axiosClient: AxiosInstance;
  private cache: NodePluginArgs["cache"];

  private _hash = "";
  private guid = "";
  private cacheId = "";
  private isCached = false;

  protected constructor(cache: NodePluginArgs["cache"], hash: string) {
    this.cache = cache;
    this.hash = hash;

    this.checkCache();

    this.axiosClient = Axios.create({
      method: "GET",
      responseType: "arraybuffer",
    });
  }

  protected async getPath(
    store: Store,
    url: string,
    ext: string,
  ): Promise<CachePath> {
    if (!this.isCached) return this.getFile(url, store, ext);

    const path = await this.fetchCache();
    return { path, hash: this.guid };
  }

  private async getFile(
    url: string,
    store: Store,
    ext: string,
  ): Promise<CachePath> {
    return new Promise((resolve) =>
      resolve(
        this.path
          ? { path: this.path, hash: this._hash }
          : this.downloadFile(url, store, ext),
      ),
    );
  }

  private async createFile(
    data: Buffer,
    store: Store,
    ext: string,
  ): Promise<string> {
    return createFile(data, store, ext, this.guid);
  }

  private async downloadFile(
    url: string,
    store: Store,
    ext: string,
  ): Promise<CachePath> {
    return this.axiosClient
      .get(url)
      .then(({ data }: AxiosResponse) => this.createFile(data, store, ext))
      .then((path: string) => this.setCache(path));
  }

  private set hash(newHash: string) {
    this._hash = newHash;
    this.guid = this.generateGUID();
    this.cacheId = `google-maps-static-cache-${this.guid}`;
  }

  private async checkCache(): Promise<void> {
    const cached = await this.cache.get(this.cacheId);
    this.isCached = !!cached;

    if (cached) {
      this.path = cached;
    }
  }

  private async setCache(path: string): Promise<CachePath> {
    return this.cache.set(this.cacheId, path).then(() => {
      this.path = path;
      return { path: this.path, hash: this._hash };
    });
  }

  private async fetchCache(): Promise<string> {
    return this.cache.get(this.cacheId);
  }

  private generateGUID(): string {
    return crypto.createHash("sha256").update(this._hash).digest("hex");
  }
}

export default CacheFile;
