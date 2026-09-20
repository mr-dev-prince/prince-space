export const COMMAND_MENU_EVENT = "command-menu:open";

/**
 * Opens the ⌘K menu from anywhere. The menu itself is mounted once in the root
 * layout, so triggers only have to announce themselves rather than hold state.
 */
export const openCommandMenu = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COMMAND_MENU_EVENT));
};
