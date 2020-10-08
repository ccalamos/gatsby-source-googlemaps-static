import Path from "../path";

describe("path", () => {
    describe("urlParams", () => {
        it("with empty points", () => {
            const path = new Path({
                points: [],
            });

            const result = path.urlParams;
            expect(result).toEqual("");
        });

        it("with points", () => {
            const path = new Path({
                points: ["LATITUDE,LONGITUDE", "CITY,REGION"],
            });

            const expected = encodeURIComponent(
                `LATITUDE,LONGITUDE|CITY,REGION`
            );

            const result = path.urlParams;
            expect(result).toEqual(expected);
        });

        it("with points as empty string", () => {
            const path = new Path({
                points: "",
            });

            const result = path.urlParams;
            expect(result).toEqual("");
        });
    });

    describe("urlParams parameters", () => {
        it("with weight", () => {
            const path = new Path({
                points: [],
                weight: "5",
            });

            const expected = `weight:${encodeURIComponent("5|")}`;

            const result = path.urlParams;
            expect(result).toEqual(expected);
        });

        it("with color", () => {
            const path = new Path({
                color: "0x00000000",
                points: [],
            });

            const expected = `color:${encodeURIComponent("0x00000000|")}`;

            const result = path.urlParams;
            expect(result).toEqual(expected);
        });

        it("with fillColor", () => {
            const path = new Path({
                fillColor: "0xFFFF0033",
                points: [],
            });

            const expected = `fillcolor:${encodeURIComponent("0xFFFF0033|")}`;

            const result = path.urlParams;
            expect(result).toEqual(expected);
        });

        it("with geoDesic", () => {
            const path = new Path({
                geoDesic: true,
                points: [],
            });

            const expected = `geodesic:${encodeURIComponent("true|")}`;

            const result = path.urlParams;
            expect(result).toEqual(expected);
        });
    });

    describe("wayPoints", () => {
        it("with empty points", () => {
            const path = new Path({
                points: [],
            });

            const expected = "origin=&destination=&waypoints=";

            const result = path.wayPoints;
            expect(result).toEqual(expected);
        });

        it("with points as empty string", () => {
            const path = new Path({
                points: "",
            });

            const expected = "origin=&destination=";

            const result = path.wayPoints;
            expect(result).toEqual(expected);
        });

        it("with two points", () => {
            const path = new Path({
                points: [
                    "8th Avenue & 34th St, New York, NY",
                    "Park Ave & 42nd St,New York,NY,NY",
                ],
            });

            const expected = `origin=${encodeURIComponent(
                "8th Avenue & 34th St, New York, NY"
            )}&destination=${encodeURIComponent(
                "Park Ave & 42nd St,New York,NY,NY"
            )}`;
            const result = path.wayPoints;
            expect(result).toEqual(expected);
        });

        it("with waypoints", () => {
            const path = new Path({
                points: [
                    "8th Avenue & 34th St, New York, NY",
                    "Park Ave & 42nd St,New York,NY,NY",
                    "Willis Tower, Chicago, IL",
                ],
            });

            const expected = `origin=${encodeURIComponent(
                "8th Avenue & 34th St, New York, NY"
            )}&destination=${encodeURIComponent(
                "Willis Tower, Chicago, IL"
            )}&waypoints=${encodeURIComponent(
                "|Park Ave & 42nd St,New York,NY,NY"
            )}`;
            const result = path.wayPoints;
            expect(result).toEqual(expected);
        });
    });
});
