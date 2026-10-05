import path from "node:path";

import type { Root } from "hast";
import { imageSizeFromFile } from "image-size/fromFile";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// Reserve image space before lazy loading. Media imports still belong to Vite.
export const rehypeImageDimensions: Plugin<[], Root> = () => async (tree, file) => {
  if (!file.dirname) return;
  const pending: Promise<void>[] = [];
  visit(tree, "element", (node) => {
    const { src, width, height } = node.properties;
    if (
      node.tagName !== "img" ||
      typeof src !== "string" ||
      /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src) ||
      width !== undefined ||
      height !== undefined
    )
      return;

    const imagePath = src.startsWith("/")
      ? path.resolve("public", `.${src.split(/[?#]/)[0]}`)
      : path.resolve(file.dirname!, src.split(/[?#]/)[0]);
    pending.push(
      imageSizeFromFile(imagePath).then((dimensions) => {
        node.properties.width = dimensions.width;
        node.properties.height = dimensions.height;
      })
    );
  });
  await Promise.all(pending);
};
