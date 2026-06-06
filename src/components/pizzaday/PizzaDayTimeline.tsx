import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Clock } from 'lucide-react';
import { PIZZA_TIMELINE_EVENTS } from '@/services/pizzaDayCalculatorService';
import { useLanguage } from '@/contexts/LanguageContext';

const getNextPizzaDay = () => {
  const today = new Date();
  const year = today.getMonth() > 4 || (today.getMonth() === 4 && today.getDate() > 22)
    ? today.getFullYear() + 1
    : today.getFullYear();
  const next = new Date(year, 4, 22);
  const days = Math.ceil((next.getTime() - today.getTime()) / 86_400_000);
  return { date: next, days };
};

const pizzaArchive = [
  { year: 2010, value: '$41', context: { en: 'Laszlo Hanyecz paid 10,000 BTC for two pizzas.', tr: 'Laszlo Hanyecz iki pizza için 10.000 BTC ödedi.' } },
  { year: 2013, value: '$1.2M+', context: { en: 'Bitcoin reached its first four-digit cycle peak.', tr: 'Bitcoin ilk dörthaneli döngü zirvesine ulaştı.' } },
  { year: 2017, value: '$20M+', context: { en: 'Mainstream exchanges and retail demand entered the story.', tr: 'Ana akım borsalar ve perakende talebi hikayeye dahil oldu.' } },
  { year: 2020, value: '$90M+', context: { en: 'The third halving year reframed the purchase as monetary history.', tr: 'Üçüncü yarılanma yılı bu alımı parasal tarih olarak yeniden çerçeveledi.' } },
  { year: 2021, value: '$690M+', context: { en: 'The all-time high made the pizza transaction a global finance meme.', tr: 'Tüm zamanların en yüksek seviyesi pizza işlemini küresel bir finans memine dönüştürdü.' } },
  { year: 2024, value: '$630M+', context: { en: 'Spot ETFs and the fourth halving expanded institutional attention.', tr: 'Spot ETF\'ler ve dördüncü yarılanma kurumsal ilgiyi genişletti.' } },
  { year: 2026, value: 'Live value above', context: { en: 'The lesson is no longer just regret; it is how early monetary networks find prices.', tr: 'Ders artık yalnızca pişmanlık değil; erken aşamadaki parasal ağların fiyatları nasıl keşfettiğidir.' } },
];

export const PizzaDayTimeline = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const nextPizzaDay = getNextPizzaDay();

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {tr ? 'Bitcoin Pizza Hikayesi' : 'The Bitcoin Pizza Story'}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tr ? '$41\'dan milyarlara — tarihin en pahalı pizzası' : "From $41 to billions — the most expensive pizza in history"}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <CalendarClock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 id="next-bitcoin-pizza-day" className="font-semibold text-foreground">
                {tr ? 'Sonraki Bitcoin Pizza Günü' : 'Next Bitcoin Pizza Day'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tr
                  ? `22 Mayıs ${nextPizzaDay.date.getFullYear()}, Bitcoin'in ilk ünlü gerçek dünya alımını anmanın yıllık hatırlatıcısı.`
                  : `May 22, ${nextPizzaDay.date.getFullYear()} is the next annual reminder of Bitcoin's first famous real-world purchase.`}
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary tabular-nums">
            {Math.max(0, nextPizzaDay.days)} {tr ? 'gün' : 'days'}
          </div>
        </div>

        <div className="relative space-y-0">
          <div className="absolute left-[18px] top-3 bottom-3 w-px bg-border" />
          {PIZZA_TIMELINE_EVENTS.map((event) => (
            <div key={event.date} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="relative z-10 w-9 h-9 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-base flex-shrink-0">
                {event.emoji}
              </div>
              <div className="pt-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{event.date}</span>
                  <span className="text-sm font-semibold text-foreground">{event.title}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <section aria-labelledby="bitcoin-pizza-day-archive" className="space-y-3">
          <h3 id="bitcoin-pizza-day-archive" className="text-lg font-semibold text-foreground">
            {tr ? 'Bitcoin Pizza Günü Değer Arşivi' : 'Bitcoin Pizza Day Value Archive'}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border/40">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-medium">{tr ? 'Yıl' : 'Year'}</th>
                  <th className="text-left p-3 font-medium">{tr ? '10.000 BTC değeri' : '10,000 BTC value'}</th>
                  <th className="text-left p-3 font-medium">{tr ? 'Neden önemliydi' : 'Why it mattered'}</th>
                </tr>
              </thead>
              <tbody>
                {pizzaArchive.map((row) => (
                  <tr key={row.year} className="border-t border-border/30">
                    <td className="p-3 font-mono text-foreground">{row.year}</td>
                    <td className="p-3 font-semibold text-primary">{row.value}</td>
                    <td className="p-3 text-muted-foreground">{tr ? row.context.tr : row.context.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};
