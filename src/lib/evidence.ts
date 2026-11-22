import { getCollection, type CollectionEntry } from "astro:content";

export type Evidence = CollectionEntry<"evidence">["data"];

let cache: Map<string, Evidence> | undefined;
export async function evidenceById(): Promise<Map<string, Evidence>> {
  cache ??= new Map((await getCollection("evidence")).map((e) => [e.id, e.data]));
  return cache;
}
export async function getEvidence(id: string): Promise<Evidence> {
  const e = (await evidenceById()).get(id);
  if (!e) throw new Error(`Unknown evidence id "${id}"`);
  return e;
}

export { formatDate, stateTone } from "./format";
