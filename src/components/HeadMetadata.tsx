import { Show } from "solid-js";
import { Meta, Title } from "solid-start";

import {
  BASE_PAGE_TITLE,
  CANONICAL_DOMAIN,
  NAME,
  TWITTER_USERNAME,
} from "~/data/config";

const DEFAULT_IMAGE = "/open-graph/default.png";
const DOMAIN =
  typeof window !== "undefined" ? window.location.host : CANONICAL_DOMAIN;

type HeadMetadataProps = {
  description: string;
  title?: string;
  /** @default "website" */
  type?: "website" | "article";
  url?: string;
  image?: string;
  titleSuffix?: boolean;
};

export function HeadMetadata(props: HeadMetadataProps) {
  const title = () =>
    props.titleSuffix === false
      ? props.title
      : `${props.title ? `${props.title} | ` : ""}${BASE_PAGE_TITLE}`;
  return (
    <>
      <Title>{title()}</Title>
      <Meta name="description" content={props.description} />
      <Meta name="author" content={NAME} />

      <Meta name="og:title" property="og:title" content={title()} />
      <Meta
        name="og:description"
        property="og:description"
        content={props.description}
      />
      <Meta name="og:locale" property="og:locale" content="en_US" />
      <Meta
        name="og:type"
        property="og:type"
        content={props.type ?? "website"}
      />
      <Show when={props.url}>
        <Meta name="og:url" property="og:url" content={props.url} />
      </Show>
      <Meta
        name="og:image"
        property="og:image"
        content={`https://${DOMAIN}${props.image ?? DEFAULT_IMAGE}`}
      />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta
        name={`twitter:${props.type === "website" ? "site" : "creator"}`}
        content={`@${TWITTER_USERNAME}`}
      />
    </>
  );
}
