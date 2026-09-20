"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineSquares2X2,
  HiOutlineXMark,
} from "react-icons/hi2";
import { AllCommands, CommandGroups } from "../constants/commands";
import { CAL_BOOKING } from "../constants/links";
import { ICommand } from "../interfaces/components";
import { openBooking } from "../lib/cal";
import { COMMAND_MENU_EVENT } from "../lib/command-menu";

const matches = (command: ICommand, query: string) =>
  `${command.label} ${command.keywords ?? ""}`.toLowerCase().includes(query);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/50">
    {children}
  </span>
);

const CommandMenu = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const copiedTimer = useRef(0);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CommandGroups;
    return CommandGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => matches(item, q)),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const order = useMemo(
    () => new Map(flat.map((item, index) => [item.id, index])),
    [flat],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be refused; the menu just stays as it was.
    }
  }, []);

  const run = useCallback(
    (command: ICommand) => {
      // Copying keeps the menu open so the "Copied" confirmation is visible.
      if (command.id === "copy-link") {
        void copyLink();
        return;
      }

      close();

      if (command.id === "book") {
        if (!openBooking(CAL_BOOKING)) {
          window.open(`https://cal.com/${CAL_BOOKING}`, "_blank", "noreferrer");
        }
        return;
      }

      const href = command.href;
      if (!href) return;
      if (href.startsWith("mailto:")) {
        window.location.href = href;
        return;
      }
      if (command.external) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      // offsetParent is null while a section is hidden, which is how phones get
      // Experience and Skills as their own routes instead of home page blocks.
      const target = command.anchor
        ? document.getElementById(command.anchor)
        : null;
      if (target && target.offsetParent !== null) {
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      router.push(href);
    },
    [close, copyLink, reduceMotion, router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(COMMAND_MENU_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(COMMAND_MENU_EVENT, onOpen);
      window.clearTimeout(copiedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const restoreTo = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setActive(0);
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      restoreTo?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!flat.length) return;
        const step = event.key === "ArrowDown" ? 1 : flat.length - 1;
        setActive((index) => (index + step) % flat.length);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const command = flat[active];
        if (command) run(command);
        return;
      }
      // Shortcuts stay bound to every command, not just the filtered ones.
      if (
        event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        event.key.length === 1
      ) {
        const letter = event.key.toUpperCase();
        const command = AllCommands.find((item) => item.shortcut === letter);
        if (command) {
          event.preventDefault();
          run(command);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, flat, active, run, close]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    itemRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active, groups]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pb-4 pt-[10vh]">
          <motion.div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-menu-title"
            className="relative flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }
            }
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-3.5 border-b border-white/10 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
                <HiOutlineSquares2X2 size={19} />
              </span>
              <div className="flex min-w-0 flex-col pt-0.5">
                <p
                  id="command-menu-title"
                  className="font-serif text-base tracking-tight text-white"
                >
                  Navigation Menu
                </p>
                <p className="text-xs font-light text-white/45">
                  Quickly jump to sections or actions
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="ml-auto shrink-0 rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <HiOutlineXMark size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
              <HiOutlineMagnifyingGlass
                size={17}
                className="shrink-0 text-white/40"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for actions..."
                aria-label="Search for actions"
                role="combobox"
                aria-expanded
                aria-controls="command-menu-list"
                aria-activedescendant={
                  flat[active] ? `command-${flat[active].id}` : undefined
                }
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent text-sm font-light text-white outline-none placeholder:text-white/35"
              />
            </div>

            <div
              id="command-menu-list"
              role="listbox"
              aria-label="Actions"
              className="max-h-[min(19rem,44vh)] flex-1 overflow-y-auto overscroll-contain py-1.5"
            >
              {flat.length === 0 && (
                <p className="px-5 py-8 text-center text-sm font-light text-white/40">
                  No actions found.
                </p>
              )}
              {groups.map((group) => (
                <div key={group.heading} className="px-2 pb-0.5">
                  <p className="px-3 py-1.5 text-xs font-light tracking-wide text-white/35">
                    {group.heading}
                  </p>
                  {group.items.map((item) => {
                    const index = order.get(item.id) ?? 0;
                    const isActive = index === active;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        id={`command-${item.id}`}
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => run(item)}
                        onMouseMove={() => setActive(index)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          isActive ? "bg-white/10 text-white" : "text-white/70"
                        }`}
                      >
                        <Icon size={17} className="shrink-0 text-white/55" />
                        <span className="flex-1 truncate text-sm font-light">
                          {item.label}
                        </span>
                        {copied && item.id === "copy-link" ? (
                          <span className="text-xs font-light text-white/50">
                            Copied
                          </span>
                        ) : (
                          item.shortcut && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-light text-white/50">
                              shift + {item.shortcut}
                            </span>
                          )
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-2.5 text-[11px] font-light text-white/35">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Hint>↑</Hint>
                  <Hint>↓</Hint>
                  to navigate
                </span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <Hint>↵</Hint>
                  to select
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <Hint>esc</Hint>
                to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CommandMenu;
