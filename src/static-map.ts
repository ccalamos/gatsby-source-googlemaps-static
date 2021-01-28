import { Store, NodePluginArgs } from "gatsby";

import ImageFile from "./image-file";
import Marker from "./marker";
import Style from "./style";
import Path from "./path";

class StaticMap
  implements Omit<MapOptions, "markers" | "paths" | "styles" | "visible"> {
  public nickname?: string;
  public size: string;
  public format: string;
  public zoom?: string;
  public center: string;
  public scale?: string;
  public mapType?: string;
  public mapID?: string;
  public clientID?: string;
  public hasSecret: boolean;
  public url: string;

  private store: Store;
  private file?: ImageFile;
  private query?: string;
  private paths?: Path[];
  private markers?: Marker[];
  private styles?: Style[];
  private visible?: Stringable[];

  public constructor(
    options: ConfigOptions,
    cache: NodePluginArgs["cache"],
    store: Store,
  ) {
    this.store = store;
    this.size = options.size
      ? options.size.includes("x")
        ? options.size
        : `${options.size}x${options.size}`
      : "640x640";
    this.markers = this.parseOption(options.markers ?? [], Marker);
    this.paths = this.parseOption(options.paths ?? [], Path);
    this.styles = this.parseOption(options.styles ?? [], Style);
    this.visible = this.parseOption(options.visible ?? [], String);
    this.hasSecret = !!options.secret;
    this.zoom = options.zoom ?? "14";
    this.format = options.format ?? "png";
    this.center = options.center ?? "";
    this.clientID = options.clientID;
    this.scale = options.scale;
    this.mapType = options.mapType;
    this.mapID = options.mapID;
    this.query = options.query;
    this.url = this.getPublicSearchURL();
    this.file = new ImageFile(cache, this.getImageJSON());
  }

  public async getFilePath(
    key: string,
    secret?: string,
  ): Promise<{
    absolutePath: string;
    center: string;
    hash: string;
  }> {
    const keyOrClient: string = this.clientID ? this.clientID : key;

    const { path, hash } = (await this.file?.getHref(
      this.store,
      keyOrClient,
      secret,
    )) ?? { path: "", hash: "" };

    return {
      absolutePath: path,
      center: this.isImplicit() ? "Implicit Map" : this.center,
      hash,
    };
  }

  private isImplicit(): boolean {
    return (
      (!this.center && !this.isEmpty(this.markers ?? this.paths)) ||
      !this.isEmpty(this.visible)
    );
  }

  private isEmpty(arr?: Stringable[]): boolean {
    return arr ? !arr.length : true;
  }

  private isCords(): boolean {
    return !this.query && RegExp(/^[^a-zA-Z]+$/).test(this.center);
  }

  private getImageJSON(): ImageFileOptions {
    return {
      baseUrl: this.generateMapUrl(),
      clientID: this.clientID ?? "",
      format: this.format,
      hasSecret: this.hasSecret ?? false,
      mapType: this.mapType,
      map_id: this.mapID,
      markers: this.mapArray(this.markers ?? []),
      paths: this.mapArray(this.paths ?? []),
      scale: this.scale,
      size: this.size,
      styles: this.mapArray(this.styles ?? []),
      visible: this.mapArray(this.visible ?? []),
      zoom: this.isImplicit() ? "" : this.zoom,
    };
  }

  private parseOption<T, O>(options: O | O[], Type: Constructable<T, O>): T[] {
    return !Array.isArray(options)
      ? [new Type(options)]
      : options.map((option) => new Type(option));
  }

  private mapArray<T extends Stringable>(types: T[]): string[] {
    return types.map((type: T) => type.toString());
  }

  private generateMapUrl(): string {
    return `https://www.google.com/maps/api/staticmap?${
      this.isImplicit() ? this.parseWayPoints() : ""
    }${this.center ? `center=${encodeURIComponent(this.center)}` : ""}`;
  }

  private getPublicSearchURL(): string {
    const URLBuilder: [dir: string, action: string] = this.isImplicit()
      ? ["dir/", this.parseWayPoints()]
      : this.isCords()
      ? ["@", `map_action=map&center=${encodeURIComponent(this.center)}`]
      : ["search/", `query=${encodeURIComponent(this.query ?? this.center)}`];

    return `https://www.google.com/maps/${URLBuilder[0]}?api=1&${URLBuilder[1]}`;
  }

  private parseWayPoints(): string {
    return encodeURIComponent(
      this.getWayPoints()
        .map((point) => point.toString())
        .reduce((points, point) => `${points}|${point}`, ""),
    );
  }

  private getWayPoints(): Stringable[] {
    return [...(this.markers ?? this.visible ?? this.paths ?? [])];
  }
}

export default StaticMap;
