/// <reference path="../index.d.ts" />

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
    private _store: any;
    private _options: MapOptions | any = {};
    private _isImplicit = false;

    public constructor(options: ConfigOptions, cache: any, store: any) {
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
    ) {
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

    get url() {
        return this._url;
    }

    private isImplicit() {
        return (
            (!this._options.center &&
                (!!this._options.markers || !!this._options.paths)) ||
            !!this._options.visible
        );
    }

    private set file(fileCache: any) {
        this._file = new ImageFile(fileCache, this.getJSON());
    }

    private set options(newOptions: ConfigOptions) {
        this._options = {};
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
        };

        if (!this._isImplicit) {
            options["zoom"] = this._options.zoom;
        }

        return options;
    }

    private parseOption(
        options: Array<Object> | string | undefined,
        classType: any = undefined
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

    private mapArray(types: Array<any> | string) {
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
            return this._options.paths[0]?.wayPoints;
        }

        const points = this.getWayPoints();
        let origin,
            destination,
            wayPoints = "";

        if (points.length === 1) {
            return `origin=${points[0].wayPoint ||
                points[0]}&destination=${points[0].wayPoint || points[0]}`;
        } else if (points.length === 2) {
            return `origin=${points[0].wayPoint ||
                points[0]}&destination=${points[1].wayPoint || points[1]}`;
        }

        points.forEach((point, idx) => {
            if (idx === 0) {
                origin = encodeURIComponent(point.wayPoint || point);
            } else if (idx === points.length - 1) {
                destination = encodeURIComponent(point.wayPoint || point);
            } else {
                wayPoints += `${encodeURIComponent("|")}${encodeURIComponent(
                    point.wayPoint || point
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
