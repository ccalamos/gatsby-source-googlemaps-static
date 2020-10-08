import { PathOptions } from "gatsby-source-googlemaps-static";

class Path {
    private _points: string[] = [];
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
        value: string | boolean | undefined
    ): string {
        return value ? `${key}:${value}${encodeURIComponent("|")}` : "";
    }

    private generateParams(): string {
        let pointsStr = "";

        this._points.forEach((point, idx) => {
            pointsStr += point;
            if (idx !== this._points.length - 1) {
                pointsStr += encodeURIComponent("|");
            }
        });

        return (
            this.newOption("weight", this._weight) +
            this.newOption("color", this._color) +
            this.newOption("fillcolor", this._fillColor) +
            this.newOption("geodesic", this._geoDesic) +
            pointsStr
        );
    }

    private set points(newPoints: string[]) {
        const points = [] as string[];

        newPoints.forEach((point) => {
            points.push(encodeURIComponent(point));
        });

        this._points = [...points];
    }

    get urlParams(): string {
        return this.generateParams();
    }

    get wayPoints(): string {
        let origin = "";
        let destination = "";
        let wayPoints = "";

        switch (this._points.length) {
            case 1:
                return `origin=${this._points[0]}&destination=${this._points[0]}`;
            case 2:
                return `origin=${this._points[0]}&destination=${this._points[1]}`;
            default:
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
