"use strict";

import url from "url";
import crypto from "crypto";

/**
 * Convert from 'web safe' base64 to true base64.
 *
 * @param  {string} safeEncodedString The code you want to translate
 *                                    from a web safe form.
 * @return {string}
 */
function removeWebSafe(safeEncodedString: string) {
    return safeEncodedString.replace(/-/g, "+").replace(/_/g, "/");
}

/**
 * Convert from true base64 to 'web safe' base64
 *
 * @param  {string} encodedString The code you want to translate to a
 *                                web safe form.
 * @return {string}
 */
function makeWebSafe(encodedString: string) {
    return encodedString.replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Takes a base64 code and decodes it.
 *
 * @param  {string} code The encoded data.
 * @return {string}
 */
function decodeBase64Hash(code: string) {
    return Buffer.from(code, "base64");
}

/**
 * Takes a key and signs the data with it.
 *
 * @param  {Buffer} key  Your unique secret key.
 * @param  {string} data The url to sign.
 * @return {string}
 */
function encodeBase64Hash(key: Buffer, data: string) {
    return crypto
        .createHmac("sha1", key)
        .update(data)
        .digest("base64");
}

/**
 * Sign a URL using a secret key.
 *
 * @param  {string} path   The url you want to sign.
 * @param  {string} secret Your unique secret key.
 * @return {string}
 */
function sign(path: string, secret: string) {
    const uri = url.parse(path);
    const safeSecret = decodeBase64Hash(removeWebSafe(secret));
    const hashedSignature = makeWebSafe(encodeBase64Hash(safeSecret, uri.path));
    return url.format(uri) + "&signature=" + hashedSignature;
}

export default sign;