class Marker {
  private options?: string;
  private location?: string;

  public constructor(options: MarkerOptions) {
    this.location = options.location;
    if (!options.icon) {
      this.options = this.encodeOptions(
        options.color,
        options.size,
        options.label,
      );
    } else {
      this.options = this.encodeIcon(options.icon, options.anchor);
    }
  }

  public toString(): string {
    return this.options ?? "";
  }

  private encodeOptions(color?: string, size?: string, label?: string): string {
    return (
      this.generateEncoding("color", color) +
      this.generateEncoding("size", size) +
      this.generateEncoding("label", label) +
      (!color && !size && !label ? "|" : "") +
      encodeURIComponent(this.location ?? "")
    );
  }

  private encodeIcon(icon: string, anchor?: string): string {
    return (
      (anchor
        ? this.generateEncoding("anchor", anchor.replace(/ /g, ""))
        : "") +
      `icon:${icon}${encodeURIComponent("|")}` +
      encodeURIComponent(this.location ?? "")
    );
  }

  private generateEncoding(key: string, value: string | undefined): string {
    return !value
      ? ""
      : `${encodeURIComponent(key)}:${encodeURIComponent(
          value,
        )}${encodeURIComponent("|")}`;
  }
}

export default Marker;
