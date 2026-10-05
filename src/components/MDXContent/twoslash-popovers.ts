// Native popovers render in the top layer, outside the scrolling code block's
// clipping context. Floating UI handles placement, viewport bounds and scrolling.
// https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
// https://floating-ui.com/docs/autoupdate
export function setupTwoslashPopovers(root: HTMLElement) {
  // Server HTML uses CSS hover/focus. Only opt into JS-controlled visibility
  // when this browser supports the top-layer enhancement.
  if (typeof HTMLElement.prototype.showPopover !== "function") return () => {};
  const popovers = root.querySelectorAll<HTMLElement>(
    ".twoslash-hover > .twoslash-popup-container"
  );
  for (const element of popovers) element.setAttribute("popover", "manual");
  let active: HTMLElement | undefined;
  let popup: HTMLElement | undefined;
  let cleanupPosition: (() => void) | undefined;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let generation = 0;

  function close() {
    generation++;
    clearTimeout(closeTimer);
    cleanupPosition?.();
    cleanupPosition = undefined;
    if (popup?.matches(":popover-open")) popup.hidePopover();
    active?.removeAttribute("aria-describedby");
    active = undefined;
    popup = undefined;
  }

  async function open(token: HTMLElement) {
    clearTimeout(closeTimer);
    if (token === active) return;
    close();
    const next = token.querySelector<HTMLElement>(":scope > [popover]");
    if (!next || typeof next.showPopover !== "function") return;
    active = token;
    popup = next;
    const request = generation;
    const { autoUpdate, computePosition, offset, flip, shift, hide } =
      await import("@floating-ui/dom");
    if (disposed || generation !== request) return;
    next.style.visibility = "hidden";
    next.id ||= crypto.randomUUID();
    token.setAttribute("aria-describedby", next.id);
    next.showPopover();
    cleanupPosition = autoUpdate(token, next, () => {
      void computePosition(token, next, {
        strategy: "fixed",
        placement: "bottom-start",
        middleware: [
          offset(6),
          flip({ padding: 12 }),
          shift({ padding: 12, crossAxis: true }),
          hide()
        ]
      }).then(({ x, y, middlewareData }) => {
        if (generation !== request || disposed) return;
        Object.assign(next.style, {
          left: `${x}px`,
          top: `${y}px`,
          visibility: middlewareData.hide?.referenceHidden ? "hidden" : "visible"
        });
      });
    });
  }

  function enter(event: Event) {
    if (!(event.target instanceof Element)) return;
    const token = event.target.closest<HTMLElement>(".twoslash-hover");
    if (token && root.contains(token)) void open(token);
  }

  function leave(event: MouseEvent | FocusEvent) {
    if (!active) return;
    if (event.relatedTarget instanceof Node && active.contains(event.relatedTarget)) return;
    // Allow the pointer to cross the small gap into the popup to read/select docs.
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 120);
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === "Escape") close();
  }

  function outside(event: PointerEvent) {
    if (active && event.target instanceof Node && !active.contains(event.target)) close();
  }

  document.addEventListener("pointerdown", outside);
  document.addEventListener("keydown", keydown);
  root.addEventListener("pointerover", enter);
  root.addEventListener("pointerout", leave);
  root.addEventListener("focusin", enter);
  root.addEventListener("focusout", leave);
  return () => {
    disposed = true;
    close();
    document.removeEventListener("pointerdown", outside);
    document.removeEventListener("keydown", keydown);
    root.removeEventListener("pointerover", enter);
    root.removeEventListener("pointerout", leave);
    root.removeEventListener("focusin", enter);
    root.removeEventListener("focusout", leave);
    for (const element of popovers) {
      element.removeAttribute("popover");
      element.style.removeProperty("left");
      element.style.removeProperty("top");
      element.style.removeProperty("visibility");
    }
  };
}
