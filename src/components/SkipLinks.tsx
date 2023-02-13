import clsx from "clsx";
import { type ComponentProps, createSignal, For, Show } from "solid-js";
import { Portal } from "solid-js/web";

const [skipLinkAreaElement, setSkipLinkAreaElement] =
  createSignal<HTMLElement>();

export function SkipLinkArea() {
  return <div ref={setSkipLinkAreaElement} />;
}

type SkipLinkData = { label: string; id: string };

type SkipLinksProps = { links: SkipLinkData[] };

export function SkipLinks(props: SkipLinksProps) {
  return (
    <Show when={skipLinkAreaElement()}>
      <Portal mount={skipLinkAreaElement()}>
        <For each={props.links}>
          {({ id, label }) => (
            <a
              href={`#${id}`}
              class={clsx(
                "[&:not(:focus-visible)]:sr-only",
                "fixed top-0 left-0 z-30",
                "bg-white border m-2 p-2 border-accent outline-none shadow rounded font-bold"
              )}
            >
              Skip to {label}
            </a>
          )}
        </For>
      </Portal>
    </Show>
  );
}

type SkipLinkProps = {
  id: string;
} & Omit<ComponentProps<"div">, "id">;

export function SkipLink(props: SkipLinkProps) {
  return <div {...props} class={clsx("focus-scroll-target", props.class)} />;
}
