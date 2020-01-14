/// <reference path="../index.d.ts" />

import { MarkerOptions } from "gatsby-source-googlemaps-static";

import queryString from "query-string";

class Marker {
    private _params: string;
    private _location: string;

    public constructor(options: MarkerOptions) {
        this._location = options.location;
        this._params = this.encodeOptions(
            options.location,
            options.color,
            options.size,
            options.label
        );
    }

    private encodeOptions(
        location: string,
        color: string | undefined,
        size: string | undefined,
        label: string | undefined
    ) {
        return (
            queryString.stringify({
                size,
                color,
                label,
                "|": null,
            }) + encodeURIComponent(location)
        );
    }

    get urlParams() {
        return this._params;
    }
}

export default Marker;
