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
    ): string {
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
    ): string {
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
    ): string {
        if (!value) {
            return "";
        }

        return `${encodeURIComponent(key)}:${encodeURIComponent(value)}${
            next ? encodeURIComponent("|") : ""
        }`;
    }

    get urlParams(): string {
        return this._params;
    }

    get wayPoint(): string {
        return this._location;
    }
}

export default Marker;
