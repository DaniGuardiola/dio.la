/// <reference types="vite/client" />
declare module "*.mdx" {
  import type { Component } from "solid-js";
  const Content: Component;
  export default Content;
}
