import type { ComponentProps } from "@solidjs/web";
import {
  Link,
  type AnyRouter,
  useLocation,
  useNavigate as useTanStackNavigate,
  useSearch
} from "@tanstack/solid-router";
import { omit } from "solid-js";

export { useLocation };

// Keep ordinary href links usable for external URLs, hashes and article paths.
export function A(
  props: Pick<
    ComponentProps<"a">,
    "href" | "class" | "children" | "rel" | "target" | "onClick" | "aria-label" | "title"
  > & { activeClass?: string; inactiveClass?: string; end?: boolean }
) {
  const rest = omit(props, "href", "activeClass", "inactiveClass", "end", "target");
  return (
    <Link<AnyRouter>
      {...rest}
      to={typeof props.href === "string" ? props.href : "."}
      target={typeof props.target === "string" ? props.target : undefined}
      activeOptions={{ exact: props.end }}
      activeProps={{ class: props.activeClass }}
      inactiveProps={{ class: props.inactiveClass }}
    />
  );
}

export function useSearchParams() {
  return [useSearch({ strict: false })] as const;
}

export function useNavigate() {
  const navigate = useTanStackNavigate();
  return (href: string, options?: { replace?: boolean }) => navigate({ href, ...options });
}
