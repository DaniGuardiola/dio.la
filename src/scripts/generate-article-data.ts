import matter from "gray-matter";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import { ESLint } from "eslint";

import type { ArticleMetadata } from "~/data/articles";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_BASE_PATH = path.resolve(__dirname, "../routes/article");
const OUTPUT_FILE_PATH = path.resolve(
  __dirname,
  "../data/generated/articles.ts"
);

async function getArticleFilePaths() {
  const pathList = await fs.readdir(ARTICLES_BASE_PATH);
  const promises = pathList.map(async (fileOrDirPath) => {
    const fullPath = path.resolve(ARTICLES_BASE_PATH, fileOrDirPath);
    const isDir = (await fs.stat(fullPath)).isDirectory();
    if (isDir) return path.join(fullPath, "index.mdx");
    if (fileOrDirPath.endsWith(".mdx")) return fullPath;
  });
  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises.filter(
    <T>(value: T): value is Exclude<T, undefined> => value !== undefined
  );
}

async function getArticleMetadata(articlePath: string) {
  const fileContents = await fs.readFile(articlePath, "utf8");
  const { data } = matter(fileContents);
  const id = articlePath
    .replace(/\/index.mdx$/, "")
    .split("/")
    .at(-1)
    ?.replace(/\.mdx$/, "");
  if (!id) throw new Error("Could not obtain article ID");
  return { id, ...data } as ArticleMetadata;
}

async function getArticleMetadataList() {
  const articleFilePaths = await getArticleFilePaths();
  const promises = articleFilePaths.map(getArticleMetadata);
  return Promise.all(promises);
}

async function formatFile(filepath: string) {
  const file = await fs.readFile(filepath, { encoding: "utf-8" });
  const formatted = prettier.format(file, { filepath });
  return fs.writeFile(filepath, formatted);
}

async function autofixFile(filePath: string) {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles([filePath]);
  await ESLint.outputFixes(results);
}

async function generateOutputFile(articleMetadataList: ArticleMetadata[]) {
  const ids = articleMetadataList.map(({ id }) => id);
  const parts = [
    "// This file has been automatically generated and should not be modified manually.",
    'import type { ArticleMetadata } from "~/data/articles";',
    `\nexport type ArticleId = ${ids.map((id) => `"${id}"`).join(" | ")}`,
    "\nexport const ARTICLES: ArticleMetadata[] =",
    JSON.stringify(articleMetadataList),
  ];
  fs.writeFile(OUTPUT_FILE_PATH, parts.join("\n"));
  await autofixFile(OUTPUT_FILE_PATH);
  await formatFile(OUTPUT_FILE_PATH);
}

async function main() {
  const articleMetadataList = await getArticleMetadataList();
  await generateOutputFile(articleMetadataList);
}

await main();
