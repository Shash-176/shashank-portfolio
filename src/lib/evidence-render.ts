/**
 * Deterministic evidence numbering. Components emit evidence ids; after the page body is rendered,
 * this numbers them in document order (first use), fills each section's margin with the notes first
 * used there, and builds the permanent list. One record drives every appearance.
 */
import { GLYPHS } from "./glyphs";
import { PLACEHOLDER } from "./rules";
import type { Evidence } from "./evidence";
import { formatDate } from "./format";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const text = (s: string) =>
  esc(s).replace(
    new RegExp(PLACEHOLDER.source, "g"),
    (_m, label: string) => `<span class="placeholder" data-placeholder="${label.trim()}">[${label.trim()}]</span>`,
  );
const glyph = (state: string, size: number) => {
  const g = GLYPHS[state];
  return `<svg class="glyph" aria-hidden="true" focusable="false" width="${size}" height="${size}" viewBox="${g.viewBox}" ${g.attrs}>${g.body}</svg>`;
};

export const NUM = (id: string) => `§EV:${id}§`;

export function noteHtml(e: Evidence & { id: string }, n: number, variant: "margin" | "list", always = false) {
  const domId = variant === "list" ? `ev-${n}` : `note-${n}`;
  const attrs = variant === "margin" ? ` role="note" aria-label="Evidence note ${n}" tabindex="-1"` : "";
  const cls = ["note", variant, always ? "always" : ""].filter(Boolean).join(" ");
  const parts = [
    `<p class="note-head"><strong>[${n}]</strong> ${glyph(e.state, 13)} ${esc(e.state)}${e.date ? ` · ${formatDate(e.date)}` : ""}</p>`,
    variant === "list" ? `<p class="claim-text">${text(e.claim)}.</p>` : "",
    `<p>${text(e.body)}</p>`,
    e.method ? `<p class="method"><span class="sr-only">Method: </span>${text(e.method)}</p>` : "",
    e.limitation ? `<p class="limit">${glyph("Limitation", 12)} <span>${text(e.limitation)}</span></p>` : "",
    e.source
      ? `<p class="src">${e.source.url ? `<a href="${esc(e.source.url)}" class="link" rel="noopener noreferrer" target="_blank">${esc(e.source.label)} ↗<span class="sr-only"> (opens in a new tab)</span></a>` : esc(e.source.label)}</p>`
      : "",
    variant === "margin"
      ? `<button type="button" class="close no-print" data-close-note hidden>Close <kbd>Esc</kbd></button>`
      : "",
  ];
  return `<div class="${cls}" id="${domId}" data-note-for="${n}"${attrs}>${parts.join("")}</div>`;
}

export function processEvidence(html: string, all: Map<string, Evidence>) {
  const order: string[] = [];
  for (const m of html.matchAll(/§EV:([\w-]+)§/g)) if (!order.includes(m[1])) order.push(m[1]);
  for (const id of order) if (!all.has(id)) throw new Error(`Unknown evidence id "${id}"`);
  const num = (id: string) => order.indexOf(id) + 1;

  // Notes go in the margin of the section where the evidence is first used.
  const placed = new Set<string>();
  html = html.replace(
    /<template data-ev-scope="(\d+)"[^>]*><\/template>([\s\S]*?)<template data-ev-notes="\1" data-always="(0|1)"[^>]*><\/template>/g,
    (_m, _k, body: string, always: string) => {
      const ids: string[] = [];
      for (const m of body.matchAll(/§EV:([\w-]+)§/g)) if (!placed.has(m[1]) && !ids.includes(m[1])) ids.push(m[1]);
      ids.forEach((id) => placed.add(id));
      const notes = ids.map((id) => noteHtml({ ...all.get(id)!, id }, num(id), "margin", always === "1")).join("");
      return body + notes;
    },
  );
  html = html.replace(/§EV:([\w-]+)§/g, (_m, id: string) => String(num(id)));
  return { html, order };
}

export function listHtml(order: string[], all: Map<string, Evidence>) {
  return order.map((id, i) => `<li>${noteHtml({ ...all.get(id)!, id }, i + 1, "list")}</li>`).join("");
}
