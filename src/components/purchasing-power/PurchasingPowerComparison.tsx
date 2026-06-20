import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PurchasingPowerResult,
  PurchasingPowerCalculator,
  getLocalizedItemName,
  getLocalizedCategory,
} from "@/services/purchasingPowerCalculator";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, ShoppingBag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface PurchasingPowerComparisonProps {
  result: PurchasingPowerResult | null;
  /** User-selected display currency symbol (used for total only). */
  currencySymbol: string;
  /** When true, render skeletons instead of the grid/empty-state. */
  loading?: boolean;
}

/**
 * "What You Can Buy" — fully localized.
 *
 * Reference item prices are USD-denominated, so per-item prices always
 * render in `$`. The component-level `currencySymbol` prop is kept in
 * the API for upstream compatibility but intentionally not applied to
 * per-item prices (avoids displaying `€999` for a USD-priced item with
 * no FX conversion). Quantities are computed from USD totals upstream.
 */
export const PurchasingPowerComparison = ({
  result,
  loading = false,
}: PurchasingPowerComparisonProps) => {
  const { language } = useLanguage();
  const tr = language === "tr";
  const localeTag = tr ? "tr-TR" : "en-US";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"quantity" | "price">("quantity");
  const [showAll, setShowAll] = useState(false);

  // Reset pagination whenever the filter set changes so the visible-count
  // copy in the toggle button can't go negative.
  useEffect(() => {
    setShowAll(false);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = new Set(result.items.map((item) => item.category));
    return ["all", ...Array.from(cats)];
  }, [result.items]);

  // Turkish-safe case-insensitive search (handles I/İ/i/ı).
  const normalize = (s: string) => s.toLocaleLowerCase(localeTag);

  const filteredItems = useMemo(() => {
    let items = [...result.items];
    if (searchQuery) {
      const q = normalize(searchQuery);
      items = items.filter((item) => {
        const localized = getLocalizedItemName(item, language);
        return (
          normalize(localized).includes(q) ||
          normalize(item.name).includes(q)
        );
      });
    }
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }
    items.sort((a, b) => {
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return a.priceUSD - b.priceUSD;
    });
    return items;
  }, [result.items, searchQuery, selectedCategory, sortBy, language]);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 12);
  const hasMore = filteredItems.length > 12;
  const isFiltered = searchQuery !== "" || selectedCategory !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("quantity");
  };

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <span
              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <ShoppingBag className="w-4 h-4 text-primary" />
            </span>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
                {tr ? "Ne Satın Alabilirsiniz" : "What You Can Buy"}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {tr
                  ? "Bitcoin\u2019inizle alabileceğiniz gerçek dünya ürünlerini keşfedin"
                  : "Explore real-world items you could buy with your Bitcoin"}
              </p>
            </div>
          </div>
          <span
            className="text-[11px] uppercase tracking-wider text-muted-foreground tabular-nums shrink-0"
            aria-live="polite"
          >
            {tr
              ? `${filteredItems.length} / ${result.items.length} ürün`
              : `${filteredItems.length} of ${result.items.length} items`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="ppc-search" className="sr-only">
              {tr ? "Ürün ara" : "Search items"}
            </label>
            <Input
              id="ppc-search"
              placeholder={tr ? "Ürün ara..." : "Search items..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger
              className="w-full sm:w-[200px] h-10"
              aria-label={tr ? "Kategoriye göre filtrele" : "Filter by category"}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
              <SelectValue
                placeholder={tr ? "Tüm Kategoriler" : "All Categories"}
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all"
                    ? tr
                      ? "Tüm Kategoriler"
                      : "All Categories"
                    : getLocalizedCategory(cat, language)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value: "quantity" | "price") => setSortBy(value)}
          >
            <SelectTrigger
              className="w-full sm:w-[200px] h-10"
              aria-label={tr ? "Sıralama" : "Sort items"}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quantity">
                {tr ? "En Fazla Miktar" : "Most Quantity"}
              </SelectItem>
              <SelectItem value="price">
                {tr ? "En Düşük Fiyat" : "Lowest Price"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {displayedItems.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-sm">
              {tr
                ? "Kriterlerinize uyan ürün bulunamadı"
                : "No items found matching your criteria"}
            </p>
            {isFiltered && (
              <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                {tr ? "Filtreleri Sıfırla" : "Reset filters"}
              </Button>
            )}
          </div>
        ) : (
          <>
            <ul
              role="list"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 auto-rows-fr"
            >
              {displayedItems.map((item) => {
                const IconComponent = item.icon;
                const localizedName = getLocalizedItemName(item, language);
                const localizedCategory = getLocalizedCategory(item.category, language);
                return (
                  <li
                    key={item.id}
                    className="group min-w-0 p-4 sm:p-5 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all duration-200 flex flex-col gap-3"
                  >
                    {/* Top row: icon + USD reference price */}
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}
                        aria-hidden="true"
                      >
                        <IconComponent className="w-[18px] h-[18px] text-white" />
                      </div>
                      <p
                        className="text-[11px] font-medium text-muted-foreground tabular-nums truncate text-right pt-1"
                        title={tr ? "Referans fiyatı USD cinsindendir" : "Reference price in USD"}
                      >
                        ${item.priceUSD.toLocaleString(localeTag)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-baseline gap-1.5 min-w-0">
                      <p className="text-2xl sm:text-[26px] font-bold text-foreground tabular-nums leading-none truncate tracking-tight">
                        {PurchasingPowerCalculator.formatQuantity(item.quantity)}
                      </p>
                      <p className="text-[11px] text-muted-foreground shrink-0 uppercase tracking-wider">
                        {tr ? "adet" : "units"}
                      </p>
                    </div>

                    {/* Hairline divider */}
                    <div className="h-px bg-border/50 -mx-1" aria-hidden="true" />

                    {/* Name + category caption */}
                    <div className="min-w-0 mt-auto">
                      <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2 break-words min-h-[2.5rem]">
                        {localizedName}
                      </p>
                      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground truncate">
                        {localizedCategory}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAll(!showAll)}
                  className="gap-2"
                  aria-expanded={showAll}
                >
                  {showAll ? (
                    <>
                      {tr ? "Daha Az Göster" : "Show Less"}
                      <ChevronUp className="w-4 h-4" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      {tr
                        ? `Daha Fazla Göster (${filteredItems.length - 12} daha)`
                        : `View More (${filteredItems.length - 12} more)`}
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* USD reference notice (only when display currency ≠ USD) */}
            {result.currency !== "USD" && (
              <p className="text-[11px] text-muted-foreground text-center pt-1">
                {tr
                  ? "Ürün fiyatları referans olarak USD cinsinden gösterilmektedir."
                  : "Item prices are shown in USD as a reference."}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
