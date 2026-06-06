import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PurchasingPowerResult, PurchasingPowerCalculator } from "@/services/purchasingPowerCalculator";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface PurchasingPowerComparisonProps {
  result: PurchasingPowerResult;
  currencySymbol: string;
}

export const PurchasingPowerComparison = ({ result, currencySymbol }: PurchasingPowerComparisonProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"quantity" | "price">("quantity");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(result.items.map(item => item.category));
    return ["all", ...Array.from(cats)];
  }, [result.items]);

  const filteredItems = useMemo(() => {
    let items = [...result.items];
    if (searchQuery) {
      items = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== "all") {
      items = items.filter(item => item.category === selectedCategory);
    }
    items.sort((a, b) => {
      if (sortBy === "quantity") return b.quantity - a.quantity;
      return a.priceUSD - b.priceUSD;
    });
    return items;
  }, [result.items, searchQuery, selectedCategory, sortBy]);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 12);
  const hasMore = filteredItems.length > 12;

  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl">
            {tr ? 'Ne Satın Alabilirsiniz' : 'What You Can Buy'}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-normal">
              {tr ? `${filteredItems.length} ürün mevcut` : `${filteredItems.length} items available`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={tr ? 'Ürün ara...' : 'Search items...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 md:pl-9 h-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? (tr ? "Tüm Kategoriler" : "All Categories") : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "quantity" | "price") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[160px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quantity">{tr ? 'En Fazla Miktar' : 'Most Quantity'}</SelectItem>
              <SelectItem value="price">{tr ? 'En Düşük Fiyat' : 'Lowest Price'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {displayedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              {tr ? 'Kriterlerinize uyan ürün bulunamadı' : 'No items found matching your criteria'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 hover:border-border/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${item.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {PurchasingPowerCalculator.formatQuantity(item.quantity)}
                        </p>
                        <p className="text-xs text-muted-foreground">{tr ? 'adet' : 'units'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{item.name}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs font-normal">{item.category}</Badge>
                        <p className="text-xs text-muted-foreground">{currencySymbol}{item.priceUSD.toLocaleString(getCurrentIntlLocale())}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={() => setShowAll(!showAll)} className="gap-2">
                  {showAll ? (
                    <>
                      {tr ? 'Daha Az Göster' : 'Show Less'}
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      {tr ? `Daha Fazla Göster (${filteredItems.length - 12} daha)` : `View More (${filteredItems.length - 12} more)`}
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
