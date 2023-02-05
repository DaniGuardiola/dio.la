import matter from "gray-matter";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import { ESLint } from "eslint";

import type { ArticleMetadata } from "~/data/articles";
import {
  ALLOWED_TOPICS,
  DRAFTS_DOMAIN,
  REQUIRED_ARTICLE_FIELDS,
} from "~/data/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_BASE_PATH = path.resolve(__dirname, "../routes/article");
const OUTPUT_DIR = path.resolve(__dirname, "../data/generated");
const OUTPUT_FILE_PATH = path.resolve(__dirname, OUTPUT_DIR, "articles.ts");

const DRAFTS_ENABLED =
  process.env.NODE_ENV === "development" ||
  process.env.VITE_VERCEL_URL === DRAFTS_DOMAIN;

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

function validateMetadata({ id, ...data }: ArticleMetadata) {
  if (REQUIRED_ARTICLE_FIELDS.some((key) => !(key in data) || key === ""))
    throw new Error(
      `Missing or empty required metadata fields in article with id "${id}"`
    );

  if (data.topics && !Array.isArray(data.topics))
    throw new Error(`Topics must be an array, article id: "${id}"`);

  let invalidTopic;
  if (
    data.topics &&
    data.topics.every((topic) => {
      const invalid = !ALLOWED_TOPICS.includes(topic);
      if (invalid) invalidTopic = topic;
      return invalid;
    })
  )
    throw new Error(
      `Invalid topic "${invalidTopic}" in article with id "${id}"`
    );
}

async function getArticleMetadata(articlePath: string) {
  const fileContents = await fs.readFile(articlePath, "utf8");
  const { data } = matter(fileContents) as unknown as {
    data: Omit<ArticleMetadata, "id">;
  };
  const id = articlePath
    .replace(/\/index.mdx$/, "")
    .split("/")
    .at(-1)
    ?.replace(/\.mdx$/, "");
  if (!id) throw new Error("Could not obtain article ID");
  validateMetadata({ id, ...data });
  return { id, ...data } as ArticleMetadata;
}

async function getArticleMetadataList() {
  const articleFilePaths = await getArticleFilePaths();
  const promises = articleFilePaths.map(getArticleMetadata);
  const metadataList = await Promise.all(promises);
  return DRAFTS_ENABLED
    ? metadataList
    : metadataList.filter((metadata) => !metadata.draft);
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
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE_PATH, parts.join("\n"));
  await autofixFile(OUTPUT_FILE_PATH);
  await formatFile(OUTPUT_FILE_PATH);
}

async function main() {
  const articleMetadataList = await getArticleMetadataList();
  await generateOutputFile(articleMetadataList);
}

await main();
