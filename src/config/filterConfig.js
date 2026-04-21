// src/pages/filter/filterConfig.js

export const DEFAULT_COLORS = ["black", "yellow", "lavender", "camel", "cream white", "melange grey"];
export const DEFAULT_SIZES  = ["XS", "S", "M", "L", "XL", "XXL"];
export const DEFAULT_GENRES = ["Bangla O Bangali", "Music & Band", "Anime", "Sports", "Movies & Series", "Superhero", "Abstract", "Drip & Doodle"];
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
  sizes:  ["xs","s","m","l"],      
  genres: [],
  sortOptions: SORT_OPTIONS,
  showGenre: false,                 
};