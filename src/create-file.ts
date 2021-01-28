import { Store } from "gatsby";

import fs from "fs-extra";
import path from "path";

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
  data: Buffer,
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

  await fs.ensureDir(pluginCacheDir);
  await fs.ensureDir(path.join(pluginCacheDir, hash));

  const dir: string = path.join(pluginCacheDir, hash);

  const filename = createFilePath(dir, "google-maps-static", `${ext}`);

  await fs.writeFile(filename, data);

  return filename;
};
