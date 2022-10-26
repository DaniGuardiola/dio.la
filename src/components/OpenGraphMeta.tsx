import { Show } from "solid-js";
import { Meta } from "solid-start";

type HeadMetaProps = {
  title: string;
  description: string;
  /** @default "website" */
  type?: "website" | "article";
  /** @default "creator" */
  twitterUsernameMode?: "creator" | "site";
  url?: string;
  image?: string;
};

export function OpenGraphMeta(props: HeadMetaProps) {
  return (
    <>
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
        name={`twitter:${props.twitterUsernameMode}`}
        content="@daniguardio_la"
      />
    </>
  );
}
