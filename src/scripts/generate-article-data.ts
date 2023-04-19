import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";
import matter from "gray-matter";
import prettier from "prettier";

import type { ArticleMetadata } from "~/data/articles";
import { ALLOWED_TOPICS, REQUIRED_ARTICLE_FIELDS } from "~/data/config";
import { isDrafts, isLocalhost } from "~/utils/is-host";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_BASE_PATH = path.resolve(__dirname, "../routes/article");
const OUTPUT_DIR = path.resolve(__dirname, "../data/generated");
const OUTPUT_FILE_PATH = path.resolve(__dirname, OUTPUT_DIR, "articles.ts");

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
    data.topics.some((topic) => {
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
  const filename = path.parse(articlePath).name;
  const id =
    filename === "index" ? path.basename(path.dirname(articlePath)) : filename;
  if (!id) throw new Error("Could not obtain article ID");
  // @ts-expect-error This is fine.
  validateMetadata({ id, ...data });
  return { id, ...data } as ArticleMetadata;
}

async function getArticleMetadataList() {
  const articleFilePaths = await getArticleFilePaths();
  const promises = articleFilePaths.map(getArticleMetadata);
  const metadataList = (await Promise.all(promises)).sort((a, b) => {
    // sort by time and alphabetically
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    if (aTime !== bTime) return bTime - aTime;
    return a.title.localeCompare(b.title);
  });
  return isLocalhost() || isDrafts()
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
    'import { linkArticles } from "~/data/link-articles";',
    `\nexport type ArticleId = ${ids.map((id) => `"${id}"`).join(" | ")}`,
    "\nexport const ARTICLES: ArticleMetadata[] = linkArticles(",
    JSON.stringify(articleMetadataList),
    ")",
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
