import { NodePluginArgs } from "gatsby";
import { createFileNode } from "gatsby-source-filesystem/create-file-node";

import StaticMap from "./static-map";

const processNodes = async (
  datum: NodeDatum,
  {
    actions,
    createContentDigest,
    createNodeId,
  }: Pick<NodePluginArgs, "actions" | "createContentDigest" | "createNodeId">,
): Promise<void> => {
  const { createNode } = actions;

  const fileNode = await createFileNode(datum.absolutePath, createNodeId, {});

  fileNode.internal.description = `File "Google Maps Static Image of ${datum.center} (Hash: ${datum.hash})"`;
  fileNode.hash = datum.hash;
  fileNode.parent = datum.id;

  await createNode({ ...fileNode }, { name: `gatsby-source-filesystem` });

  const nodeContent = JSON.stringify(datum);
  const nodeMeta = {
    children: [fileNode.id],
    id: datum.id,
    parent: undefined,
    internal: {
      content: nodeContent,
      contentDigest: createContentDigest(datum),
      type: `StaticMap`,
    },
  };
  const node = Object.assign({}, datum, nodeMeta);
  await createNode(node);
};

const processMap = async (
  { createNodeId, store, cache, ...plugingArgs }: NodePluginArgs,
  options: Omit<ConfigOptions, "maps" | "plugins">,
): Promise<void> => {
  const GeneratedMap = new StaticMap(options, cache, store);
  const filePath = await GeneratedMap.getFilePath(options.key, options.secret);
  const id = createNodeId(`google-maps-static-${filePath.hash}`);

  return await processNodes(
    {
      ...filePath,
      id,
      mapUrl: GeneratedMap.url,
      nickname: options.nickname || id,
    },
    { ...plugingArgs, createNodeId },
  );
};

export default async function sourceNodes(
  pluginArgs: NodePluginArgs,
  config: ConfigOptions,
): Promise<void> {
  if (!config.key)
    throw new Error("Must provide an API key for Google Maps Static.");

  for (const map of config.maps ?? [config]) {
    await processMap(pluginArgs, { ...config, ...map });
  }

  return;
}
