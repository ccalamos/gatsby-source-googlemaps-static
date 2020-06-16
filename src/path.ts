/// <reference path="../index.d.ts" />

import { PathOptions } from "gatsby-source-googlemaps-static";

class Path {
    private _points: Array<string>;
    private _weight: string | undefined;
    private _color: string | undefined;
    private _fillColor: string | undefined;
    private _geoDesic: boolean | undefined;

    public constructor(options: PathOptions) {
        this._weight = options.weight;
        this._color = options.color;
        this._fillColor = options.fillColor;
        this._geoDesic = !!options.geoDesic;

        if (typeof options.points === "string") {
            this._points = [options.points];
        } else {
            this.points = options.points;
        }
    }

    private newOption(
        key: string,
        value: string | boolean | undefined,
        next = false
    ) {
        return value
            ? `${key}:${value}${next ? encodeURIComponent("|") : ""}`
            : "";
    }

    private generateParams() {
        let pointsStr = "";

        this._points.forEach((point, idx) => {
            pointsStr += point;
            if (idx !== this._points.length - 1) {
                pointsStr += encodeURIComponent("|");
            }
        });

        return (
            this.newOption("weight", this._weight, true) +
            this.newOption("color", this._color, true) +
            this.newOption("fillcolor", this._fillColor, true) +
            this.newOption("geodesic", this._geoDesic, true) +
            pointsStr
        );
    }

    private set points(newPoints: Array<string>) {
        const points = [];

        newPoints.forEach(point => {
            points.push(encodeURIComponent(point));
        });

        this._points = [...points];
    }

    get urlParams() {
        return this.generateParams();
    }

    get wayPoints() {
        switch (this._points.length) {
            case 1:
                return `origin=${this._points[0]}&destination=${this._points[0]}`;
            case 2:
                return `origin=${this._points[0]}&destination=${this._points[1]}`;
            default:
                let origin,
                    destination,
                    wayPoints = "";
                this._points.forEach((point, idx) => {
                    if (idx === 0) {
                        origin = point;
                    } else if (idx === this._points.length - 1) {
                        destination = point;
                    } else {
                        wayPoints += `${encodeURIComponent("|")}${point}`;
                    }
                });

                return `origin=${origin}&destination=${destination}&waypoints=${wayPoints}`;
        }
    }
}

export default Path;
