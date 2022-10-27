import clsx from "clsx";
import { For, Portal } from "solid-js/web";

export function SkipLinkArea() {
  return <div id="skip-link-area" />;
}

type SkipLinkData = {
  label: string;
  id: string;
};

type SkipLinksProps = {
  links: SkipLinkData[];
};

export function SkipLinks({ links }: SkipLinksProps) {
  const skipLinkArea = document.getElementById("skip-link-area");
  if (!skipLinkArea) throw new Error("The element for skip links wasn't found");
  return (
    <Portal mount={skipLinkArea}>
      <For each={links}>
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
  );
}

type SkipLinkProps = {
  id: string;
};

export function SkipLink({ id }: SkipLinkProps) {
  return <div id={id} class="focus-scroll-target" />;
}
