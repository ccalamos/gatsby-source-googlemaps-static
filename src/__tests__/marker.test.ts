import Marker from "../marker";

describe("marker", () => {
    describe("urlParams", () => {
        it("with location", () => {
            const options = {
                location: "test-location",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected = "|test-location";
            expect(result).toEqual(expected);
        });

        it("with color", () => {
            const options = {
                location: "test-location",
                color: "test-color",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected =
                "color:test-color" + encodeURIComponent("|") + "test-location";
            expect(result).toEqual(expected);
        });

        it("with size", () => {
            const options = {
                location: "test-location",
                size: "test-size",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected =
                "size:test-size" + encodeURIComponent("|") + "test-location";
            expect(result).toEqual(expected);
        });

        it("with label", () => {
            const options = {
                location: "test-location",
                label: "test-label",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected =
                "label:test-label" + encodeURIComponent("|") + "test-location";
            expect(result).toEqual(expected);
        });

        it("with all options", () => {
            const options = {
                location: "test-location",
                color: "test-color",
                size: "test-size",
                label: "test-label",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected =
                "color:test-color" +
                encodeURIComponent("|") +
                "size:test-size" +
                encodeURIComponent("|") +
                "label:test-label" +
                encodeURIComponent("|") +
                "test-location";
            expect(result).toEqual(expected);
        });

        it("with icon", () => {
            const options = {
                location: "test-location",
                icon: "test-icon",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected =
                "icon:test-icon" + encodeURIComponent("|") + "test-location";
            expect(result).toEqual(expected);
        });

        it("with icon and anchor", () => {
            const options = {
                location: "test-location",
                icon: "test-icon",
                anchor: "test anchor",
            };
            const marker = new Marker(options);
            const result = marker.urlParams;
            const expected =
                "anchor:testanchor" +
                encodeURIComponent("|") +
                "icon:test-icon" +
                encodeURIComponent("|") +
                "test-location";
            expect(result).toEqual(expected);
        });
    });

    describe("wayPoint", () => {
        it("with location", () => {
            const options = {
                location: "test-location",
            };
            const marker = new Marker(options);
            const result = marker.wayPoint;
            expect(result).toEqual("test-location");
        });
    });
});
