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
    visible?: Array<String> | string;
    hasSecret?: boolean;
}

class StaticMap {
    // Private Helpers
    private _file: ImageFile;
    private _store: any;
    private _options: MapOptions | any = {};
    private _isImplicit: boolean = false;

    public constructor(options: ConfigOptions, cache: any, store: any) {
        this._store = store;
        this.options = options;
        this._isImplicit = this.isImplicit();

        this.file = cache;
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

    private isImplicit() {
        return (
            !(!!this._options.center && !!this._options.zoom) &&
            (!!this._options.markers ||
                !!this._options.visible ||
                !!this._options.paths)
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
            hasSecret: this._options.hasSecret,
            size: this._options.size,
            format: this._options.format,
            scale: this._options.scale,
            maptype: this._options.mapType,
            markers: this.mapArray(this._options.markers),
            style: this.mapArray(undefined),
            path: this.mapArray(undefined),
        };

        if (!this._isImplicit) {
            options["center"] = this._options.center;
            options["zoom"] = this._options.zoom;
        } else {
            options["visible"] = this._options.visible;
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

        return types.map(type => type.urlParams);
    }
}

export default StaticMap;
