const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const formatDate = (iso?: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** Colour is optional and only for these three outcomes. Everything else is ink. */
export const stateTone = (s: string) =>
  s === "Verified" ? "ok" : s === "Unsafe" ? "bad" : s === "Limitation" ? "warn" : "ink";
