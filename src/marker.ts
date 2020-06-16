/// <reference path="../index.d.ts" />

import { MarkerOptions } from "gatsby-source-googlemaps-static";

class Marker {
    private _params: string;
    private _location: string;

    public constructor(options: MarkerOptions) {
        this._location = options.location;
        if (!options.icon) {
            this._params = this.encodeOptions(
                options.location,
                options.color,
                options.size,
                options.label
            );
        } else {
            this._params = this.encodeIcon(
                options.location,
                options.icon,
                options.anchor
            );
        }
    }

    private encodeOptions(
        location: string,
        color: string | undefined,
        size: string | undefined,
        label: string | undefined
    ) {
        return (
            this.generateEncoding("color", color) +
            this.generateEncoding("size", size) +
            this.generateEncoding("label", label) +
            (!color && !size && !label ? "|" : "") +
            encodeURIComponent(location)
        );
    }

    private encodeIcon(
        location: string,
        icon: string,
        anchor: string | undefined
    ) {
        return (
            (anchor
                ? this.generateEncoding("anchor", anchor.replace(/ /g, ""))
                : "") +
            `icon:${icon}${encodeURIComponent("|")}` +
            encodeURIComponent(location)
        );
    }

    private generateEncoding(
        key: string,
        value: string | undefined,
        next = true
    ) {
        if (!value) {
            return "";
        }

        return `${encodeURIComponent(key)}:${encodeURIComponent(value)}${
            next ? encodeURIComponent("|") : ""
        }`;
    }

    get urlParams() {
        return this._params;
    }

    get wayPoint() {
        return this._location;
    }
}

export default Marker;
