import url from "url";
import crypto from "crypto";

function removeWebSafe(safeEncodedString: string): string {
  return safeEncodedString.replace(/-/g, "+").replace(/_/g, "/");
}

function makeWebSafe(encodedString: string): string {
  return encodedString.replace(/\+/g, "-").replace(/\//g, "_");
}

function decodeBase64Hash(code: string): Buffer {
  return Buffer.from(code, "base64");
}

function encodeBase64Hash(key: Buffer, data: string): string {
  return crypto.createHmac("sha1", key).update(data).digest("base64");
}

function sign(path: string, secret: string): string {
  const uri = url.parse(path);
  const safeSecret = decodeBase64Hash(removeWebSafe(secret));
  const hashedSignature = makeWebSafe(
    encodeBase64Hash(safeSecret, uri?.path as string),
  );
  return url.format(uri) + "&signature=" + hashedSignature;
}

export default sign;
