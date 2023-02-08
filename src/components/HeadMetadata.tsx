import { Show } from "solid-js";
import { Meta, Title } from "solid-start";
import { BASE_PAGE_TITLE, NAME, TWITTER_USERNAME } from "~/data/config";

type HeadMetadataProps = {
  description: string;
  title?: string;
  /** @default "website" */
  type?: "website" | "article";
  url?: string;
  image?: string;
};

export function HeadMetadata(props: HeadMetadataProps) {
  const title = () =>
    `${props.title ? `${props.title} | ` : ""}${BASE_PAGE_TITLE}`;
  return (
    <>
      <Title>{title()}</Title>
      <Meta name="description" content={props.description} />
      <Meta name="author" content={NAME} />

      <Meta property="og:title" content={title()} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:locale" content="en_US" />
      <Meta property="og:type" content={props.type ?? "website"} />
      <Show when={props.url}>
        <Meta property="og:url" content={props.url} />
      </Show>
      <Show when={props.image}>
        {/* TODO: default image */}
        <Meta property="og:image" content={props.image} />
      </Show>

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta
        name={`twitter:${props.type === "website" ? "site" : "creator"}`}
        content={`@${TWITTER_USERNAME}`}
      />
    </>
  );
}
