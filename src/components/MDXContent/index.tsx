import clsx from "clsx";
import { ComponentProps, createSignal, JSX } from "solid-js";
import { MDXProvider } from "solid-mdx";
import { A } from "solid-start";
import pDebounce from "p-debounce";
import "./styles.sass";

type MDXContentProps = {
  children?: JSX.Element;
};

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

export function MDXContent(props: MDXContentProps) {
  return (
    <div class="mdx-content">
      <MDXProvider
        components={{
          a: A,
          "data-lsp": DataLSP,
          "data-err": DataErr,
          pre: Pre,
        }}
      >
        {props.children}
      </MDXProvider>
    </div>
  );
}
