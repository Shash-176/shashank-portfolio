// Mobile menu: a native modal dialog (focus is contained, Esc closes, focus returns to the button).
const btn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const dlg = document.getElementById("site-menu") as HTMLDialogElement | null;
if (btn && dlg) {
  btn.addEventListener("click", () => {
    dlg.showModal();
    btn.setAttribute("aria-expanded", "true");
    dlg.querySelector<HTMLElement>("a")?.focus();
  });
  dlg.addEventListener("close", () => {
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  });
  dlg.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t === dlg || t.closest("[data-menu-close]") || t.closest("[data-lens-toggle]")) dlg.close();
  });
}
document.querySelectorAll<HTMLDialogElement>("dialog[data-sheet]").forEach((d) =>
  d.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t === d || t.closest("[data-sheet-close]")) d.close();
  }),
);
