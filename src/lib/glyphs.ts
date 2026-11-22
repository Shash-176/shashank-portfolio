// The twelve evidence-state glyphs from the design freeze (§8). Shape carries meaning; colour is optional.
export const GLYPHS: Record<string, { viewBox: string; attrs: string; body: string }> = {
  Reproduced: {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<path d="M13 8a5 5 0 1 1-1.5-3.6"></path><path d="M11.8 1.6v3h-3"></path>',
  },
  Tested: {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<path d="M1.5 4l1.6 1.6L5.8 2.8M8 4.2h6.5M1.5 11l1.6 1.6 2.7-2.8M8 11.2h6.5"></path>',
  },
  Live: {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<circle cx="8" cy="8" r="6"></circle><circle cx="8" cy="8" r="2.6" fill="currentColor" stroke="none"></circle>',
  },
  Stated: {
    viewBox: "0 0 16 16",
    attrs: 'fill="currentColor"',
    body: '<path d="M2 12V8a4 4 0 0 1 4-4v2a2 2 0 0 0-2 2h2v4zM9 12V8a4 4 0 0 1 4-4v2a2 2 0 0 0-2 2h2v4z"></path>',
  },
  Verified: {
    viewBox: "0 0 14 14",
    attrs: "",
    body: '<rect x="0.5" y="0.5" width="13" height="13" fill="currentColor"></rect><path d="M3.4 7.3l2.4 2.4 4.8-5.2" fill="none" style="stroke: var(--bg)" stroke-width="1.8"></path>',
  },
  Unsafe: {
    viewBox: "0 0 14 14",
    attrs: "",
    body: '<polygon points="4.2,0.5 9.8,0.5 13.5,4.2 13.5,9.8 9.8,13.5 4.2,13.5 0.5,9.8 0.5,4.2" fill="currentColor"></polygon><path d="M4.4 4.4l5.2 5.2M9.6 4.4l-5.2 5.2" style="stroke: var(--bg)" stroke-width="1.7"></path>',
  },
  Invalid: {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<rect x="1.8" y="1.8" width="12.4" height="12.4"></rect><path d="M2 14L14 2"></path>',
  },
  Unknown: {
    viewBox: "0 0 18 18",
    attrs: 'fill="none" stroke="currentColor"',
    body: '<circle cx="9" cy="9" r="7.5" stroke-width="1.6"></circle><path d="M4 14L14 4M2.6 10.6L10.6 2.6M7.4 15.4L15.4 7.4" stroke-width="1.2"></path>',
  },
  "Not comparable": {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<path d="M3 6h10M3 10h10M10.5 2.5l-5 11"></path>',
  },
  Limitation: {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<path d="M8 2l6.5 11.5h-13z"></path><path d="M8 6.5v3.2"></path><circle cx="8" cy="11.7" r="0.6" fill="currentColor"></circle>',
  },
  Private: {
    viewBox: "0 0 16 16",
    attrs: "",
    body: '<rect x="2" y="2" width="12" height="12" fill="currentColor"></rect><circle cx="8" cy="7" r="1.7" style="fill: var(--bg)"></circle><path d="M8 8v3.2" style="stroke: var(--bg)" stroke-width="1.6"></path>',
  },
  "Research in progress": {
    viewBox: "0 0 16 16",
    attrs: 'fill="none" stroke="currentColor" stroke-width="1.6"',
    body: '<circle cx="8" cy="8" r="6.2"></circle><path d="M8 8V1.8A6.2 6.2 0 0 1 14.2 8z" fill="currentColor" stroke="none"></path>',
  },
};
