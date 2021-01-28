import Marker from "../marker";

describe("marker", () => {
  describe("urlParams", () => {
    it("with all options", () => {
      const options = {
        color: "test-color",
        label: "test-label",
        location: "test-location",
        size: "test-size",
      };
      const marker = new Marker(options);
      const expected =
        "color:test-color" +
        encodeURIComponent("|") +
        "size:test-size" +
        encodeURIComponent("|") +
        "label:test-label" +
        encodeURIComponent("|") +
        "test-location";
      expect(marker.toString()).toEqual(expected);
    });

    it("with icon only ", () => {
      const options = {
        icon: "test-icon",
        location: "test-location",
      };
      const marker = new Marker(options);
      expect(marker.toString()).toEqual(
        `icon:test-icon${encodeURIComponent("|")}test-location`,
      );
    });

    it("with icon and anchor", () => {
      const options = {
        anchor: "test anchor",
        icon: "test-icon",
        location: "test-location",
      };
      const marker = new Marker(options);
      const expected =
        "anchor:testanchor" +
        encodeURIComponent("|") +
        "icon:test-icon" +
        encodeURIComponent("|") +
        "test-location";
      expect(marker.toString()).toEqual(expected);
    });
  });
});
