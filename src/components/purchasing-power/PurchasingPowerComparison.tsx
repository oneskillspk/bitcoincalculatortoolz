import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PurchasingPowerResult,
  PurchasingPowerCalculator,
  getLocalizedItemName,
  getLocalizedCategory,
} from "@/services/purchasingPowerCalculator";
import {
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowUpDown,
  Info,
  PackageSearch,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PurchasingPowerComparisonProps {
  result: PurchasingPowerResult;
  /** Kept for upstream API compatibility — item prices are always shown in USD. */
  currencySymbol: string;
}

type SortMode = "quantity" | "priceAsc" | "priceDesc";

const INITIAL_VISIBLE = 16;

/**
 * "What You Can Buy" — dashboard redesign.
 * Chip filters, category bands, dense card grid, USD-locked reference prices.
 */
export const PurchasingPowerComparison = ({ result }: PurchasingPowerComparisonProps) => {
  const { language } = useLanguage();
  const tr = language === "tr";
  const localeTag = tr ? "tr-TR" : "en-US";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortMode>("quantity");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = new Set(result.items.map((i) => i.category));
    return ["all", ...Array.from(cats)];
  }, [result.items]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { all: result.items.length };
    for (const item of result.items) {
      map[item.category] = (map[item.category] || 0) + 1;
    }
    return map;
  }, [result.items]);

  const normalize = (s: string) => s.toLocaleLowerCase(localeTag);

  const filteredItems = useMemo(() => {
    let items = [...result.items];
    if (searchQuery) {
      const q = normalize(searchQuery);
      items = items.filter((item) => {
        const localized = getLocalizedItemName(item, language);
        return normalize(localized).includes(q) || normalize(item.name).includes(q);
      });
    }
    if (selectedCategory !== "all") {
      items = items.filter((i) => i.category === selectedCategory);
    }
    items.sort((a, b) => {
      if (sortBy === "quantity") return b.quantity - a.quantity;
      if (sortBy === "priceAsc") return a.priceUSD - b.priceUSD;
      return b.priceUSD - a.priceUSD;
    });
    return items;
  }, [result.items, searchQuery, selectedCategory, sortBy, language]);

  const visibleItems = showAll ? filteredItems : filteredItems.slice(0, INITIAL_VISIBLE);
  const hasMore = filteredItems.length > INITIAL_VISIBLE;
  const isFiltered = searchQuery !== "" || selectedCategory !== "all";

  // Group by category, but only when we are showing the "All" view
  // and sorting by quantity (bands aren't meaningful for global price sorts).
  const showBands = selectedCategory === "all" && sortBy === "quantity" && !searchQuery;
  const grouped = useMemo(() => {
    if (!showBands) return null;
    const map = new Map<string, typeof visibleItems>();
    for (const item of visibleItems) {
      const arr = map.get(item.category) ?? [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return Array.from(map.entries());
  }, [visibleItems, showBands]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("quantity");
  };

  const sortLabel =
    sortBy === "quantity"
      ? tr ? "En Fazla Miktar" : "Most quantity"
      : sortBy === "priceAsc"
      ? tr ? "En Düşük Fiyat" : "Lowest price"
      : tr ? "En Yüksek Fiyat" : "Highest price";

  const totalUsdLabel = `$${Math.round(result.totalValue).toLocaleString(localeTag)}`;
  const btcLabel = `₿${result.btcAmount.toLocaleString(localeTag, {
    maximumFractionDigits: 6,
  })}`;

  return (
    <TooltipProvider delayDuration={150}>
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-4 space-y-3">
          {/* Title + count */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-foreground">
                {tr ? "Ne Satın Alabilirsiniz" : "What You Can Buy"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {tr ? (
                  <>
                    {btcLabel}{" "}
                    <span className="text-muted-foreground/70">
                      (~{totalUsdLabel})
                    </span>{" "}
                    ile alabileceğiniz ürünler.
                  </>
                ) : (
                  <>
                    With {btcLabel}{" "}
                    <span className="text-muted-foreground/70">
                      (~{totalUsdLabel})
                    </span>{" "}
                    you could afford…
                  </>
                )}
              </p>
            </div>
            <span
              className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground tabular-nums pt-1"
              aria-live="polite"
            >
              {tr
                ? `${filteredItems.length} / ${result.items.length}`
                : `${filteredItems.length} / ${result.items.length}`}
            </span>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Category chips */}
            <div
              role="tablist"
              aria-label={tr ? "Kategoriler" : "Categories"}
              className="flex flex-nowrap lg:flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 min-w-0"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                const label =
                  cat === "all"
                    ? tr ? "Tümü" : "All"
                    : getLocalizedCategory(cat, language);
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-background text-muted-foreground border-border/60 hover:text-foreground hover:border-border",
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cn(
                        "tabular-nums text-[10px]",
                        active ? "text-primary/70" : "text-muted-foreground/70",
                      )}
                    >
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search + Sort + Info */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-full sm:w-[220px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <label htmlFor="ppc-search" className="sr-only">
                  {tr ? "Ürün ara" : "Search items"}
                </label>
                <Input
                  id="ppc-search"
                  placeholder={tr ? "Ürün ara…" : "Search items…"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8 h-9 text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label={tr ? "Aramayı temizle" : "Clear search"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 text-xs font-medium"
                    aria-label={tr ? "Sıralama" : "Sort items"}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{sortLabel}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs">
                    {tr ? "Sırala" : "Sort by"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as SortMode)}
                  >
                    <DropdownMenuRadioItem value="quantity">
                      {tr ? "En Fazla Miktar" : "Most quantity"}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priceAsc">
                      {tr ? "En Düşük Fiyat" : "Lowest price"}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="priceDesc">
                      {tr ? "En Yüksek Fiyat" : "Highest price"}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  {isFiltered && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={resetFilters} className="text-xs gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        {tr ? "Filtreleri Sıfırla" : "Reset filters"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {result.currency !== "USD" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={tr ? "Fiyatlar USD" : "Prices in USD"}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[220px] text-xs">
                    {tr
                      ? "Ürün referans fiyatları USD cinsindendir."
                      : "Item reference prices are shown in USD."}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {visibleItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <PackageSearch
                className="w-10 h-10 mx-auto text-muted-foreground/40"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                {tr
                  ? "Kriterlerinize uyan ürün bulunamadı"
                  : "No items match these filters"}
              </p>
              {isFiltered && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="gap-2 text-primary hover:text-primary"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  {tr ? "Filtreleri Sıfırla" : "Reset filters"}
                </Button>
              )}
            </div>
          ) : grouped ? (
            <div className="space-y-6">
              {grouped.map(([cat, items]) => (
                <section key={cat}>
                  <CategoryBand
                    label={getLocalizedCategory(cat, language)}
                    count={items.length}
                  />
                  <ItemGrid
                    items={items}
                    language={language}
                    localeTag={localeTag}
                  />
                </section>
              ))}
            </div>
          ) : (
            <ItemGrid
              items={visibleItems}
              language={language}
              localeTag={localeTag}
            />
          )}

          {hasMore && (
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                aria-expanded={showAll}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                {showAll ? (
                  <>
                    {tr ? "Daha Az Göster" : "Show less"}
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    {tr
                      ? `${filteredItems.length - INITIAL_VISIBLE} ürün daha göster`
                      : `Show ${filteredItems.length - INITIAL_VISIBLE} more`}
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

/* --- Subcomponents --- */

const CategoryBand = ({ label, count }: { label: string; count: number }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
    </span>
    <span className="text-[11px] tabular-nums text-muted-foreground/70">
      · {count}
    </span>
    <div className="flex-1 h-px bg-border/60" aria-hidden="true" />
  </div>
);

interface ItemGridProps {
  items: PurchasingPowerResult["items"];
  language: string;
  localeTag: string;
}

const ItemGrid = ({ items, language, localeTag }: ItemGridProps) => (
  <ul
    role="list"
    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
  >
    {items.map((item) => {
      const Icon = item.icon;
      const name = getLocalizedItemName(item, language);
      return (
        <li
          key={item.id}
          className="group flex flex-col rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 hover:shadow-sm"
        >
          {/* Icon chip */}
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>

          {/* Quantity */}
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums text-foreground leading-none">
              {PurchasingPowerCalculator.formatQuantity(item.quantity)}
            </span>
            <span className="text-base text-muted-foreground leading-none">×</span>
          </div>

          {/* Name */}
          <p
            className="mt-1.5 text-sm font-medium text-foreground truncate"
            title={name}
          >
            {name}
          </p>

          {/* Footer: price · category */}
          <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-2">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              ${item.priceUSD.toLocaleString(localeTag)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 truncate">
              {getLocalizedCategory(item.category, language)}
            </span>
          </div>
        </li>
      );
    })}
  </ul>
);
