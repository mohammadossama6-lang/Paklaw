"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SearchOption = {
  value: string;
  /** What the field shows once chosen, e.g. "Pakistan" or "+92". */
  label: string;
  /**
   * What the dropdown list shows, when it should differ from `label` — the
   * phone picker names the country in full here while the closed field, which
   * sits in a narrow column beside the number, shows only the dial code.
   */
  optionLabel?: string;
  /** Optional leading glyph — a flag, for instance. */
  prefix?: string;
  /** Extra text matched by the search box but not shown in the closed field. */
  keywords?: string;
};

type Props = {
  id: string;
  options: SearchOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  /** Rendered results are capped for performance; search narrows past it. */
  maxRendered?: number;
  className?: string;
};

const normalize = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/**
 * A searchable single-select. Native <select> can't be filtered, which is
 * unusable for 250 countries or several thousand cities, so this pairs a
 * listbox with a search field.
 *
 * Only the visible slice is rendered — matching thousands of options is cheap,
 * but mounting thousands of DOM nodes is not.
 */
export default function SearchableSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Type to search…",
  disabled,
  invalid,
  maxRendered = 80,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selected = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return options.slice(0, maxRendered);

    const scored: { opt: SearchOption; rank: number }[] = [];
    for (const opt of options) {
      // Rank on what the list actually shows, so typing "pak" promotes
      // Pakistan even when the closed field only carries its dial code.
      const shown = normalize(opt.optionLabel ?? opt.label);
      const hay = `${shown} ${normalize(opt.label)} ${normalize(opt.keywords ?? "")} ${normalize(opt.value)}`;
      const at = hay.indexOf(q);
      if (at === -1) continue;
      // Prefer names that start with the query ("Pak" -> Pakistan before Iraq).
      scored.push({ opt, rank: shown.startsWith(q) ? 0 : at });
      if (scored.length > 600) break;
    }
    scored.sort((a, b) => a.rank - b.rank);
    return scored.slice(0, maxRendered).map((s) => s.opt);
  }, [options, query, maxRendered]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus the search box when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function choose(option: SearchOption) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = matches[activeIndex];
      if (option) choose(option);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setQuery("");
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  const fieldTone = invalid
    ? "border-red-300 bg-red-50/40 hover:border-red-400"
    : "border-slate-200 bg-white hover:border-brand-300";

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setActiveIndex(0);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-[15px] shadow-sm transition-all
          focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10
          disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:shadow-none
          ${fieldTone}`}
      >
        <span className={`flex min-w-0 items-center gap-2 ${selected ? "text-ink" : "text-slate-400"}`}>
          {selected?.prefix && <span aria-hidden>{selected.prefix}</span>}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          aria-hidden
          className={`size-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* min-w lets a narrow trigger (the phone country code) still open a
          panel wide enough to search in; it grows rightward from left-0. */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 min-w-[15rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3">
            <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-autocomplete="list"
              aria-controls={listboxId}
              className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-slate-400"
            />
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {matches.length === 0 && (
              <li className="px-3.5 py-3 text-sm text-muted">No matches found.</li>
            )}

            {matches.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                    className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors
                      ${index === activeIndex ? "bg-brand-50 text-ink" : "text-slate-600"}`}
                  >
                    {option.prefix && <span aria-hidden>{option.prefix}</span>}
                    <span className="min-w-0 flex-1 truncate">
                      {option.optionLabel ?? option.label}
                    </span>
                    {isSelected && <Check aria-hidden className="size-4 shrink-0 text-brand-600" />}
                  </button>
                </li>
              );
            })}

            {matches.length >= maxRendered && (
              <li className="border-t border-slate-100 px-3.5 py-2 text-xs text-slate-400">
                Showing the first {maxRendered} — keep typing to narrow it down.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
