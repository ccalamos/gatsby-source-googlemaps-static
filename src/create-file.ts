import { Store } from "gatsby";
import path from "path";
import { ensureWriteFile } from "./helpers";

const CACHE_DIR = `.cache`;
const FS_PLUGIN_DIR = `gatsby-source-googlemaps-static`;

const createFilePath = (
  directory: string,
  filename: string,
  ext: string,
): string => {
  return path.join(directory, `${filename}${ext}`);
};

export default async (
  data: ArrayBuffer,
  store: Store,
  ext: string,
  id: string,
): Promise<string> => {
  const pluginCacheDir: string = path.join(
    store.getState().program.directory,
    CACHE_DIR,
    FS_PLUGIN_DIR,
  );

  const hash = `hash-${id}`;
  const dir: string = path.join(pluginCacheDir, hash);
  const filename: string = createFilePath(dir, "google-maps-static", `${ext}`);

  return ensureWriteFile(dir, filename, data);
};
