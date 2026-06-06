import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";

export const RetirementComparisonTable = () => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const yr = tr?'yıl':'yr';
  const c = tr?'₺':'$'; // currency-audit-allow
  const rows = [
    { btc: "0.5 BTC", p100: `${c}2,000/${yr}`, p250: `${c}5,000/${yr}`, p500: `${c}10,000/${yr}`, p1m: `${c}20,000/${yr}` },
    { btc: "1 BTC", p100: `${c}4,000/${yr}`, p250: `${c}10,000/${yr}`, p500: `${c}20,000/${yr}`, p1m: `${c}40,000/${yr}` },
    { btc: "2 BTC", p100: `${c}8,000/${yr}`, p250: `${c}20,000/${yr}`, p500: `${c}40,000/${yr}`, p1m: `${c}80,000/${yr}` },
    { btc: "5 BTC", p100: `${c}20,000/${yr}`, p250: `${c}50,000/${yr}`, p500: `${c}100,000/${yr}`, p1m: `${c}200,000/${yr}` },
    { btc: "10 BTC", p100: `${c}40,000/${yr}`, p250: `${c}100,000/${yr}`, p500: `${c}200,000/${yr}`, p1m: `${c}400,000/${yr}` },
  ];
  return <section className="bg-muted/30 py-16 md:py-20"><div className="container mx-auto px-6"><div className="max-w-4xl mx-auto"><h2 className="text-h2 font-bold text-foreground mb-2 text-center">{tr?'Bitcoin Varlığına ve Fiyata Göre Emeklilik Geliri':'Bitcoin Retirement Income by Holdings & Price'}</h2><p className="text-muted-foreground text-center mb-8 text-sm">{tr?'Farklı BTC varlıkları ve gelecekteki Bitcoin fiyat seviyelerine göre %4 çekim kuralı kullanılarak tahmini yıllık emeklilik geliri.':'Estimated annual retirement income using the 4% withdrawal rule, based on different BTC holdings and future Bitcoin price levels.'}</p><ScrollableTable className="rounded-xl border border-border/40 bg-background/80" ariaLabel={tr?'Bitcoin emeklilik gelir karşılaştırma tablosu':'Bitcoin retirement income comparison table'}><Table className="min-w-[560px]"><TableHeader><TableRow className="border-border/50"><TableHead className="font-semibold text-xs">{tr?'BTC Varlığı':'BTC Holdings'}</TableHead><TableHead className="font-semibold text-xs text-right">BTC @ {c}100K</TableHead><TableHead className="font-semibold text-xs text-right">BTC @ {c}250K</TableHead><TableHead className="font-semibold text-xs text-right">BTC @ {c}500K</TableHead><TableHead className="font-semibold text-xs text-right">BTC @ {c}1M</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => (<TableRow key={row.btc} className="border-border/30"><TableCell className="font-medium text-sm">{row.btc}</TableCell><TableCell className="text-right text-sm font-mono">{row.p100}</TableCell><TableCell className="text-right text-sm font-mono">{row.p250}</TableCell><TableCell className="text-right text-sm font-mono text-primary">{row.p500}</TableCell><TableCell className="text-right text-sm font-mono text-primary">{row.p1m}</TableCell></TableRow>))}</TableBody></Table></ScrollableTable><p className="text-xs text-muted-foreground mt-3 text-center">{tr?'%4 güvenli çekim kuralına dayanır (yıllık çekim = portföy değerinin %4’ü). Gerçek gelir piyasa koşullarına, vergilere ve harcama ihtiyaçlarına bağlıdır.':'Based on the 4% safe withdrawal rule (annual withdrawal = 4% × portfolio value). Actual retirement income depends on market conditions, taxes, and spending needs.'}</p></div></div></section>;
};