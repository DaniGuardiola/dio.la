import { dynamic } from "@solidjs/web";
import type { JSX } from "@solidjs/web";
import { createContext, useContext } from "solid-js";
import type { Component } from "solid-js";

type Components = Record<string, Component<any>>;
const nativeComponents = Object.fromEntries(
  "a abbr address article aside b blockquote br button caption cite code col colgroup dd del details div dl dt em figcaption figure footer h1 h2 h3 h4 h5 h6 header hr i iframe img input kbd label li main mark nav ol p picture pre q s section small source span strong sub summary sup table tbody td textarea th thead time tr u ul video"
    .split(" ")
    .map((tag) => [tag, dynamic(() => tag)])
);
const MDXContext = createContext<Components>({});
export function useMDXComponents(components?: Components) {
  return { ...nativeComponents, ...useContext(MDXContext), ...components };
}
export function MDXProvider(props: { components: Components; children?: JSX.Element }) {
  // oxlint-disable-next-line solid/reactivity -- Each provider owns a fixed component map.
  return <MDXContext value={props.components}>{props.children}</MDXContext>;
}
