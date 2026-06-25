import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputPanel, CalculateButton } from "@/components/calculator";

interface ObituariesInputPanelProps {
  onCalculate: (filters: FilterOptions) => void;
  isCalculating: boolean;
}

export interface FilterOptions {
  dateRange: { start: string; end: string };
  sourceTypes: string[];
  priceRange: { min: number; max: number };
  searchQuery: string;
}

export const ObituariesInputPanel = ({ onCalculate, isCalculating }: ObituariesInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [startDate, setStartDate] = useState("2010-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [sourceType, setSourceType] = useState("all");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100000");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCalculate = () => {
    onCalculate({
      dateRange: { start: startDate, end: endDate },
      sourceTypes: sourceType === 'all' ? [] : [sourceType],
      priceRange: { min: parseFloat(minPrice) || 0, max: parseFloat(maxPrice) || 100000 },
      searchQuery
    });
  };

  return (
    <InputPanel
      title={tr ? 'Obituary Filtrele' : 'Filter Obituaries'}
      onSubmit={(e) => { e.preventDefault(); if (!isCalculating) handleCalculate(); }}
      footer={
        <CalculateButton loading={isCalculating} fullWidth>
          {tr ? 'Obituaryları Takip Et' : 'Track Obituaries'}
        </CalculateButton>
      }
    >
        {/* Date Range */}
        <div className="space-y-4">
          <Label className="text-base font-medium">{tr ? 'Tarih Aralığı' : 'Date Range'}</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm text-muted-foreground">{tr ? 'Başlangıç' : 'From'}</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm text-muted-foreground">{tr ? 'Bitiş' : 'To'}</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11" />
            </div>
          </div>
        </div>

        {/* Source Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="source-type" className="text-sm font-medium">{tr ? 'Kaynak Türü' : 'Source Type'}</Label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger id="source-type" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tr ? 'Tüm Kaynaklar' : 'All Sources'}</SelectItem>
              <SelectItem value="media">{tr ? 'Medya' : 'Media'}</SelectItem>
              <SelectItem value="expert">{tr ? 'Uzman' : 'Expert'}</SelectItem>
              <SelectItem value="institution">{tr ? 'Kurum' : 'Institution'}</SelectItem>
              <SelectItem value="government">{tr ? 'Hükümet' : 'Government'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-base font-medium">{tr ? 'BTC Fiyat Aralığı (obituary tarihinde)' : 'BTC Price Range (at obituary)'}</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-price" className="text-sm text-muted-foreground">{tr ? 'Min ($)' : 'Min ($)'}</Label>
              <Input id="min-price" type="number" inputMode="decimal" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-11" min="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price" className="text-sm text-muted-foreground">{tr ? 'Maks ($)' : 'Max ($)'}</Label>
              <Input id="max-price" type="number" inputMode="decimal" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-11" min="0" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">{tr ? 'Ara' : 'Search'}</Label>
          <Input
            id="search"
            type="text"
            placeholder={tr ? 'Kaynak, başlık veya alıntıya göre ara...' : 'Search by source, headline, or quote...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11"
          />
        </div>

    </InputPanel>
  );
};
