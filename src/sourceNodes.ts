import { createFileNode } from "gatsby-source-filesystem/create-file-node";

import StaticMap from "./static-map";

async function sourceNodes(
    { actions, createNodeId, createContentDigest, store, cache },
    configOptions
) {
    const Map = new StaticMap(configOptions, cache, store);
    const { createNode } = actions;

    delete configOptions.plugins;

    const processNodes = async datum => {
        const fileNode = await createFileNode(
            datum.absolutePath,
            createNodeId,
            {}
        );

        fileNode.internal.description = `File "Google Maps Static Image of ${datum.center} (Hash: ${datum.hash})"`;
        fileNode.hash = datum.hash;
        fileNode.parent = datum.id;

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

    const { absolutePath, center, hash } = await Map.getFilePath(
        configOptions.key,
        configOptions.secret
    );
    const id = createNodeId(`google-maps-static-${hash}`);

    return processNodes({ absolutePath, center, hash, id, mapUrl: Map.url });
}

export default sourceNodes;
