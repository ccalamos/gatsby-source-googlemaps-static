import fs from "fs";

export function strictEncode(string: string): string {
  return encodeURIComponent(string).replace(
    /[!'()*]/g,
    (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function stringify(
  options: Partial<ImageFileOptions> & { key?: string; client?: string },
): string {
  return Object.keys(options)
    .filter((key) => !!options[key] || typeof options[key] !== "string")
    .map(
      (key) => strictEncode(key) + "=" + strictEncode(options[key] as string),
    )
    .join("&");
}

export function ensureFilePath(path: string): void {
  fs.mkdirSync(path, { mode: 0o777, recursive: true });
}

export function ensureWriteFile(
  path: string,
  filename: string,
  data: ArrayBuffer,
): Promise<string> {
  return new Promise((resolve) => {
    ensureFilePath(path);
    fs.writeFileSync(filename, Buffer.from(data), {});
    resolve(filename);
  });
}
