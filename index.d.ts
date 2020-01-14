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
    }

    export interface PathOptions {
        readonly location: string;
        readonly color?: string;
        readonly size?: string;
        readonly label?: string;
    }

    export interface StyleOptions {
        readonly location: string;
        readonly color?: string;
        readonly size?: string;
        readonly label?: string;
    }
}
