interface NodeDatum {
  absolutePath: string;
  center: string;
  hash: string;
  id: string;
  mapUrl: string;
  nickname: string;
  [key: string]: string;
}

interface ImageFileOptions {
  format?: string;
  hasSecret: boolean;
  clientID?: string;
  markers?: string[];
  paths?: string[];
  styles?: string[];
  visible?: string[];
  baseUrl?: string;
  [key: string]: string | string[] | boolean | undefined;
}

interface MapOptions
  extends Pick<ImageFileOptions, "format" | "hasSecret" | "clientID"> {
  nickname?: string;
  size?: string;
  zoom?: string;
  center?: string;
  scale?: string;
  mapType?: string;
  mapID?: string;
  markers?: MarkerOptions[];
  paths?: PathOptions[];
  styles?: StyleOptions[];
  visible?: string[];
}

interface ConfigOptions extends Readonly<Omit<MapOptions, "hasSecret">> {
  readonly key: string;
  readonly secret?: string;
  readonly query?: string;
  maps?: Omit<ConfigOptions, "maps">[];
  plugins?: unknown;
}

interface MarkerOptions {
  readonly location: string;
  readonly color?: string;
  readonly size?: string;
  readonly label?: string;
  readonly icon?: string;
  readonly anchor?: string;
}

interface PathOptions {
  readonly weight?: string;
  readonly color?: string;
  readonly fillColor?: string;
  readonly geoDesic?: boolean;
  readonly points: string[];
}
interface RuleOptions {
  readonly hue?: string;
  readonly lightness?: string;
  readonly saturation?: string;
  readonly gamma?: string;
  readonly invert_lightness?: boolean;
  readonly visibility?: string;
  readonly color?: string;
  readonly weight?: string;
}

interface StyleOptions {
  readonly feature?: string;
  readonly element?: string;
  readonly rules: RuleOptions;
}

interface Stringable {
  toString(): string;
}

interface Constructable<T, O> extends Stringable {
  new (args: O): T;
}

type CachePath = { path: string; hash: string };
