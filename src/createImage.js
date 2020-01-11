import fs from "fs-extra";
import path from "path";

const CACHE_DIR = `.cache`;
const FS_PLUGIN_DIR = `gatsby-source-googlemaps-static`;

const createFilePath = (directory, filename, ext) => {
    return path.join(directory, `${filename}${ext}`);
}

export default async (buf, store, ext, id) => {
    const pluginCacheDir = path.join(
        store.getState().program.directory,
        CACHE_DIR,
        FS_PLUGIN_DIR
    );

    const hash = `hash-${id}`;

    await fs.ensureDir(pluginCacheDir);

    await fs.ensureDir(path.join(pluginCacheDir, hash));

    const dir = path.join(pluginCacheDir, hash);

    const filename = createFilePath(
        dir,
        "google-maps-static",
        `.${ext}`
    );

    await fs.writeFile(filename, buf);

    return { absolutePath: filename, relativePath: path.relative(__dirname, filename), dir: dir, relativeDir: path.relative(__dirname, dir) };
};