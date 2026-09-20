export type Theme = "dark" | "light";

export const THEME_KEY = "theme";

/** Dark is the site's own look, so it is what a first visit gets. */
export const DEFAULT_THEME: Theme = "dark";

export const THEME_COLOR: Record<Theme, string> = {
  dark: "#000000",
  light: "#ffffff",
};

/**
 * Runs before first paint, inlined in the document head, so a returning
 * visitor never sees the default theme flash before their own. It is kept in
 * one string because the layout has to hand it to the browser as raw text.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(t!=="light"&&t!=="dark")t=${JSON.stringify(
  DEFAULT_THEME,
)};var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="light"?"#ffffff":"#000000";}catch(e){}})();`;

/** Reads the theme the boot script already put on the document. */
export const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
};

export const storeTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode can refuse storage; the choice then lasts this visit only.
  }
};
