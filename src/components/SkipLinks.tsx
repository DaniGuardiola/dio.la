import clsx from "clsx";
import { For, Portal } from "solid-js/web";

type SkipLinkData = {
  label: string;
  id: string;
};

type SkipLinksProps = {
  links: SkipLinkData[];
};

export function SkipLinks({ links }: SkipLinksProps) {
  return (
    <Portal mount={document.getElementById("skip-link-area")}>
      <For each={links}>
        {({ id, label }) => (
          <a
            href={`#${id}`}
            class={clsx(
              "[&:not(:focus-visible)]:sr-only",
              "fixed top-0 left-0 z-10",
              "bg-white border m-2 p-2 border-accent outline-none shadow rounded font-bold"
            )}
          >
            Skip to {label}
          </a>
        )}
      </For>
    </Portal>
  );
}

type SkipLinkProps = {
  id: string;
};

export function SkipLink({ id }: SkipLinkProps) {
  return <div id={id} class="focus-scroll-target" />;
}
