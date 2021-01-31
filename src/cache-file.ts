import { Store, NodePluginArgs } from "gatsby";

import crypto from "crypto";
import { fetch } from "./helpers";
import createFile from "./create-file";

abstract class CacheFile {
  protected path?: string;
  protected type = "";

  private cache: NodePluginArgs["cache"];

  private hash = "";
  private guid = "";
  private cacheId = "";
  private isCached = false;

  protected constructor(cache: NodePluginArgs["cache"], hash: string) {
    this.cache = cache;
    this.setHash(hash);
    this.checkCache();
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
          ? { path: this.path, hash: this.hash }
          : this.downloadFile(url, store, ext),
      ),
    );
  }

  private async createFile(
    data: ArrayBuffer,
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
    return fetch(url)
      .then((buffer: ArrayBuffer) => this.createFile(buffer, store, ext))
      .then((path: string) => this.setCache(path));
  }

  private setHash(newHash: string) {
    this.hash = newHash;
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
      return { path: this.path, hash: this.hash };
    });
  }

  private async fetchCache(): Promise<string> {
    return this.cache.get(this.cacheId);
  }

  private generateGUID(): string {
    return crypto.createHash("sha256").update(this.hash).digest("hex");
  }
}

export default CacheFile;
