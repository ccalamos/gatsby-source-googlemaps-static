import { Store, NodePluginArgs } from "gatsby";
import CacheFile from "./cache-file";
import signUrl from "./google-sign-url";
import { stringify } from "./helpers";

class ImageFile extends CacheFile {
  private baseURL?: string;
  private options: string;
  private extension = ".png";
  private useSignature = false;
  private useClient = false;

  public constructor(
    cache: NodePluginArgs["cache"],
    options: ImageFileOptions,
  ) {
    super(cache, stringify(options));

    this.baseURL = options.baseUrl;
    this.useSignature = options.hasSecret;
    delete options["baseUrl"];

    const appendStr = `${this.parseArrayParams(
      "markers",
      options.markers,
    )}${this.parseArrayParams(
      "visible",
      options.visible,
    )}${this.parseArrayParams("style", options.styles)}${this.parseArrayParams(
      "path",
      options.paths,
    )}`;

    this.options = this.generateParams(options, "", appendStr);
    this.extension = `.${options.format}`;
    this.useClient = !!options.clientID;
  }

  public async getHref(
    store: Store,
    keyOrClient: string,
    secret: string | undefined,
  ): Promise<Record<string, string>> {
    return await this.getPath(
      store,
      this.getUrl(keyOrClient, secret),
      this.extension,
    );
  }

  private getUrl(keyOrClient: string, secret?: string): string {
    const url = `${this.baseURL}&${this.options}`;
    const formatted_url = this.useClient
      ? this.generateParams({ client: keyOrClient }, url)
      : this.generateParams({ key: keyOrClient }, url);

    return this.useSignature
      ? this.generateSignature(formatted_url, secret as string)
      : formatted_url;
  }

  private generateSignature(url: string, secret: string): string {
    return signUrl(url, secret);
  }

  private generateParams(
    options: Partial<ImageFileOptions> & { key?: string; client?: string },
    prependStr?: string,
    appendStr?: string,
  ): string {
    return (
      (prependStr ? `${prependStr}&` : "") +
      stringify(options) +
      (appendStr ? `&${appendStr}` : "")
    );
  }

  private parseArrayParams(type: string, options?: string[]): string {
    return !options
      ? ""
      : options.map((option) => `${type}=${option}`).join("&");
  }
}

export default ImageFile;
