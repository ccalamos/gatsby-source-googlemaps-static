import queryString from "query-string";

import CacheFile from "./cache-file";
import signUrl from "./google-sign-url";

class ImageFile extends CacheFile {
    readonly baseURL: string = "https://maps.googleapis.com/maps/api/staticmap";

    private _params: string;
    private _extension: string = ".png";
    private _useSignature: boolean = false;
    private _useClient: boolean = false;

    public constructor(cache: any, params: any) {
        super(cache, queryString.stringify(params));

        this._useSignature = params.hasSecret;
        delete params.hasSecret;

        let appendStr = "";

        if (params.markers) {
            appendStr += this.parseArrayParams(params.markers, "markers");
            delete params.markers;
        }

        if (params.visible) {
            if (!!appendStr) {
                appendStr += "&";
            }
            appendStr += this.parseArrayParams(params.visible, "visible");
            delete params.visible;
        }

        if (params.style) {
            if (!!appendStr) {
                appendStr += "&";
            }
            appendStr += this.parseArrayParams(params.style, "style");
            delete params.style;
        }

        if (params.path) {
            if (!!appendStr) {
                appendStr += "&";
            }
            appendStr += this.parseArrayParams(params.path, "path");
            delete params.path;
        }

        this._params = this.generateParams(params, "", appendStr);
        this._extension = `.${params.format}`;
        this._useClient = !!params.client;
    }

    public async getHref(
        store: any,
        keyOrClient: string,
        secret: string | undefined
    ) {
        return await this.getPath(
            store,
            this.getUrl(keyOrClient, secret),
            this._extension
        );
    }

    private getUrl(keyOrClient: string, secret: string | undefined) {
        let url: string = `${this.baseURL}?${this._params}`;

        if (this._useClient) {
            url = this.generateParams({ client: keyOrClient }, url);
        } else {
            url = this.generateParams({ key: keyOrClient }, url);
        }

        if (this._useSignature) {
            return this.generateSignature(url, secret);
        }

        return url;
    }

    private generateSignature(url: string, secret: string) {
        return signUrl(url, secret);
    }

    private generateParams(
        options: object,
        prependStr: Array<string> | string = "",
        appendStr: Array<string> | string = ""
    ) {
        let pStr, aStr;

        if (typeof prependStr === "string") {
            pStr = prependStr;
        } else {
            prependStr.forEach((str: string) => {
                pStr += `&${str}`;
            });
        }

        if (typeof appendStr === "string") {
            aStr = appendStr;
        } else {
            appendStr.forEach((str: string) => {
                aStr += `&${str}`;
            });
        }

        return (
            (!!pStr ? pStr + "&" : "") +
            queryString.stringify(options) +
            (!!aStr ? "&" + aStr : "")
        );
    }

    private parseArrayParams(options: string | Array<any>, type: string) {
        if (typeof options === "string") {
            return `${type}=${options}`;
        }

        let str = "";
        options.map((option, idx) => {
            str += `${type}=${option}`;
            if (idx !== options.length - 1) {
                str += "&";
            }
        });
        return str;
    }
}

export default ImageFile;
