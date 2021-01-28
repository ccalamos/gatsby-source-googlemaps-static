import Path from "../path";

describe("path", () => {
  describe("urlParams", () => {
    it("with empty points", () => {
      const path = new Path({
        points: [],
      });

      const result = path.toString();
      expect(result).toEqual("");
    });

    it("with points", () => {
      const path = new Path({
        points: ["LATITUDE,LONGITUDE", "CITY,REGION"],
      });

      const expected = encodeURIComponent(`LATITUDE,LONGITUDE|CITY,REGION`);

      const result = path.toString();
      expect(result).toEqual(expected);
    });

    it("with config options filled", () => {
      const path = new Path({
        color: "0x00000000",
        fillColor: "0xFFFF0033",
        geoDesic: true,
        points: ["40.737102,-73.990318", "40.749825,-73.987963"],
        weight: "5",
      });

      const sep = encodeURIComponent("|");
      const expected = `weight:5${sep}color:0x00000000${sep}fillcolor:0xFFFF0033${sep}geodesic:true${sep}40.737102%2C-73.990318${sep}40.749825%2C-73.987963`;

      const result = path.toString();
      expect(result).toEqual(expected);
    });
  });
});
