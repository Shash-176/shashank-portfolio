/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    /** The project whose case study is rendering, for MDX helper components. */
    project?: import("astro:content").CollectionEntry<"projects">;
  }
}
