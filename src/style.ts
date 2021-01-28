class Style {
  private feature?: string;
  private element?: string;
  private rules: string[];

  public constructor(options: StyleOptions) {
    this.feature = options.feature;
    this.element = options.element;
    this.rules = Object.entries(options.rules).map((kv: string[]) =>
      kv.join(":"),
    );
  }

  public toString(): string {
    return this.generateParams();
  }

  private newOption(key: string, value: string | undefined): string {
    return value ? `${key}:${value}${encodeURIComponent("|")}` : "";
  }

  private generateParams(): string {
    const ruleStr = this.rules?.length
      ? this.rules.reduce(
          (acc, cur) => `${acc}${encodeURIComponent("|")}${cur}`,
        )
      : "";

    return (
      this.newOption("feature", this.feature) +
      this.newOption("element", this.element) +
      ruleStr
    );
  }
}

export default Style;
