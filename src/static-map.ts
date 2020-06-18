import {
    MarkerOptions,
    PathOptions,
    StyleOptions,
    ConfigOptions,
} from "gatsby-source-googlemaps-static";
import { Store, NodePluginArgs } from "gatsby";

import ImageFile from "./image-file";
import Marker from "./marker";
import Style from "./style";
import Path from "./path";

interface MapOptions {
    name?: string;
    size: string;
    format: string;
    zoom?: string;
    center: string;
    scale?: string;
    mapType?: string;
    client?: string;
    markers: Marker[] | string;
    paths: Path[] | string;
    styles: Style[] | string;
    visible: string[] | string;
    hasSecret?: boolean;
}

class StaticMap {
    // Private Helpers
    private _file: ImageFile | undefined;
    private _url: string;
    private _query: string | undefined;
    private _store: Store;
    private _options: MapOptions = {} as MapOptions;
    private _isImplicit = false;

    public constructor(
        options: ConfigOptions,
        cache: NodePluginArgs["cache"],
        store: Store
    ) {
        this._store = store;
        this._url = "";
        this.options = options;
        this._isImplicit = this.isImplicit();

        this.file = cache;

        this._query = options.query;
        this.generateMapUrl();
    }

    public async getFilePath(
        key: string,
        secret?: string
    ): Promise<{
        absolutePath: string;
        center: string | undefined;
        hash: string;
    }> {
        const keyOrClient: string = this._options.client
            ? this._options.client
            : key;

        const { path, hash } = (await this._file?.getHref(
            this._store,
            keyOrClient,
            secret
        )) || { path: "", hash: "" };

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

    private set file(fileCache: NodePluginArgs["cache"]) {
        this._file = new ImageFile(fileCache, this.getJSON());
    }

    private set options(newOptions: ConfigOptions) {
        this._options = {} as MapOptions;
        this._options.size = newOptions.size
            ? newOptions.size.includes("x")
                ? newOptions.size
                : `${newOptions.size}x${newOptions.size}`
            : "640x640";

        this._options.markers =
            (this.parseOption(
                newOptions.markers as
                    | MarkerOptions[]
                    | PathOptions[]
                    | StyleOptions[]
                    | string[]
                    | string
                    | Record<string, unknown>,
                "Marker"
            ) as Marker[] | string) || "";
        this._options.paths =
            (this.parseOption(
                newOptions.paths as
                    | MarkerOptions[]
                    | PathOptions[]
                    | StyleOptions[]
                    | string[]
                    | string
                    | Record<string, unknown>,
                "Path"
            ) as Path[] | string) || "";
        this._options.styles =
            (this.parseOption(
                newOptions.styles as
                    | MarkerOptions[]
                    | PathOptions[]
                    | StyleOptions[]
                    | string[]
                    | string
                    | Record<string, unknown>,
                "Style"
            ) as Style[] | string) || "";
        this._options.visible =
            (this.parseOption(newOptions.visible || "") as string[] | string) ||
            "";

        this._options.hasSecret = !!newOptions.secret;
        this._options.zoom = newOptions.zoom || "14";
        this._options.format = newOptions.format || "png";
        this._options.center = newOptions.center || "";
        this._options.client = newOptions.clientID;
        this._options.scale = newOptions.scale;
        this._options.mapType = newOptions.mapType;
    }

    private getJSON() {
        const options = {
            center: this._options.center,
            hasSecret: this._options.hasSecret || false,
            size: this._options.size,
            format: this._options.format,
            scale: this._options.scale,
            maptype: this._options.mapType,
            markers: this.mapArray(this._options.markers) || [],
            visible: this.mapArray(this._options.visible) || [],
            style: this.mapArray(this._options.styles) || [],
            path: this.mapArray(this._options.paths) || [],
            client: this._options.client || "",
            zoom: this._options.zoom,
        };

        if (this._isImplicit) {
            delete options.zoom;
        }

        return options;
    }

    private parseOption(
        options:
            | MarkerOptions[]
            | PathOptions[]
            | StyleOptions[]
            | string[]
            | string
            | Record<string, unknown>
            | undefined,
        classType?: string
    ) {
        if (
            options &&
            (options instanceof Array || typeof options === "string")
        ) {
            if (typeof options === "string") {
                return options;
            }

            let newOptions = [] as Marker[] | Path[] | Style[] | string[];
            options.forEach(
                (
                    option: MarkerOptions | PathOptions | StyleOptions | string
                ) => {
                    if (typeof option === "string") {
                        newOptions = [...newOptions, option] as string[];
                    } else {
                        switch (classType) {
                            case "Path":
                                newOptions = [
                                    ...newOptions,
                                    new Path(option as PathOptions),
                                ] as Path[];
                                break;
                            case "Marker":
                                newOptions = [
                                    ...newOptions,
                                    new Marker(option as MarkerOptions),
                                ] as Marker[];
                                break;
                            case "Style":
                                newOptions = [
                                    ...newOptions,
                                    new Style(option as StyleOptions),
                                ] as Style[];
                                break;
                        }
                    }
                }
            );

            return newOptions || "";
        }
        return "";
    }

    private mapArray(types: (string | Marker | Path | Style)[] | string) {
        if (typeof types === "string") {
            return types;
        }

        return types.map((type: string | Marker | Path | Style) => {
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
        let origin = "";
        let destination = "";
        let wayPoints = "";

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

        return [];
    }
}

export default StaticMap;
