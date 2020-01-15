declare module "gatsby-source-googlemaps-static" {
    export interface ConfigOptions {
        readonly key: string;
        readonly center?: string;
        readonly zoom?: string;
        readonly size?: string;
        readonly format?: string;
        readonly scale?: string;
        readonly mapType?: string;
        readonly clientID?: string;
        readonly secret?: string;
        readonly markers?: Array<Object> | string;
        readonly paths?: Array<Object> | string;
        readonly styles?: Array<Object> | string;
        readonly visible?: Array<String> | string;
    }

    export interface MarkerOptions {
        readonly location: string;
        readonly color?: string;
        readonly size?: string;
        readonly label?: string;
        readonly icon?: string;
        readonly anchor?: string;
    }

    export interface PathOptions {
        readonly weight?: string;
        readonly color?: string;
        readonly fillColor?: string;
        readonly geoDesic?: boolean;
        readonly points: string | Array<string>;
    }
    export interface RuleOptions {
        readonly hue?: string;
        readonly lightness?: string;
        readonly saturation?: string;
        readonly gamma?: string;
        readonly invert_lightness?: boolean;
        readonly visibility?: string;
        readonly color?: string;
        readonly weight?: string;
    }

    export interface StyleOptions {
        readonly feature?: string;
        readonly element?: string;
        readonly rules: string | RuleOptions;
    }
}

