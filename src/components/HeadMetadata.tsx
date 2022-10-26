import { Show } from "solid-js";
import { Meta, Title } from "solid-start";

type HeadMetadataProps = {
  title: string;
  description: string;
  /** @default "website" */
  type?: "website" | "article";
  url?: string;
  image?: string;
};

export function HeadMetadata(props: HeadMetadataProps) {
  return (
    <>
      <Title>dio.la - Dani Guardiola's blog</Title>

      <Meta property="og:title" content={props.title} />
      <Meta property="og:og:description" content={props.description} />
      <Meta property="og:locale" content="en_US" />
      <Meta property="og:type" content={props.type ?? "website"} />
      <Show when={props.url}>
        <Meta property="og:url" content={props.url} />
      </Show>
      <Show when={props.image}>
        <Meta property="og:image" content={props.image} />
      </Show>

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta
        name={`twitter:${props.type === "website" ? "site" : "creator"}`}
        content="@daniguardio_la"
      />
    </>
  );
}
