import { createEffect, createSignal, Show } from "solid-js";

// adapted from https://github.com/giscus/giscus-component/tree/main/solid
// MIT licensed: https://github.com/giscus/giscus-component/blob/main/LICENSE

// props
// -----

export type BooleanString = "0" | "1";

export type InputPosition = "top" | "bottom";

export type Repo = `${string}/${string}`;

export type Mapping =
  | "url"
  | "title"
  | "og:title"
  | "specific"
  | "number"
  | "pathname";

export type GenericString = string & Record<never, never>;

export type Theme =
  | "light"
  | "light_high_contrast"
  | "light_protanopia"
  | "light_tritanopia"
  | "dark"
  | "dark_high_contrast"
  | "dark_protanopia"
  | "dark_tritanopia"
  | "dark_dimmed"
  | "transparent_dark"
  | "preferred_color_scheme"
  | `https://${string}`
  | GenericString;

export type AvailableLanguage =
  | "de"
  | "gsw"
  | "en"
  | "es"
  | "fr"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "nl"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "tr"
  | "vi"
  | "zh-CN"
  | "zh-TW"
  | GenericString;

export type Loading = "lazy" | "eager";

export interface GiscusProps {
  id?: string;
  host?: string;
  repo: Repo;
  repoId: string;
  category?: string;
  categoryId?: string;
  mapping: Mapping;
  term?: string;
  theme?: Theme;
  strict?: BooleanString;
  reactionsEnabled?: BooleanString;
  emitMetadata?: BooleanString;
  inputPosition?: InputPosition;
  lang?: AvailableLanguage;
  loading?: Loading;
}

// web component types
// -------------------

export interface GiscusWidgetAttributes {
  id?: string;
  host?: string;
  repo: `${string}/${string}`;
  "repo-id": string;
  category?: string;
  "category-id"?: string;
  mapping: Mapping;
  term?: string;
  theme?: Theme;
  strict?: BooleanString;
  "reactions-enabled"?: BooleanString;
  "emit-metadata"?: BooleanString;
  "input-position"?: InputPosition;
  lang?: AvailableLanguage;
  loading?: Loading;
}

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "giscus-widget": GiscusWidgetAttributes;
    }
  }
}

// component
// ---------

export function Giscus(props: GiscusProps) {
  const [mounted, setMounted] = createSignal(false);

  createEffect(() => {
    if (mounted()) return;
    import("giscus");
    setMounted(true);
  });

  return (
    <Show when={mounted()}>
      <giscus-widget
        id={props.id}
        host={props.host}
        repo={props.repo}
        repo-id={props.repoId}
        category={props.category}
        category-id={props.categoryId}
        mapping={props.mapping}
        term={props.term}
        strict={props.strict}
        reactions-enabled={props.reactionsEnabled}
        emit-metadata={props.emitMetadata}
        input-position={props.inputPosition}
        theme={props.theme}
        lang={props.lang}
        loading={props.loading}
      />
    </Show>
  );
}
