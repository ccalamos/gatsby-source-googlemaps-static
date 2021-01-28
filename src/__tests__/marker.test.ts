import Marker from "../marker";

describe("marker", () => {
  describe("urlParams", () => {
    it("with all options", () => {
      const options = {
        location: "test-location",
        color: "test-color",
        size: "test-size",
        label: "test-label",
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
        location: "test-location",
        icon: "test-icon",
      };
      const marker = new Marker(options);
      expect(marker.toString()).toEqual(
        `icon:test-icon${encodeURIComponent("|")}test-location`,
      );
    });

    it("with icon and anchor", () => {
      const options = {
        location: "test-location",
        icon: "test-icon",
        anchor: "test anchor",
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
