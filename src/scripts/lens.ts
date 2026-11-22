// The Evidence Lens: the site's signature interaction (design freeze §7).
import { setAvatarState } from "./avatar";

const root = document.documentElement;
const live = document.getElementById("lens-status");
const isOn = () => root.dataset.lens === "on";
let pinned: { note: HTMLElement; from: HTMLElement } | null = null;

function counts() {
  const notes = document.querySelectorAll(".evidence-list li");
  const stated = [...notes].filter((li) => li.querySelector(".head")?.textContent?.includes("Stated")).length;
  return { total: notes.length, sourced: notes.length - stated, stated };
}

function setLens(on: boolean, announce = true) {
  if (on) root.dataset.lens = "on";
  else delete root.dataset.lens;
  try {
    sessionStorage.setItem("lens", on ? "on" : "off");
  } catch {
    /* lasts for this page only */
  }
  document.querySelectorAll<HTMLButtonElement>("[data-lens-toggle]").forEach((b) => {
    b.setAttribute("aria-pressed", String(on));
    const s = b.querySelector("[data-lens-state]");
    if (s) s.textContent = on ? "on" : "off";
  });
  const { total, sourced, stated } = counts();
  document
    .querySelectorAll("[data-lens-count]")
    .forEach((el) => (el.textContent = `${total} claims · ${sourced} with a source · ${stated} stated`));
  if (announce && live)
    live.textContent = on ? `Evidence on. ${total} claims on this page, ${sourced} with a source.` : "Evidence off.";
  if (!on) unpin(false);
}

function unpin(returnFocus = true) {
  if (!pinned) return;
  pinned.note.removeAttribute("data-pinned");
  pinned.note.querySelector<HTMLElement>("[data-close-note]")?.setAttribute("hidden", "");
  if (returnFocus) pinned.from.focus();
  pinned = null;
}

function pin(n: string, from: HTMLElement) {
  const note = document.getElementById(`note-${n}`);
  if (!note) return false;
  unpin(false);
  note.setAttribute("data-pinned", "");
  note.querySelector<HTMLElement>("[data-close-note]")?.removeAttribute("hidden");
  pinned = { note, from };
  note.focus({ preventScroll: true });
  note.scrollIntoView({
    block: "nearest",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
  return true;
}

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  if (t.closest("[data-lens-toggle]")) return setLens(!isOn());
  if (t.closest("[data-close-note]")) return unpin();
  const num = t.closest<HTMLAnchorElement>("a[data-note]");
  if (num && pin(num.dataset.note!, num)) e.preventDefault();
  if (t.closest("[data-all-notes]")) openSheet();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && pinned) {
    e.preventDefault();
    unpin();
    return;
  }
  if (e.key !== "e" && e.key !== "E") return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const el = document.activeElement as HTMLElement | null;
  if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
  if (document.querySelector("dialog[open]")) return;
  e.preventDefault();
  setLens(!isOn());
});

// Hover previews a note (pointer devices only). Pinning needs a click or Enter.
if (matchMedia("(hover: hover)").matches) {
  document.addEventListener("pointerover", (e) => {
    const num = (e.target as HTMLElement).closest<HTMLElement>("a[data-note]");
    if (!num || isOn()) return;
    document.getElementById(`note-${num.dataset.note}`)?.setAttribute("data-preview", "");
  });
  document.addEventListener("pointerout", (e) => {
    const num = (e.target as HTMLElement).closest<HTMLElement>("a[data-note]");
    if (num) document.getElementById(`note-${num.dataset.note}`)?.removeAttribute("data-preview");
  });
}

// The hero avatar looks at the claim being inspected.
const hero = document.querySelector("[data-hero-claims]");
if (hero) {
  const look = (on: boolean) => setAvatarState(on ? "inspecting" : "neutral");
  hero.addEventListener("focusin", () => look(true));
  hero.addEventListener("focusout", () => look(false));
  hero.addEventListener("pointerenter", () => look(true));
  hero.addEventListener("pointerleave", () => look(false));
}

// "All notes" bottom sheet on phones: a copy of the page's permanent list, without duplicate ids.
function openSheet() {
  const dlg = document.getElementById("notes-sheet") as HTMLDialogElement | null;
  const list = document.querySelector(".evidence-list ol");
  const slot = dlg?.querySelector("[data-sheet-body]");
  if (!dlg || !list || !slot) return;
  const copy = list.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  slot.replaceChildren(copy);
  dlg.showModal();
}

setLens(isOn(), false);
