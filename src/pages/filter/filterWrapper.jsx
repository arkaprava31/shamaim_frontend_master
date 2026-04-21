import React, { useState } from "react";
import { FiX, FiFilter, FiChevronDown, FiSliders } from "react-icons/fi";
import { Drawer } from "@material-tailwind/react";

const COLORS = ["black", "yellow", "lavender", "camel", "cream white", "melange grey"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENRE = ["Bangla O Bangali", "Music & Band", "Anime", "Sports", "Movies & Series", "Superhero", "Abstract", "Drip & Doodle"];
const SORT_OPTIONS = [
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

// ─── Accordion Section ────────────────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-xs font-bold tracking-[0.15em] uppercase text-gray-800 group-hover:text-black transition-colors">
          {title}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────
const COLOR_MAP = {
  black: "#1a1a1a",
  yellow: "#F5C518",
  lavender: "#B57BDF",
  camel: "#C19A6B",
  "cream white": "#FFF8F0",
  "melange grey": "#9E9E9E",
};

function ColorSwatch({ color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      title={color}
      className={`relative w-8 h-8 rounded-full transition-all duration-200 ${selected ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"
        }`}
      style={{
        backgroundColor: COLOR_MAP[color] || "#ccc",
        border: color === "cream white" ? "1px solid #e5e7eb" : "none",
      }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke={color === "yellow" || color === "cream white" ? "#333" : "#fff"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Active Filter Pill ───────────────────────────────────────────────────────
function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-medium rounded-full tracking-wide">
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity mt-px">
        <FiX className="w-3 h-3" />
      </button>
    </span>
  );
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────
function SidebarContent({ filters, onFilterChange, onClearFilters, onClose, disableGenre }) {
  const hasActiveFilters =
    filters.color?.length || filters.size?.length || filters.genre?.length || filters.sort;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FiSliders className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-bold tracking-[0.12em] uppercase text-gray-900">
            SHAMAIM
          </span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {[filters.color?.length > 0, filters.size?.length > 0, filters.genre?.length > 0, !!filters.sort].filter(Boolean).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-gray-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0 pr-1 -mr-1">

        {/* Sort */}
        <FilterSection title="Sort By">
          <div className="space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${filters.sort === opt.value ? "border-black bg-black" : "border-gray-300"
                  }`}>
                  {filters.sort === opt.value && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                <input
                  type="radio"
                  className="sr-only"
                  checked={filters.sort === opt.value}
                  onChange={() => onFilterChange("sort", opt.value)}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Color */}
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-4 mx-2 my-4">
            {COLORS.map((c) => (
              <ColorSwatch
                key={c}
                color={c}
                selected={filters.color?.includes(c)}
                onClick={() => {
                  const updated = filters.color?.includes(c)
                    ? filters.color.filter((x) => x !== c)
                    : [...(filters.color || []), c];
                  onFilterChange("color", updated);
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Size */}
        <FilterSection title="Size">
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => {
              const selected = filters.size?.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => {
                    const updated = selected
                      ? filters.size.filter((x) => x !== s)
                      : [...(filters.size || []), s];
                    onFilterChange("size", updated);
                  }}
                  className={`w-12 h-10 text-xs border ${selected ? "bg-black text-white" : "bg-white text-gray-500"
                    }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Genre */}
        {!disableGenre && (
          <FilterSection title="Genre">
            <div className="space-y-1">
              {GENRE.map((g) => {
                const selected = filters.genre?.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => {
                      const updated = selected
                        ? filters.genre.filter((x) => x !== g)
                        : [...(filters.genre || []), g];
                      onFilterChange("genre", updated);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm ${selected ? "bg-black text-white" : "text-gray-600"
                      }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  );
}

// ─── Main Wrapper ─────────────────────────────────────────────────────────────
export default function FilterWrapper({
  filters = {},
  onFilterChange,
  onClearFilters,
  children,
  disableGenre = false,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCount = [
    ...(filters.color || []),
    ...(filters.size || []),
    ...(filters.genre || []),
    ...(filters.sort ? [filters.sort] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-5">
        <div className="flex items-center justify-between py-3 border-y border-gray-100">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-700"
          >
            <FiFilter className="w-4 h-4" />
            Filter & Sort
            {activeCount.length > 0 && (
              <span className="ml-1 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center">
                {activeCount.length}
              </span>
            )}
          </button>

          {activeCount.length > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-gray-400 hover:text-black underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64">
          <SidebarContent
            filters={filters}
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
            disableGenre={disableGenre}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left" size={300} className="p-5" overlay
      >
        <SidebarContent
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          disableGenre={disableGenre}
          onClose={() => setDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
} 