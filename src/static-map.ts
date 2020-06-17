/// <reference path="./index.d.ts" />

import {
    MarkerOptions,
    PathOptions,
    StyleOptions,
    ConfigOptions,
} from "gatsby-source-googlemaps-static";

import ImageFile from "./image-file";
import Marker from "./marker";
import Style from "./style";
import Path from "./path";

interface MapOptions {
    name?: string;
    size: string;
    format: string;
    zoom?: string;
    center?: string;
    scale?: string;
    mapType?: string;
    client?: string;
    markers?: Array<Marker> | string;
    paths?: Array<Path> | string;
    styles?: Array<Style> | string;
    visible?: Array<string> | string;
    hasSecret?: boolean;
}

class StaticMap {
    // Private Helpers
    private _file: ImageFile;
    private _url: string;
    private _query: string | undefined;
    private _store: unknown;
    private _options: MapOptions;
    private _isImplicit = false;

    public constructor(options: ConfigOptions, cache: unknown, store: unknown) {
        this._store = store;
        this.options = options;
        this._isImplicit = this.isImplicit();

        this.file = cache;

        this._query = options.query;
        this.generateMapUrl();
    }

    public async getFilePath(
        key: string | undefined,
        secret: string | undefined = undefined
    ): Promise<{ absolutePath: string; center: string; hash: string }> {
        const keyOrClient = this._options.client ? this._options.client : key;

        const { path, hash } = await this._file.getHref(
            this._store,
            keyOrClient,
            secret
        );

        return {
            absolutePath: path,
            center: this._isImplicit ? "Implicit Map" : this._options.center,
            hash,
        };
    }

    get url(): string {
        return this._url;
    }

    private isImplicit() {
        return (
            (!this._options.center &&
                (!!this._options.markers || !!this._options.paths)) ||
            !!this._options.visible
        );
    }

    private set file(fileCache: unknown) {
        this._file = new ImageFile(fileCache, this.getJSON());
    }

    private set options(newOptions: ConfigOptions) {
        this._options = {} as MapOptions;
        this._options.size = newOptions.size
            ? newOptions.size.includes("x")
                ? newOptions.size
                : `${newOptions.size}x${newOptions.size}`
            : "640x640";

        this._options.markers = this.parseOption(newOptions.markers, Marker);
        this._options.paths = this.parseOption(newOptions.paths, Path);
        this._options.styles = this.parseOption(newOptions.styles, Style);
        this._options.visible = this.parseOption(newOptions.visible);

        this._options.hasSecret = !!newOptions.secret;
        this._options.zoom = newOptions.zoom || "14";
        this._options.format = newOptions.format || "png";
        this._options.center = newOptions.center;
        this._options.client = newOptions.clientID;
        this._options.scale = newOptions.scale;
        this._options.mapType = newOptions.mapType;
    }

    private getJSON() {
        const options = {
            center: this._options.center,
            hasSecret: this._options.hasSecret,
            size: this._options.size,
            format: this._options.format,
            scale: this._options.scale,
            maptype: this._options.mapType,
            markers: this.mapArray(this._options.markers),
            visible: this.mapArray(this._options.visible),
            style: this.mapArray(this._options.styles),
            path: this.mapArray(this._options.paths),
            client: this._options.client,
        };

        if (!this._isImplicit) {
            options["zoom"] = this._options.zoom;
        }

        return options;
    }

    private parseOption(
        options:
            | Array<
                  | Record<string, unknown>
                  | MarkerOptions
                  | PathOptions
                  | StyleOptions
                  | string
              >
            | string,
        classType: Marker | Path | Style | any = undefined
    ) {
        if (options) {
            if (typeof options === "string") {
                return options;
            }

            let newOptions = [];
            options.forEach(
                (
                    option: MarkerOptions | PathOptions | StyleOptions | string
                ) => {
                    if (typeof option === "string") {
                        newOptions = [...newOptions, option];
                    } else {
                        newOptions = [...newOptions, new classType(option)];
                    }
                }
            );

            return newOptions;
        }
    }

    private mapArray(types: Array<string | Marker | Path | Style> | string) {
        if (!types) {
            return undefined;
        }

        if (typeof types === "string") {
            return types;
        }

        return types.map(type => {
            if (typeof type === "string") {
                return encodeURIComponent(type);
            }

            return type.urlParams;
        });
    }

    private generateMapUrl() {
        const baseUrl = "https://www.google.com/maps/";
        let url = baseUrl;

        if (this._isImplicit) {
            url = `${url}dir/?api=1&${this.parseWayPoints()}`;
        } else {
            if (this.isCords()) {
                url = `${url}@?api=1&map_action=map&center=${encodeURIComponent(
                    this._options.center
                )}`;
            } else {
                url = `${url}search/?api=1&query=${encodeURIComponent(
                    this._query || this._options.center
                )}`;
            }
        }

        this._url = url;
    }

    private isCords() {
        return (
            !this._query && RegExp(/^[^a-zA-Z]+$/).test(this._options.center)
        );
    }

    private parseWayPoints() {
        if (this._options.paths) {
            return typeof this._options.paths[0] === "string"
                ? this._options.paths[0]
                : this._options.paths[0]?.wayPoints;
        }

        const points = this.getWayPoints();
        let origin,
            destination,
            wayPoints = "";

        if (points.length === 1) {
            return typeof points[0] === "string"
                ? `origin=${points[0]}&destination=${points[0]}`
                : `origin=${points[0].wayPoint}&destination=${points[0].wayPoint}`;
        } else if (points.length === 2) {
            return typeof points[0] === "string" ||
                typeof points[1] === "string"
                ? `origin=${points[0]}&destination=${points[1]}`
                : `origin=${points[0].wayPoint}&destination=${points[1].wayPoint}`;
        }

        points.forEach((point, idx) => {
            if (idx === 0) {
                origin = encodeURIComponent(
                    typeof point === "string" ? point : point.wayPoint
                );
            } else if (idx === points.length - 1) {
                destination = encodeURIComponent(
                    typeof point === "string" ? point : point.wayPoint
                );
            } else {
                wayPoints += `${encodeURIComponent("|")}${encodeURIComponent(
                    typeof point === "string" ? point : point.wayPoint
                )}`;
            }
        });

        return `origin=${origin}&destination=${destination}&waypoints=${wayPoints}`;
    }

    private getWayPoints() {
        if (this._options.markers) {
            return [...this._options.markers];
        }

        if (this._options.visible) {
            return [...this._options.visible];
        }

        return;
    }
}

export default StaticMap;
