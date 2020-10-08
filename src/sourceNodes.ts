import { ConfigOptions } from "gatsby-source-googlemaps-static";
import { Store, NodePluginArgs } from "gatsby";

import { createFileNode } from "gatsby-source-filesystem/create-file-node";

import StaticMap from "./static-map";

async function sourceNodes(
    {
        actions,
        createNodeId,
        createContentDigest,
        store,
        cache,
    }: {
        actions: {
            createNode: (
                fileNode: unknown,
                options?: Record<string, unknown>
            ) => unknown;
        };
        createNodeId: (hash: string) => string;
        createContentDigest: (datum: Record<string, string>) => unknown;
        store: Store;
        cache: NodePluginArgs["cache"];
    },
    configOptions: ConfigOptions
): Promise<void> {
    delete configOptions.plugins;
    const { createNode } = actions;

    const processMap = async (options: ConfigOptions): Promise<void> => {
        const Map = new StaticMap(options, cache, store);

        if (!configOptions.key) {
            throw new Error("Must provide an API key for Google Maps Static.");
        }

        const { absolutePath, center, hash } = await Map.getFilePath(
            configOptions.key,
            configOptions.secret
        );

        const id = createNodeId(`google-maps-static-${hash}`);

        const processNodes = async (
            datum: Record<string, string>
        ): Promise<void> => {
            const fileNode = await createFileNode(
                datum.absolutePath,
                createNodeId,
                {}
            );

            fileNode.internal.description = `File "Google Maps Static Image of ${datum.center} (Hash: ${datum.hash})"`;
            fileNode.hash = datum.hash;
            fileNode.parent = datum.id;

            await createNode(
                { ...fileNode },
                { name: `gatsby-source-filesystem` }
            );

            const nodeContent = JSON.stringify(datum);
            const nodeMeta = {
                children: [fileNode.id],
                id,
                parent: null,
                internal: {
                    content: nodeContent,
                    contentDigest: createContentDigest(datum),
                    type: `StaticMap`,
                },
            };
            const node = Object.assign({}, datum, nodeMeta);

            await createNode(node);
        };

        return await processNodes({
            absolutePath,
            center: center as string,
            hash,
            id,
            mapUrl: Map.url,
            nickname: options.nickname || id,
        });
    };

    const defaultOptions = { ...configOptions };
    delete defaultOptions.key;
    delete defaultOptions.secret;

    if (configOptions.maps) {
        delete defaultOptions.maps;

        for (const map of configOptions.maps) {
            const currentMapOptions = { ...defaultOptions, ...map };
            await processMap(currentMapOptions);
        }
    } else {
        await processMap(defaultOptions);
    }

    return;
}

export default sourceNodes;
