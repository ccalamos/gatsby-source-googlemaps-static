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

        const markersHolder = [...params.markers];
        delete params.markers;
        this._params = this.generateParams(
            params,
            "",
            this.parseArrayParams(markersHolder)
        );
        this._extension = `.${params.format}`;
        this._useSignature = params.hasSecret;
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
        prependStr: string = "",
        appendStr: string = ""
    ) {
        return (
            (!!prependStr ? prependStr + "&" : "") +
            queryString.stringify(options) +
            (!!appendStr ? "&" + appendStr : "")
        );
    }

    private parseArrayParams(options: Array<any>) {
        let str = "";
        options.map((option, idx) => {
            str += `markers=${option}`;
            if (idx !== options.length - 1) {
                str += "&";
            }
        });
        return str;
    }
}

export default ImageFile;
