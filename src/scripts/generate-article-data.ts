import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { format } from "oxfmt";

import type { ArticleMetadata } from "~/data/articles";
import {
  ALLOWED_TOPICS,
  BASE_PAGE_TITLE,
  CANONICAL_DOMAIN,
  NAME,
  REQUIRED_ARTICLE_FIELDS,
  SITE_DESCRIPTION
} from "~/data/config";
import { isDrafts, isLocalhost } from "~/utils/is-host";

const __filename = Bun.fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const ARTICLES_BASE_PATH = path.resolve(__dirname, "../content/article");
const OUTPUT_DIR = path.resolve(__dirname, "../data/generated");
const OUTPUT_FILE_PATH = path.resolve(__dirname, OUTPUT_DIR, "articles.ts");
const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const RSS_FILE_PATH = path.resolve(__dirname, PUBLIC_DIR, "rss.xml");

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
    throw new Error(`Missing or empty required metadata fields in article with id "${id}"`);

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
    throw new Error(`Invalid topic "${invalidTopic}" in article with id "${id}"`);
}

async function getArticleMetadata(articlePath: string) {
  const fileContents = await Bun.file(articlePath).text();
  const { data } = matter(fileContents) as unknown as {
    data: Omit<ArticleMetadata, "id">;
  };
  const filename = path.parse(articlePath).name;
  const id = filename === "index" ? path.basename(path.dirname(articlePath)) : filename;
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
  const file = Bun.file(filepath);
  const content = await file.text();
  const formatted = await format(filepath, content, {
    trailingComma: "none",
    sortImports: {}
  });
  if (formatted.errors.length) {
    throw new Error(`Could not format generated article data: ${JSON.stringify(formatted.errors)}`);
  }
  return Bun.write(file, formatted.code);
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
    ")"
  ];
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await Bun.write(OUTPUT_FILE_PATH, parts.join("\n"));
  await formatFile(OUTPUT_FILE_PATH);
}

const RSS_HEADER = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BASE_PAGE_TITLE}</title>
    <link>https://${CANONICAL_DOMAIN}/</link>
    <atom:link href="https://${CANONICAL_DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${SITE_DESCRIPTION}</description>
    `;
const RSS_FOOTER = `
  </channel>
</rss>
`;

function generateRssItem({ title, id, description, date }: ArticleMetadata) {
  const localDate = new Date(date);
  const formattedUtcDate = new Date(
    Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 9, 0, 0, 0)
  ).toUTCString();
  const url = `https://${CANONICAL_DOMAIN}/article/${id}`;
  return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <description>${description}</description>
      <author>hi@daniguardio.la (${NAME})</author>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${formattedUtcDate}</pubDate>
    </item>`;
}

async function generateRSS(articleMetadataList: ArticleMetadata[]) {
  const items = articleMetadataList
    .filter(({ draft }) => !draft)
    .map(generateRssItem)
    .join("\n");
  const file = `${RSS_HEADER}\n${items}\n${RSS_FOOTER}`;
  await Bun.write(RSS_FILE_PATH, file);
}

async function main() {
  const articleMetadataList = await getArticleMetadataList();
  await generateOutputFile(articleMetadataList);
  await Bun.write(
    path.join(OUTPUT_DIR, "article-paths.json"),
    JSON.stringify(articleMetadataList.map(({ id }) => `/article/${id}`))
  );
  await generateRSS(articleMetadataList);
  const files = await getArticleFilePaths();
  const entries = files
    .filter((file) =>
      articleMetadataList.some(
        (article) =>
          file.endsWith(`/${article.id}/index.mdx`) || file.endsWith(`/${article.id}.mdx`)
      )
    )
    .map((file) => {
      const id =
        path.basename(file) === "index.mdx"
          ? path.basename(path.dirname(file))
          : path.basename(file, ".mdx");
      const relative = path.relative(OUTPUT_DIR, file).split(path.sep).join("/");
      return `${JSON.stringify(id)}: lazy(() => import(${JSON.stringify(relative)}))`;
    });
  await Bun.write(
    path.join(OUTPUT_DIR, "article-components.ts"),
    `import { lazy } from "solid-js";\nexport const ARTICLE_COMPONENTS = {${entries.join(",\n")}};\n`
  );
}

await main();
