// src/pages/filter/filterConfig.js

export const DEFAULT_COLORS = ["black","yellow","lavender","camel","cream white","grey"];
export const DEFAULT_SIZES  = ["xs","s","m","l","xl","xxl"];
export const DEFAULT_GENRES = ["music & band","anime","sports","movies & series","super hero","abstract","drip & doodle"];
export const SORT_OPTIONS   = [
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

// Women might not have genre, Kids might have different sizes, etc.
export const MEN_FILTER_CONFIG = {
  colors: DEFAULT_COLORS,
  sizes:  DEFAULT_SIZES,
  genres: DEFAULT_GENRES,
  sortOptions: SORT_OPTIONS,
  showGenre: true,
};

export const WOMEN_FILTER_CONFIG = {
  colors: DEFAULT_COLORS,
  sizes:  DEFAULT_SIZES,
  genres: DEFAULT_GENRES,
  sortOptions: SORT_OPTIONS,
  showGenre: true,
};

export const KIDS_FILTER_CONFIG = {
  colors: DEFAULT_COLORS,
  sizes:  ["xs","s","m","l"],        // kids has fewer sizes
  genres: [],
  sortOptions: SORT_OPTIONS,
  showGenre: false,                  // hide genre for kids
};