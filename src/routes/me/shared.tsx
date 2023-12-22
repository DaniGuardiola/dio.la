import clsx from "clsx";

type LinkProps = {
  href: string;
  children: string;
  subtle?: boolean;
};

export function Link(props: LinkProps) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      class={clsx(
        props.subtle
          ? "hover:underline text-subtle-invert"
          : "font-bold underline hover:decoration-4"
      )}
    >
      {props.children}
    </a>
  );
}
