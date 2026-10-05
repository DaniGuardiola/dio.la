import { type ComponentProps } from "@solidjs/web";
import clsx from "clsx";
import { omit } from "solid-js";

type BlitzProps = ComponentProps<"iframe"> & {
  blitzId: string;
  file?: string;
  /**
   * @default "preview"
   */
  view?: "editor" | "preview" | "both";

  params?: {
    ctl?: boolean;
    devtoolsheight?: number;
    hidedevtools?: boolean;
    hideExplorer?: boolean;
    hideNavigation?: boolean;
    initialpath?: string;
    showSidebar?: boolean;
    startScript?: string;
    terminalHeight?: number;
    theme?: "light" | "dark";
  };
};

const DEFAULTS = {
  view: "preview",
  hideNavigation: true
};

function toParamValue(value: string | number | boolean) {
  if (typeof value === "boolean") return value ? "1" : "0";
  return value.toString();
}

export function Blitz(props: BlitzProps) {
  const htmlProps = omit(props, "blitzId", "file", "view", "params");
  const searchParams = () => {
    const params = new URLSearchParams({ embed: "1" });

    // Set defaults.
    Object.entries(DEFAULTS).forEach(([key, value]) => params.set(key, toParamValue(value)));

    // Set user-defined values.
    if (props.file) params.set("file", props.file);
    if (props.view) params.set("view", props.view);
    if (props.params) {
      for (const [key, value] of Object.entries(props.params)) {
        params.set(key, toParamValue(value));
      }
    }
    return params;
  };
  return (
    <iframe
      title="Interactive code example on StackBlitz"
      loading="lazy"
      src={`https://stackblitz.com/edit/${props.blitzId}?${searchParams()}`}
      {...htmlProps}
      class={clsx(
        "w-[calc(100%+2rem)] min-h-[32rem] -mx-4 my-[1.25em] rounded-lg",
        htmlProps.class
      )}
    />
  );
}
