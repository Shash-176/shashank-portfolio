// Swaps the avatar still to a state. Instant; with reduced motion the avatar stays neutral.
export type AvatarState = "neutral" | "inspecting" | "verified" | "unknown" | "unsafe";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function setAvatarState(state: AvatarState) {
  if (reduced()) state = "neutral";
  document.querySelectorAll<HTMLElement>("[data-avatar]").forEach((fig) => {
    if (fig.dataset.state === state) return;
    fig.dataset.state = state;
    fig.querySelectorAll("img").forEach((img) => {
      img.src = img.src.replace(/-(neutral|inspecting|verified|unknown|unsafe)\.svg$/, `-${state}.svg`);
    });
  });
}
