type LinkProps = {
  href: string;
  children: string;
};

export function Link(props: LinkProps) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      class="underline font-bold hover:decoration-4"
    >
      {props.children}
    </a>
  );
}
