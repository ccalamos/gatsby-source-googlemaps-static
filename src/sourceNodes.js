import axios from "axios";

import getParams from "./setupParams";
import createImageFile from "./createImage";
import { createFileNode } from "gatsby-source-filesystem/create-file-node";

const MAX_GOOGLE_URL_SIZE = 8192;

const cacheId = hash => `google-maps-static-cache-${hash}`;
const isCached = async (cache, hash) => await cache.get(cacheId(hash));
const setCache = async (cache, hash, path) =>
    await cache.set(cacheId(hash), path);

async function sourceNodes(
    { actions, createNodeId, createContentDigest, store, cache },
    configOptions
) {
    const { createNode } = actions;
    delete configOptions.plugins;

    const format = configOptions.format || "png";
    const { params, hash, center } = getParams(configOptions);
    const id = createNodeId(`google-maps-static-${hash}`);
    const apiUrl = `https://maps.googleapis.com/maps/api/staticmap?${params}`;

    if (apiUrl.length > MAX_GOOGLE_URL_SIZE) {
        throw new Error(
            `URL cannot be over ${MAX_GOOGLE_URL_SIZE} after decoding.\nPlease see https://developers.google.com/maps/documentation/maps-static/dev-guide?hl=en_US#url-size-restriction for more info.`
        );
    }

    const getPhotoBuffer = async url => {
        return axios({
            url,
            method: "GET",
            responseType: "arraybuffer",
        });
    };

    const createNodes = async API => {
        let paths;
        const cachedPaths = await isCached(cache, hash);

        if (!!cachedPaths) {
            paths = JSON.parse(cachedPaths);
        } else {
            await getPhotoBuffer(API).then(async response => {
                paths = await createImageFile(
                    response.data,
                    store,
                    format,
                    hash
                );

                await setCache(cache, hash, JSON.stringify(paths));
            });
        }

        await processBuffer({
            ...paths,
            ext: format,
        });
    };

    const processBuffer = async datum => {
        const fileNode = await createFileNode(
            datum.absolutePath,
            createNodeId,
            {}
        );
        fileNode.internal.description = `File "Google Maps Static Image of ${center} (Hash: ${hash})"`;
        fileNode.hash = hash;
        fileNode.parent = id;

        await createNode({ ...fileNode }, { name: `gatsby-source-filesystem` });

        const nodeContent = JSON.stringify(datum);
        const nodeMeta = {
            id: id,
            parent: null,
            children: [fileNode.id],
            internal: {
                type: `StaticMap`,
                content: nodeContent,
                contentDigest: createContentDigest(datum),
            },
        };
        const node = Object.assign({}, datum, nodeMeta);

        await createNode(node);
    };

    return createNodes(apiUrl);
}

export default sourceNodes;
