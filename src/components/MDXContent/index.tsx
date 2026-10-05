import "@shikijs/twoslash/style-rich.css";
import "./styles.css";
import "katex/dist/katex.min.css";
import { type ComponentProps, type JSX } from "@solidjs/web";
import { Dynamic } from "@solidjs/web";
import clsx from "clsx";

import { MDXProvider } from "~/utils/mdx";

const KATEX_TAGS = [
  "math",
  "annotation",
  "semantics",
  "mtext",
  "mn",
  "mo",
  "mi",
  "mspace",
  "mover",
  "munder",
  "munderover",
  "msup",
  "msub",
  "msubsup",
  "mfrac",
  "mroot",
  "msqrt",
  "mtable",
  "mtr",
  "mtd",
  "mlabeledtr",
  "mrow",
  "menclose",
  "mstyle",
  "mpadded",
  "mphantom",
  "mglyph",
  "svg",
  "line",
  "path"
];

function YoutubeVideo(props: { id: string }) {
  return (
    <iframe
      loading="lazy"
      class="w-full aspect-video"
      src={`https://www.youtube-nocookie.com/embed/${props.id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  );
}

type ImageMetadata = {
  invert?: boolean;
};

function Image(props: ComponentProps<"img">) {
  const alt = () => {
    let text = "";
    let metadata = {} as ImageMetadata;
    if (props.alt) {
      const parts = props.alt.split("||");
      if (parts[1]) {
        text = parts[1].trim();
        metadata = Object.fromEntries(
          parts[0].split("&&").map((fragment) => {
            const [key, value] = fragment.split("=").map((s) => s.trim());
            return [key, value || true];
          })
        );
      } else text = parts[0].trim();
    }
    return { text, metadata };
  };
  return (
    <img
      loading="lazy"
      title={alt().text}
      {...props}
      alt={alt().text}
      class={clsx(alt().metadata.invert && "dark:invert", props.class)}
    />
  );
}

function stub<T extends string>(component: T) {
  return function StubComponent(props: ComponentProps<T>) {
    return <Dynamic component={component} {...props} />;
  };
}

function createHeading(type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function Heading(props: ComponentProps<typeof type>) {
    return (
      <Dynamic component={type} {...props}>
        <a href={`#${props.id}`}>{props.children}</a>
      </Dynamic>
    );
  };
}

type MDXContentProps = { children?: JSX.Element };

export function MDXContent(props: MDXContentProps) {
  return (
    <div class="mdx-content">
      <MDXProvider
        components={{
          img: Image,
          YoutubeVideo,
          ...KATEX_TAGS.reduce((obj, component) => ({ ...obj, [component]: stub(component) }), {}),
          ...Object.fromEntries(
            (["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((type) => [
              type,
              createHeading(type)
            ])
          )
        }}
      >
        {props.children}
      </MDXProvider>
    </div>
  );
}
