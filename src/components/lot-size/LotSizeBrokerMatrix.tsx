import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Sortable 2026 broker matrix — high-intent long-tail SEO grab
 * ("bitcoin lot size binance", "btc contract size bybit", …).
 * Values verified July 2026 against public exchange docs.
 */
interface BrokerRow {
  broker: string;
  type: 'MT5' | 'Linear' | 'Inverse';
  contract: string;
  minLot: string;
  maxLev: string;
  maintMargin: string;
  takerFee: string;
}

const rows: BrokerRow[] = [
  { broker: 'Exness',         type: 'MT5',     contract: '1 BTC',     minLot: '0.01',   maxLev: '1:400', maintMargin: '1.0%', takerFee: '0.08%' },
  { broker: 'IC Markets',     type: 'MT5',     contract: '1 BTC',     minLot: '0.01',   maxLev: '1:200', maintMargin: '1.0%', takerFee: '0.07%' },
  { broker: 'Binance Futures',type: 'Linear',  contract: '1 BTC',     minLot: '0.001',  maxLev: '1:125', maintMargin: '0.4%', takerFee: '0.04%' },
  { broker: 'Bybit USDT-M',   type: 'Linear',  contract: '1 BTC',     minLot: '0.001',  maxLev: '1:100', maintMargin: '0.5%', takerFee: '0.055%' },
  { broker: 'OKX Perpetual',  type: 'Linear',  contract: '0.01 BTC',  minLot: '1 ct.',  maxLev: '1:125', maintMargin: '0.5%', takerFee: '0.05%' },
  { broker: 'Kraken Futures', type: 'Linear',  contract: '1 BTC',     minLot: '0.0001', maxLev: '1:50',  maintMargin: '1.0%', takerFee: '0.05%' },
  { broker: 'Deribit',        type: 'Inverse', contract: '$10 USD',   minLot: '1 ct.',  maxLev: '1:100', maintMargin: '0.575%', takerFee: '0.05%' },
  { broker: 'BitMEX XBTUSD',  type: 'Inverse', contract: '$1 USD',    minLot: '1 ct.',  maxLev: '1:100', maintMargin: '0.5%', takerFee: '0.075%' },
  { broker: 'Delta Exchange', type: 'Linear',  contract: '0.001 BTC', minLot: '1 ct.',  maxLev: '1:100', maintMargin: '0.5%', takerFee: '0.05%' },
];

export const LotSizeBrokerMatrix = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: tr ? '2026 Bitcoin Vadeli İşlemler Broker Karşılaştırması' : '2026 Bitcoin Futures Broker Comparison',
    itemListElement: rows.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.broker,
      description: `${r.type} · contract ${r.contract} · min ${r.minLot} · max ${r.maxLev} · maintenance ${r.maintMargin} · taker ${r.takerFee}`,
    })),
  };

  return (
    <section className="container mx-auto px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(itemList)}</script>
        </Helmet>
        <h2 className="text-h2 font-bold text-foreground mb-3">
          {tr ? '2026 Bitcoin Broker Lot & Marj Karşılaştırması' : '2026 Bitcoin Broker Lot & Margin Comparison'}
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
          {tr
            ? 'Popüler Bitcoin vadeli işlem aracılarında kontrat büyüklüğü, minimum lot, maksimum kaldıraç, bakım marjı ve alıcı komisyonu — 15 Temmuz 2026 itibarıyla kamu belgelerinden doğrulandı.'
            : 'Contract size, minimum lot, max leverage, maintenance margin and taker fee across popular Bitcoin futures brokers — verified July 15, 2026 from public docs.'}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border/40 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="p-3 font-semibold">{tr ? 'Aracı' : 'Broker'}</th>
                <th className="p-3 font-semibold">{tr ? 'Tip' : 'Type'}</th>
                <th className="p-3 font-semibold">{tr ? 'Kontrat' : 'Contract'}</th>
                <th className="p-3 font-semibold">{tr ? 'Min Lot' : 'Min Lot'}</th>
                <th className="p-3 font-semibold">{tr ? 'Maks Kaldıraç' : 'Max Leverage'}</th>
                <th className="p-3 font-semibold">{tr ? 'Bakım Marjı' : 'Maint. Margin'}</th>
                <th className="p-3 font-semibold">{tr ? 'Taker Komisyonu' : 'Taker Fee'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.broker} className="border-t border-border/30 hover:bg-muted/20">
                  <td className="p-3 font-medium text-foreground">{r.broker}</td>
                  <td className="p-3 text-muted-foreground">{r.type}</td>
                  <td className="p-3 text-muted-foreground">{r.contract}</td>
                  <td className="p-3 text-muted-foreground">{r.minLot}</td>
                  <td className="p-3 text-muted-foreground">{r.maxLev}</td>
                  <td className="p-3 text-muted-foreground">{r.maintMargin}</td>
                  <td className="p-3 text-muted-foreground">{r.takerFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-3">
          {tr
            ? 'Değerler yalnızca bilgilendirme amaçlıdır. Canlı marj ve komisyon planları için her aracının kendi belgelerini kontrol edin.'
            : 'Values indicative only. Check each broker\'s own docs for live margin & fee schedules.'}
        </p>
      </div>
    </section>
  );
};
