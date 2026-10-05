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
import { getArticleReadingMinutes } from "~/lib/article-reading-time";
import { isDrafts, isLocalhost } from "~/utils/is-host";

const __filename = Bun.fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

const ARTICLES_BASE_PATH = path.resolve(__dirname, "../content/article");
const OUTPUT_DIR = path.resolve(__dirname, "../data/generated");
const OUTPUT_FILE_PATH = path.resolve(__dirname, OUTPUT_DIR, "articles.ts");
const PUBLIC_DIR = path.resolve(__dirname, "../../public");
const RSS_FILE_PATH = path.resolve(__dirname, PUBLIC_DIR, "rss.xml");

async function getArticleFilePaths() {
  const entries = await fs.readdir(ARTICLES_BASE_PATH, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(ARTICLES_BASE_PATH, entry.name);
    if (entry.isDirectory()) return [path.join(fullPath, "index.mdx")];
    return entry.isFile() && entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

type ArticleFrontmatter = Pick<
  ArticleMetadata,
  "date" | "title" | "description" | "topics" | "imageUrl" | "draft"
>;

export function validateMetadata(
  data: Record<string, unknown>,
  id: string
): asserts data is Record<string, unknown> & ArticleFrontmatter {
  if (
    REQUIRED_ARTICLE_FIELDS.some((key) => typeof data[key] !== "string" || data[key].trim() === "")
  )
    throw new Error(`Missing or empty required metadata fields in article with id "${id}"`);

  if (!Number.isFinite(new Date(data.date as string).getTime()))
    throw new Error(`Invalid date in article with id "${id}"`);
  if (data.topics !== undefined) {
    if (!Array.isArray(data.topics))
      throw new Error(`Topics must be an array, article id: "${id}"`);
    for (const topic of data.topics) {
      if (!ALLOWED_TOPICS.some((allowed) => allowed === topic))
        throw new Error(`Invalid topic "${topic}" in article with id "${id}"`);
    }
  }
  if (data.draft !== undefined && typeof data.draft !== "boolean")
    throw new Error(`Draft must be a boolean, article id: "${id}"`);
  if (data.imageUrl !== undefined && typeof data.imageUrl !== "string")
    throw new Error(`Image URL must be a string, article id: "${id}"`);
}

function getArticleId(articlePath: string) {
  const filename = path.parse(articlePath).name;
  return filename === "index" ? path.basename(path.dirname(articlePath)) : filename;
}

async function getArticleMetadata(articlePath: string) {
  const fileContents = await Bun.file(articlePath).text();
  const { data, content } = matter(fileContents);
  const id = getArticleId(articlePath);
  if (!id) throw new Error("Could not obtain article ID");
  validateMetadata(data, id);
  const metadata = {
    ...data,
    id: id as ArticleMetadata["id"],
    readingMinutes: getArticleReadingMinutes(content)
  };
  return metadata;
}

async function getArticleMetadataList(articleFilePaths: string[]) {
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

function escapeXml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateRssItem({ title, id, description, date }: ArticleMetadata) {
  const localDate = new Date(date);
  const formattedUtcDate = new Date(
    Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 9, 0, 0, 0)
  ).toUTCString();
  const url = `https://${CANONICAL_DOMAIN}/article/${id}`;
  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(`hi@daniguardio.la (${NAME})`)}</author>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
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
  const files = await getArticleFilePaths();
  const articleMetadataList = await getArticleMetadataList(files);
  await generateOutputFile(articleMetadataList);
  await Bun.write(
    path.join(OUTPUT_DIR, "article-paths.json"),
    JSON.stringify(articleMetadataList.map(({ id }) => `/article/${id}`))
  );
  await generateRSS(articleMetadataList);
  const ids = new Set<string>(articleMetadataList.map(({ id }) => id));
  const entries = files
    .filter((file) => ids.has(getArticleId(file)))
    .map((file) => {
      const id = getArticleId(file);
      const relative = path.relative(OUTPUT_DIR, file).split(path.sep).join("/");
      return `${JSON.stringify(id)}: lazy(() => import(${JSON.stringify(relative)}))`;
    });
  await Bun.write(
    path.join(OUTPUT_DIR, "article-components.ts"),
    `import { lazy } from "solid-js";\nexport const ARTICLE_COMPONENTS = {${entries.join(",\n")}};\n`
  );
}

if (import.meta.main) await main();
