import "./styles.sass";
import "katex/dist/katex.min.css";

import clsx from "clsx";
import pDebounce from "p-debounce";
import { type ComponentProps, createSignal, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { MDXProvider } from "solid-mdx";
import { type A } from "solid-start";

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
  "path",
];

function Anchor(props: ComponentProps<typeof A>) {
  // unfortunately, client-side navigation doesn't work with solid-start inside MDX content
  return <a {...(props as ComponentProps<"a">)} />;

  // return (
  //   <Switch fallback={<A {...props} />}>
  //     <Match when={props.href.startsWith("mailto:")}>
  //       <a target="_blank" {...(props as ComponentProps<"a">)} />
  //     </Match>
  //     <Match when={props.href.startsWith("#")}>
  //       <a {...(props as ComponentProps<"a">)} />
  //     </Match>
  //   </Switch>
  // );
}

function DataLSP(props: ComponentProps<"span"> & { lsp: string }) {
  const lspAttr = () => props.lsp.replaceAll("&quot;", '"');
  return (
    <span
      {...props}
      data-lsp={lspAttr()
        // workaround for shiki-twoslash, see file: patches/shiki-twoslash@x.x.x.patch
        .replaceAll("--LINEBREAK--", "\n")}
      class={clsx("data-lsp", props.class)}
    />
  );
}

function DataErr(props: ComponentProps<"span">) {
  return <span {...props} class={clsx("data-err", props.class)} />;
}

function Pre(props: ComponentProps<"pre">) {
  const [scrollX, setScrollX] = createSignal(0);

  const setScrollXDebounced = pDebounce(setScrollX, 100);

  return (
    <pre
      {...props}
      onScroll={(event) => setScrollXDebounced(event.currentTarget.scrollLeft)}
      style={
        typeof props.style === "string"
          ? `--scroll-x:${scrollX()}px;${props.style}`
          : { ...props.style, "--scroll-x": `${scrollX()}px` }
      }
    />
  );
}

function YoutubeVideo(props: { id: string }) {
  return (
    <iframe
      class="w-full aspect-video"
      src={`https://www.youtube-nocookie.com/embed/${props.id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  );
}

function stub<T extends string>(component: T) {
  return function StubComponent(props: ComponentProps<T>) {
    return <Dynamic component={component} {...props} />;
  };
}

type MDXContentProps = { children?: JSX.Element };

export function MDXContent(props: MDXContentProps) {
  return (
    <div class="mdx-content">
      <MDXProvider
        components={{
          a: Anchor,
          "data-lsp": DataLSP,
          "data-err": DataErr,
          pre: Pre,
          YoutubeVideo,
          ...KATEX_TAGS.reduce(
            (obj, component) => ({ ...obj, [component]: stub(component) }),
            {}
          ),
        }}
      >
        {props.children}
      </MDXProvider>
    </div>
  );
}
