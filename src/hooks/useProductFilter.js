import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

// ─── client-side filter helpers ───────────────────────────────────────────────

const normalizeGenre = (str = "") =>
  str.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "").trim();

const GENRE_MAP = {
  "music & band":   "musicband",
  "movies & series":"moviesseries",
  "super hero":     "superhero",
  "drip & doodle":  "dripdoodle",
};

function applyClientFilters(docs, filters) {
  let out = [...docs];

  // Color
  if (filters.color.length > 0) {
    out = out.filter((p) => {
      const pColors = p.colors?.length > 0 ? p.colors : [p.color];
      return filters.color.some((c) =>
        pColors.some((pc) => String(pc).toLowerCase() === c.toLowerCase())
      );
    });
  }

  // Size
  if (filters.size.length > 0) {
    out = out.filter((p) => {
      let pSizes = p.sizes?.length > 0 ? p.sizes : p.size;
      if (!Array.isArray(pSizes)) pSizes = [pSizes];
      const normalized = pSizes.filter(Boolean).map((s) => s.toString().trim().toLowerCase());
      return filters.size.some((s) => normalized.includes(s.toLowerCase()));
    });
  }

  // Genre
  if (filters.genre.length > 0) {
    out = out.filter((p) =>
      filters.genre.some(
        (g) => normalizeGenre(p.category) === normalizeGenre(GENRE_MAP[g] || g)
      )
    );
  }

  // Price range
  if (filters.priceRange) {
    const pr = filters.priceRange.trim();
    if (pr.startsWith("<")) {
      const max = parseFloat(pr.slice(1));
      if (!isNaN(max)) out = out.filter((p) => Number(p.price) < max);
    } else if (pr.includes("-")) {
      const [minS, maxS] = pr.split("-").map((s) => s.trim());
      const [min, max] = [parseFloat(minS), parseFloat(maxS)];
      if (!isNaN(min) && !isNaN(max))
        out = out.filter((p) => Number(p.price) >= min && Number(p.price) <= max);
    }
  }

  // Sort
  if (filters.sort === "price-asc")  out.sort((a, b) => Number(a.price) - Number(b.price));
  if (filters.sort === "price-desc") out.sort((a, b) => Number(b.price) - Number(a.price));

  return out;
}

// ─── hook ─────────────────────────────────────────────────────────────────────
// fetchProductFunction — Redux thunk action creator to call
// extraParams          — any additional params the thunk needs beyond { page }
//                        e.g. { subcategories: "Classic Fit", gender: "Male" }

export function useProductFilter(fetchProductFunction, extraParams = {}) {
  const [allDocs, setAllDocs]   = useState([]);
  const [error, setError]       = useState(null);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [hasMore, setHasMore]   = useState(true);

  const dispatch      = useDispatch();
  const loaderRef     = useRef(null);
  const isFirstRender = useRef(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    color:      searchParams.get("color")?.split(",").filter(Boolean) || [],
    size:       searchParams.get("size")?.split(",").filter(Boolean)  || [],
    genre:      searchParams.get("genre")?.split(",").filter(Boolean) || [],
    sort:       searchParams.get("sort")       || "",
    priceRange: searchParams.get("priceRange") || "",
  }), [searchParams]);

  const handleFilterChange = useCallback((filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (["color", "size", "genre"].includes(filterType)) {
      Array.isArray(value) && value.length > 0
        ? newParams.set(filterType, value.join(","))
        : newParams.delete(filterType);
    } else {
      value ? newParams.set(filterType, value) : newParams.delete(filterType);
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleClearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // extraParams spread in — works for both simple thunks ({ page })
  // and thunks that need extra args ({ page, subcategories, gender })
  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dispatch(
        fetchProductFunction({ page: pageNum, ...extraParams })
      ).unwrap();

      const docs       = data?.products?.docs || data?.products || [];
      const totalItems = data?.totalItems ?? data?.products?.totalDocs ?? 0;

      if (pageNum === 1) {
        setAllDocs(docs);
      } else {
        setAllDocs((prev) => [...prev, ...docs]);
      }

      setHasMore(pageNum * 20 < totalItems);
    } catch (err) {
      console.error(err);
      setError("Error while fetching the data");
    } finally {
      setLoading(false);
    }
  }, [dispatch, fetchProductFunction, JSON.stringify(extraParams)]); // eslint-disable-line

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchPage(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter changes → reset and refetch ────────────────────────────────────
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
    fetchPage(1);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Infinite scroll page increment ────────────────────────────────────────
  useEffect(() => {
    if (page === 1) return;
    fetchPage(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Infinite scroll observer ──────────────────────────────────────────────
  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && !loading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const obs = new IntersectionObserver(handleObserver, {
      rootMargin: "20px",
      threshold: 0.1,
    });
    if (loaderRef.current && hasMore) obs.observe(loaderRef.current);
    return () => { if (loaderRef.current) obs.unobserve(loaderRef.current); };
  }, [handleObserver, hasMore]);

  // Apply filters client-side — instant, no extra fetch
  const products = useMemo(
    () => applyClientFilters(allDocs, filters),
    [allDocs, filters]
  );

  return {
    products,
    error,
    loading,
    hasMore,
    loaderRef,
    filters,
    handleFilterChange,
    handleClearFilters,
  };
}