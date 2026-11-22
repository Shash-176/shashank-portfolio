// Theme: system → light → dark. The choice is remembered; system follows the OS.
type Mode = "system" | "light" | "dark";
const root = document.documentElement;
const read = (): Mode => {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
};
function apply(mode: Mode) {
  root.classList.add("theme-fade");
  if (mode === "system") delete root.dataset.theme;
  else root.dataset.theme = mode;
  try {
    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
  } catch {
    /* storage unavailable: the choice lasts for this page */
  }
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute("content", dark ? "#0E0F12" : "#F6F6F3"));
  sync(mode);
  setTimeout(() => root.classList.remove("theme-fade"), 220);
}
function sync(mode: Mode) {
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((b) => {
    b.setAttribute("aria-label", `Theme: ${mode}. Change theme`);
    b.dataset.mode = mode;
  });
  document
    .querySelectorAll<HTMLButtonElement>("[data-theme-set]")
    .forEach((b) => b.setAttribute("aria-checked", String(b.dataset.themeSet === mode)));
}
const next: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };
sync(read());
document.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>("[data-theme-toggle], [data-theme-set]");
  if (!t) return;
  apply(t.dataset.themeSet ? (t.dataset.themeSet as Mode) : next[read()]);
});
