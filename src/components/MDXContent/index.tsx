import "./styles.sass";
import "katex/dist/katex.min.css";

import clsx from "clsx";
import { ComponentProps, createSignal, JSX } from "solid-js";
import { MDXProvider } from "solid-mdx";
import { A } from "solid-start";
import pDebounce from "p-debounce";
import { Dynamic } from "solid-js/web";

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

function DataLSP(props: ComponentProps<"span">) {
  const lspAttr = () =>
    ((props as any).lsp as string).replaceAll("&quot;", '"');
  return (
    <span
      {...props}
      data-lsp={lspAttr()
        // workaround for shiki-twoslash, see file: patches/shiki-twoslash@x.x.x.patch
        .replace("--LINEBREAK--", "\n")}
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
      onscroll={(event) => setScrollXDebounced(event.currentTarget.scrollLeft)}
      style={
        typeof props.style === "string"
          ? `--scroll-x:${scrollX()}px;${props.style}`
          : { ...props.style, "--scroll-x": `${scrollX()}px` }
      }
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
          a: A,
          "data-lsp": DataLSP,
          "data-err": DataErr,
          pre: Pre,
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
