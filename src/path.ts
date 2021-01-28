class Path {
  private points: string[];
  private weight?: string;
  private color?: string;
  private fillColor?: string;
  private geoDesic?: boolean;

  public constructor(options: PathOptions) {
    this.weight = options.weight;
    this.color = options.color;
    this.fillColor = options.fillColor;
    this.geoDesic = !!options.geoDesic;
    this.points = options.points.map((point) => encodeURIComponent(point));
  }

  public toString(): string {
    return this.generateParams();
  }

  private newOption(key: string, value: string | boolean | undefined): string {
    return value ? `${key}:${value}${encodeURIComponent("|")}` : "";
  }

  private generateParams(): string {
    return (
      this.newOption("weight", this.weight) +
      this.newOption("color", this.color) +
      this.newOption("fillcolor", this.fillColor) +
      this.newOption("geodesic", this.geoDesic) +
      this.points.join(encodeURIComponent("|"))
    );
  }
}

export default Path;
