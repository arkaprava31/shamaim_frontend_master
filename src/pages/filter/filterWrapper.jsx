import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
  Drawer,
  IconButton,
} from "@material-tailwind/react";
import { FiX, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function FilterWrapper({
  filters = {},
  onFilterChange,
  onClearFilters,
  children,
}) {
  const [open, setOpen] = useState({
    sort: true,
    color: true,
    size: true,
    price: true,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const COLORS = ["black","yellow", "lavender", "camel", "cream white", "grey"];
  const SIZES = ["xs", "s", "m", "l", "xl","xxl"];
  const GENRE= ["music & band","anime","sports","movies & series","super hero","abstract","drip & doodle"];
  // const PRICE_RANGES = [
  //   { label: "Under ₹500", value: "<500" },
  //   { label: "₹500 - ₹1000", value: "500-1000" },
  //   { label: "₹1000 - ₹2000", value: "1000-2000" },
  // ];

  const SORT_OPTIONS = [
    { label: "Price: Low → High", value: "price-asc" },
    { label: "Price: High → Low", value: "price-desc" },
  ];

  const hasActiveFilters =
    filters.color?.length ||
    filters.size?.length ||
     filters.genre?.length ||
    filters.sort ||
    filters.priceRange;

  // Mobile filter drawer
  const MobileFilterDrawer = () => (
    <Drawer
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      className="p-4"
      placement="left"
      size={300}
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5" color="blue-gray">
          Filters
        </Typography>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="space-y-6">
        {/* Mobile SORT */}
        <div className="border-b pb-4">
          <Typography variant="h6" className="mb-3">
            Sort By
          </Typography>
          <div className="space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex gap-3 items-center">
                <input
                  type="radio"
                  name="sort-mobile"
                  checked={filters.sort === opt.value}
                  onChange={() => {
                    onFilterChange("sort", opt.value);
                  }}
                  className="h-4 w-4"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Mobile COLOR */}
        <div className="border-b pb-4">
          <Typography variant="h6" className="mb-3">
            Color
          </Typography>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <Chip
                key={c}
                value={c}
                variant={
                  filters.color?.includes(c) ? "filled" : "outlined"
                }
                onClick={() => {
                  const updated = filters.color?.includes(c)
                    ? filters.color.filter((x) => x !== c)
                    : [...(filters.color || []), c];
                  onFilterChange("color", updated);
                }}
                className="cursor-pointer capitalize text-xs"
              />
            ))}
          </div>
        </div>

        {/* Mobile SIZE */}
        <div className="border-b pb-4">
          <Typography variant="h6" className="mb-3">
            Size
          </Typography>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <Chip
                key={s}
                value={s.toUpperCase()}
                variant={
                  filters.size?.includes(s) ? "filled" : "outlined"
                }
                onClick={() => {
                  const updated = filters.size?.includes(s)
                    ? filters.size.filter((x) => x !== s)
                    : [...(filters.size || []), s];
                  onFilterChange("size", updated);
                }}
                className="cursor-pointer text-xs"
              />
            ))}
          </div>
        </div>

         {/* Mobile Genre */}
        <div className="border-b pb-4">
          <Typography variant="h6" className="mb-3">
            Genre
          </Typography>
          <div className="flex flex-wrap gap-2">
            {GENRE.map((s) => (
              <Chip
                key={s}
                value={s.toUpperCase()}
                variant={
                  filters.genre?.includes(s) ? "filled" : "outlined"
                }
                onClick={() => {
                  const updated = filters.genre?.includes(s)
                    ? filters.genre.filter((x) => x !== s)
                    : [...(filters.genre || []), s];
                  onFilterChange("genre", updated);
                }}
                className="cursor-pointer text-xs"
              />
            ))}
          </div>
        </div>
                  

        {/* Mobile PRICE */}
        {/* <div className="border-b pb-4">
          <Typography variant="h6" className="mb-3">
            Price Range
          </Typography>
          <div className="space-y-2">
            {PRICE_RANGES.map((r) => (
              <label key={r.value} className="flex gap-3 items-center">
                <input
                  type="radio"
                  name="price-mobile"
                  checked={filters.priceRange === r.value}
                  onChange={() =>
                    onFilterChange("priceRange", r.value)
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm">{r.label}</span>
              </label>
            ))}
          </div>
        </div> */}

        <div className="flex gap-3">
          {hasActiveFilters && (
            <Button
              fullWidth
              variant="outlined"
              color="red"
              onClick={() => {
                onClearFilters();
                setSidebarOpen(false);
              }}
            >
              Clear All
            </Button>
          )}
          <Button
            fullWidth
            color="blue"
            onClick={() => setSidebarOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Drawer>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:py-10">
      {/* Mobile Filter Button and Active Filters Bar */}
      <div className="md:hidden mb-4 my-8 ">
        <div className="flex items-center justify-between py-3 border-b">
          <Button
            variant="outlined"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(true)}
          >
            <FiFilter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="text"
              color="red"
              onClick={onClearFilters}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Chips for Mobile */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 py-3">
            {filters.color?.map((c) => (
              <Chip
                key={c}
                value={c}
                size="sm"
                variant="filled"
                onClose={() =>
                  onFilterChange(
                    "color",
                    filters.color.filter((x) => x !== c)
                  )
                }
                className="capitalize"
              />
            ))}
            {filters.size?.map((s) => (
              <Chip
                key={s}
                value={s.toUpperCase()}
                size="sm"
                variant="filled"
                onClose={() =>
                  onFilterChange(
                    "size",
                    filters.size.filter((x) => x !== s)
                  )
                }
              />
            ))}
            {filters.genre?.map((s) => (
              <Chip
                key={s}
                value={s.toUpperCase()}
                size="sm"
                variant="filled"
                onClose={() =>
                  onFilterChange(
                    "genre",
                    filters.genre.filter((x) => x !== s)
                  )
                }
              />
            ))}
            {filters.sort && (
              <Chip
                value="Sorted"
                size="sm"
                variant="filled"
                onClose={() => onFilterChange("sort", "")}
              />
            )}
            {/* {filters.priceRange && (
              <Chip
                value="Price Range"
                size="sm"
                variant="filled"
                onClose={() => onFilterChange("priceRange", "")}
              />
            )} */}
          </div>
        )}
      </div>

      <div className="flex gap-6 relative">
        {/* Sidebar Toggle Button for Desktop */}
        {/*  */}

        {/* SIDEBAR - Desktop */}
        {!sidebarCollapsed && (
          <aside className="hidden md:block w-72 shrink-0 transition-all duration-300 ">
            <Card className="sticky top-24">
              <CardBody className="space-y-6">
                <div className="flex justify-between items-center">
                  <Typography variant="h5" className="font-bold">
                    Filters
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      size="sm"
                      variant="text"
                      color="red"
                      onClick={onClearFilters}
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* SORT */}
                <div className="border rounded-lg overflow-hidden">
                  <Accordion open={open.sort}>
                    <AccordionHeader
                      onClick={() => toggle("sort")}
                      className="px-4 py-3 border-b hover:bg-gray-50"
                    >
                      <Typography className="font-semibold">
                        Sort By
                      </Typography>
                    </AccordionHeader>
                    <AccordionBody className="p-4 space-y-3">
                      {SORT_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="radio"
                            name="sort"
                            checked={filters.sort === opt.value}
                            onChange={() =>
                              onFilterChange("sort", opt.value)
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </AccordionBody>
                  </Accordion>
                </div>

                {/* COLOR */}
                <div className="border rounded-lg overflow-hidden">
                  <Accordion open={open.color}>
                    <AccordionHeader
                      onClick={() => toggle("color")}
                      className="px-4 py-3 border-b hover:bg-gray-50"
                    >
                      <Typography className="font-semibold">
                        Color
                      </Typography>
                    </AccordionHeader>
                    <AccordionBody className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((c) => (
                          <Chip
                            key={c}
                            value={c}
                            variant={
                              filters.color?.includes(c)
                                ? "filled"
                                : "outlined"
                            }
                            color={
                              filters.color?.includes(c) ? "blue" : "gray"
                            }
                            onClick={() => {
                              const updated = filters.color?.includes(c)
                                ? filters.color.filter((x) => x !== c)
                                : [...(filters.color || []), c];
                              onFilterChange("color", updated);
                            }}
                            className="cursor-pointer capitalize hover:shadow-md transition-shadow"
                          />
                        ))}
                      </div>
                    </AccordionBody>
                  </Accordion>
                </div>

                {/* SIZE */}
                <div className="border rounded-lg overflow-hidden">
                  <Accordion open={open.size}>
                    <AccordionHeader
                      onClick={() => toggle("size")}
                      className="px-4 py-3 border-b hover:bg-gray-50"
                    >
                      <Typography className="font-semibold">
                        Size
                      </Typography>
                    </AccordionHeader>
                    <AccordionBody className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((s) => (
                          <Chip
                            key={s}
                            value={s.toUpperCase()}
                            variant={
                              filters.size?.includes(s)
                                ? "filled"
                                : "outlined"
                            }
                            color={
                              filters.size?.includes(s) ? "blue" : "gray"
                            }
                            onClick={() => {
                              const updated = filters.size?.includes(s)
                                ? filters.size.filter((x) => x !== s)
                                : [...(filters.size || []), s];
                              onFilterChange("size", updated);
                            }}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                          />
                        ))}
                      </div>
                    </AccordionBody>
                  </Accordion>
                </div>

                {/* GENRE */}
                 <div className="border rounded-lg overflow-hidden">
                  <Accordion open={open.size}>
                    <AccordionHeader
                      onClick={() => toggle("size")}
                      className="px-4 py-3 border-b hover:bg-gray-50"
                    >
                      <Typography className="font-semibold">
                        Genre
                      </Typography>
                    </AccordionHeader>
                    <AccordionBody className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {GENRE.map((s) => (
                          <Chip
                            key={s}
                            value={s.toUpperCase()}
                            variant={
                              filters.genre?.includes(s)
                                ? "filled"
                                : "outlined"
                            }
                            color={
                              filters.genre?.includes(s) ? "blue" : "gray"
                            }
                            onClick={() => {
                              const updated = filters.genre?.includes(s)
                                ? filters.genre.filter((x) => x !== s)
                                : [...(filters.genre || []), s];
                              onFilterChange("genre", updated);
                            }}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                          />
                        ))}
                      </div>
                    </AccordionBody>
                  </Accordion>
                </div>
                          

                {/* PRICE */}
                {/* <div className="border rounded-lg overflow-hidden">
                  <Accordion open={open.price}>
                    <AccordionHeader
                      onClick={() => toggle("price")}
                      className="px-4 py-3 border-b hover:bg-gray-50"
                    >
                      <Typography className="font-semibold">
                        Price Range
                      </Typography>
                    </AccordionHeader>
                    <AccordionBody className="p-4 space-y-3">
                      {PRICE_RANGES.map((r) => (
                        <label
                          key={r.value}
                          className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="radio"
                            name="price"
                            checked={filters.priceRange === r.value}
                            onChange={() =>
                              onFilterChange("priceRange", r.value)
                            }
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm">{r.label}</span>
                        </label>
                      ))}
                    </AccordionBody>
                  </Accordion>
                </div> */}
              </CardBody>
            </Card>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : ''}`}>
          {/* Active Filters Chips for Desktop */}
          {hasActiveFilters && (
            <div className="hidden md:flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
              <Typography variant="small" className="font-semibold mr-2">
                Active Filters:
              </Typography>
              {filters.color?.map((c) => (
                <Chip
                  key={c}
                  value={c}
                  variant="filled"
                  color="blue"
                  onClose={() =>
                    onFilterChange(
                      "color",
                      filters.color.filter((x) => x !== c)
                    )
                  }
                  className="capitalize"
                />
              ))}
              {filters.size?.map((s) => (
                <Chip
                  key={s}
                  value={s.toUpperCase()}
                  variant="filled"
                  color="blue"
                  onClose={() =>
                    onFilterChange(
                      "size",
                      filters.size.filter((x) => x !== s)
                    )
                  }
                />
              ))}
              {filters.genre?.map((g) => (
                <Chip
                  key={g}
                  value={g.toUpperCase()}
                  variant="filled"
                  color="blue"
                  onClose={() =>
                    onFilterChange(
                      "genre",
                      filters.genre.filter((x) => x !== g)
                    )
                  }
                />
              ))}
              {filters.sort && (
                <Chip
                  value={`Sort: ${SORT_OPTIONS.find(o => o.value === filters.sort)?.label || 'Sorted'}`}
                  variant="filled"
                  color="blue"
                  onClose={() => onFilterChange("sort", "")}
                />
              )}
              {/* {filters.priceRange && (
                <Chip
                  value={`Price: ${PRICE_RANGES.find(p => p.value === filters.priceRange)?.label || 'Range'}`}
                  variant="filled"
                  color="blue"
                  onClose={() => onFilterChange("priceRange", "")}
                />
              )} */}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer />
    </div>
  );
}