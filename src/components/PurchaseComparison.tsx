import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/services/bitcoinApi';
import {
  Smartphone, Gamepad2, Utensils, GraduationCap, Car, Plane, Crown,
  TrendingUp, Coffee, Laptop, Watch, Headphones, Ticket, Dumbbell,
  Home, Gift, Book, Monitor, Tv, Pizza, ShoppingBag, Briefcase,
  Filter, ArrowUpDown, Share, Coins, Fuel, Camera
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PurchaseComparisonProps {
  result: CalculationResult;
}

interface ComparisonItem {
  nameEn: string;
  nameTr: string;
  icon: React.ElementType;
  priceUSD: number;
  categoryEn: string;
  categoryTr: string;
  color: string;
}

const COMPARISON_ITEMS: ComparisonItem[] = [
  { nameEn: 'Smartphones', nameTr: 'Akıllı Telefon', icon: Smartphone, priceUSD: 800, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-blue-500/10 text-blue-600' },
  { nameEn: 'Gaming Rigs', nameTr: 'Oyun Bilgisayarı', icon: Gamepad2, priceUSD: 1700, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-purple-500/10 text-purple-600' },
  { nameEn: 'Laptops', nameTr: 'Dizüstü Bilgisayar', icon: Laptop, priceUSD: 1200, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-indigo-500/10 text-indigo-600' },
  { nameEn: 'Headphones', nameTr: 'Kulaklık', icon: Headphones, priceUSD: 300, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-cyan-500/10 text-cyan-600' },
  { nameEn: '4K Monitors', nameTr: '4K Monitör', icon: Monitor, priceUSD: 500, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-blue-400/10 text-blue-500' },
  { nameEn: 'Smart TVs', nameTr: 'Akıllı TV', icon: Tv, priceUSD: 900, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-indigo-400/10 text-indigo-500' },
  { nameEn: 'DSLR Cameras', nameTr: 'DSLR Fotoğraf Makinesi', icon: Camera, priceUSD: 1400, categoryEn: 'Tech', categoryTr: 'Teknoloji', color: 'bg-slate-500/10 text-slate-600' },
  { nameEn: 'Restaurant Meals', nameTr: 'Restoran Yemeği', icon: Utensils, priceUSD: 100, categoryEn: 'Experience', categoryTr: 'Deneyim', color: 'bg-orange-500/10 text-orange-600' },
  { nameEn: 'Concert Tickets', nameTr: 'Konser Bileti', icon: Ticket, priceUSD: 150, categoryEn: 'Experience', categoryTr: 'Deneyim', color: 'bg-pink-500/10 text-pink-600' },
  { nameEn: 'Flight Tickets', nameTr: 'Uçak Bileti', icon: Plane, priceUSD: 400, categoryEn: 'Experience', categoryTr: 'Deneyim', color: 'bg-sky-500/10 text-sky-600' },
  { nameEn: 'Hotel Nights', nameTr: 'Otel Gecesi', icon: Crown, priceUSD: 200, categoryEn: 'Experience', categoryTr: 'Deneyim', color: 'bg-yellow-500/10 text-yellow-600' },
  { nameEn: 'Pizza Orders', nameTr: 'Pizza', icon: Pizza, priceUSD: 25, categoryEn: 'Experience', categoryTr: 'Deneyim', color: 'bg-destructive/10 text-destructive' },
  { nameEn: 'Shopping Sprees', nameTr: 'Alışveriş Turu', icon: ShoppingBag, priceUSD: 300, categoryEn: 'Experience', categoryTr: 'Deneyim', color: 'bg-purple-400/10 text-purple-500' },
  { nameEn: 'Online Courses', nameTr: 'Online Kurs', icon: GraduationCap, priceUSD: 150, categoryEn: 'Education', categoryTr: 'Eğitim', color: 'bg-success/10 text-success' },
  { nameEn: 'Books', nameTr: 'Kitap', icon: Book, priceUSD: 20, categoryEn: 'Education', categoryTr: 'Eğitim', color: 'bg-success/10 text-success' },
  { nameEn: 'Certifications', nameTr: 'Sertifika', icon: Briefcase, priceUSD: 500, categoryEn: 'Education', categoryTr: 'Eğitim', color: 'bg-teal-500/10 text-teal-600' },
  { nameEn: 'Car Rentals', nameTr: 'Araç Kiralama', icon: Car, priceUSD: 200, categoryEn: 'Transport', categoryTr: 'Ulaşım', color: 'bg-muted text-muted-foreground' },
  { nameEn: 'Fuel Fill-ups', nameTr: 'Yakıt Dolumu', icon: Fuel, priceUSD: 60, categoryEn: 'Transport', categoryTr: 'Ulaşım', color: 'bg-stone-500/10 text-stone-600' },
  { nameEn: 'Uber Rides', nameTr: 'Uber Yolculuğu', icon: Car, priceUSD: 25, categoryEn: 'Transport', categoryTr: 'Ulaşım', color: 'bg-zinc-500/10 text-zinc-600' },
  { nameEn: 'Coffee Orders', nameTr: 'Kahve', icon: Coffee, priceUSD: 5, categoryEn: 'Lifestyle', categoryTr: 'Yaşam Tarzı', color: 'bg-amber-500/10 text-amber-600' },
  { nameEn: 'Gym Memberships', nameTr: 'Spor Salonu Üyeliği', icon: Dumbbell, priceUSD: 50, categoryEn: 'Lifestyle', categoryTr: 'Yaşam Tarzı', color: 'bg-destructive/10 text-destructive' },
  { nameEn: 'Streaming Annual', nameTr: 'Yıllık Yayın Aboneliği', icon: Tv, priceUSD: 120, categoryEn: 'Lifestyle', categoryTr: 'Yaşam Tarzı', color: 'bg-violet-400/10 text-violet-500' },
  { nameEn: 'Fitness Gear', nameTr: 'Fitness Ekipmanı', icon: Dumbbell, priceUSD: 200, categoryEn: 'Lifestyle', categoryTr: 'Yaşam Tarzı', color: 'bg-orange-400/10 text-orange-500' },
  { nameEn: 'Jewelry', nameTr: 'Mücevher', icon: Gift, priceUSD: 1500, categoryEn: 'Luxury', categoryTr: 'Lüks', color: 'bg-rose-500/10 text-rose-600' },
  { nameEn: 'Watches', nameTr: 'Saat', icon: Watch, priceUSD: 5000, categoryEn: 'Luxury', categoryTr: 'Lüks', color: 'bg-violet-500/10 text-violet-600' },
  { nameEn: 'Designer Bags', nameTr: 'Tasarımcı Çanta', icon: ShoppingBag, priceUSD: 2000, categoryEn: 'Luxury', categoryTr: 'Lüks', color: 'bg-pink-400/10 text-pink-500' },
  { nameEn: 'NVIDIA Stocks', nameTr: 'NVIDIA Hissesi', icon: TrendingUp, priceUSD: 900, categoryEn: 'Investment', categoryTr: 'Yatırım', color: 'bg-success/10 text-success' },
  { nameEn: 'Gold Ounces', nameTr: 'Ons Altın', icon: Coins, priceUSD: 2000, categoryEn: 'Investment', categoryTr: 'Yatırım', color: 'bg-yellow-400/10 text-yellow-500' },
  { nameEn: 'Real Estate Down Payment', nameTr: 'Gayrimenkul Peşinatı', icon: Home, priceUSD: 50000, categoryEn: 'Investment', categoryTr: 'Yatırım', color: 'bg-teal-500/10 text-teal-600' },
];

export const PurchaseComparison = React.memo(({ result }: PurchaseComparisonProps) => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'quantity' | 'price'>('quantity');

  const allCategories = ['All', ...new Set(COMPARISON_ITEMS.map(item => item.categoryEn))];

  const comparisons = useMemo(() => {
    const currentValue = result.currentValue;
    let filtered = COMPARISON_ITEMS
      .map(item => ({ ...item, quantity: Math.floor(currentValue / item.priceUSD), adjustedPrice: item.priceUSD }))
      .filter(item => item.quantity > 0);
    if (selectedCategory !== 'All') filtered = filtered.filter(item => item.categoryEn === selectedCategory);
    filtered.sort((a, b) => sortBy === 'quantity' ? b.quantity - a.quantity : a.adjustedPrice - b.adjustedPrice);
    return filtered.slice(0, 8);
  }, [result.currentValue, selectedCategory, sortBy]);

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000000) return `${(quantity / 1000000).toFixed(1)}M`;
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(1)}K`;
    return quantity.toLocaleString();
  };

  const handleShare = async (item: any) => {
    const name = isTr ? item.nameTr : item.nameEn;
    const text = isTr
      ? `Bitcoin yatırımımla ${formatQuantity(item.quantity)}× ${name} alabilirdim! 🚀`
      : `I could have bought ${formatQuantity(item.quantity)}× ${item.nameEn} with my Bitcoin investment! 🚀`;
    try {
      if (navigator.share && navigator.canShare?.({ text })) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      try { await navigator.clipboard.writeText(text); } catch {}
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return isTr ? 'Tümü' : 'All';
    const item = COMPARISON_ITEMS.find(i => i.categoryEn === cat);
    return isTr ? (item?.categoryTr || cat) : cat;
  };

  return (
    <Card className="glass-morphism-card border-border/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              🛍️ {isTr ? 'Neler Alabilirdiniz' : 'What You Could Have Bought'}
            </CardTitle>
            <p className="text-sm text-foreground/70 mt-1">
              {result.currency}{result.currentValue.toLocaleString()} {isTr ? 'ile alabileceğiniz...' : 'could buy...'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4" role="toolbar">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground/60" aria-hidden="true" />
            <div className="flex flex-wrap gap-1" role="group">
              {allCategories.map(category => (
                <Button key={category} size="sm" variant={selectedCategory === category ? "default" : "outline"}
                  className="text-xs h-7 px-3" onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}>
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-foreground/60" aria-hidden="true" />
            <div className="flex gap-1" role="group">
              <Button size="sm" variant={sortBy === 'quantity' ? "default" : "outline"} className="text-xs h-7 px-3"
                onClick={() => setSortBy('quantity')} aria-pressed={sortBy === 'quantity'}>
                {isTr ? 'Adet' : 'Quantity'}
              </Button>
              <Button size="sm" variant={sortBy === 'price' ? "default" : "outline"} className="text-xs h-7 px-3"
                onClick={() => setSortBy('price')} aria-pressed={sortBy === 'price'}>
                {isTr ? 'Fiyat' : 'Price'}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" role="grid">
          {comparisons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.nameEn}
                className="relative p-3 sm:p-4 calc-surface-interactive group"
                role="gridcell" tabIndex={0}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-foreground font-mono">{formatQuantity(item.quantity)}×</div>
                    <div className="text-xs font-medium text-foreground/80 leading-tight">
                      {isTr ? item.nameTr : item.nameEn}
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">${item.adjustedPrice}</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost"
                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                  onClick={() => handleShare(item)}>
                  <Share className="w-3 h-3" aria-hidden="true" />
                </Button>
                {index < 3 && sortBy === 'quantity' && (
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-foreground/70">
              {isTr
                ? `${comparisons.length} ürün gösteriliyor${selectedCategory !== 'All' ? ` — ${getCategoryLabel(selectedCategory)}` : ''}`
                : `Showing ${comparisons.length} items${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}`}
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="text-xs">
                {isTr ? `Toplam Kategori: ${allCategories.length - 1}` : `Total Categories: ${allCategories.length - 1}`}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {COMPARISON_ITEMS.length} {isTr ? 'Ürün Mevcut' : 'Items Available'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PurchaseComparison.displayName = 'PurchaseComparison';
