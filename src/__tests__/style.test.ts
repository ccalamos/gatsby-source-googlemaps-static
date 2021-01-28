import Style from "../style";

describe("style", () => {
  it("urlParams with empty rules", () => {
    const style = new Style({
      rules: {},
    });

    const result = style.toString();
    expect(result).toEqual("");
  });

  it("urlParams with rules", () => {
    const style = new Style({
      rules: {
        color: "0x00000000",
        weight: "5",
      },
    });

    const expected = `color:0x00000000${encodeURIComponent("|")}weight:5`;

    const result = style.toString();
    expect(result).toEqual(expected);
  });

  it("urlParams with features", () => {
    const style = new Style({
      feature: "poi",
      rules: {},
    });

    const expected = `feature:poi${encodeURIComponent("|")}`;

    const result = style.toString();
    expect(result).toEqual(expected);
  });

  it("urlParams with element", () => {
    const style = new Style({
      element: "labels",
      rules: {},
    });

    const expected = `element:labels${encodeURIComponent("|")}`;

    const result = style.toString();
    expect(result).toEqual(expected);
  });
});
