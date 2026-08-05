import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  id?: string;
  className?: string;
}

const SectionHeader = ({ eyebrow, title, lead, id, className = "" }: SectionHeaderProps) => (
  <header className={`text-center mb-10 md:mb-12 ${className}`}>
    {eyebrow && (
      <span className="inline-flex items-center px-3 py-1 rounded-full border border-border/60 bg-muted/40 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-5">
        {eyebrow}
      </span>
    )}
    <h2
      id={id}
      className="text-h2 font-semibold text-foreground max-w-3xl mx-auto [text-wrap:balance] break-words"
    >
      {title}
    </h2>
    {lead && (
      <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
        {lead}
      </p>
    )}
  </header>
);

export const VolatilityRiskAdvisor = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 px-4 sm:px-6 border-t border-border/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title={t('volatility.seo.title') || "Bitcoin Volatility & Risk-Adjusted Returns"}
          lead={t('volatility.seo.subtitle') || "Institutional-grade analysis of Bitcoin's risk profile compared to traditional assets."}
          eyebrow={t('volatility.seo.badge') || "Risk Analysis"}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('volatility.seo.sharpe.title') || "Sharpe Ratio Analysis"}</h3>
            <p className="text-sm text-muted-foreground">{t('volatility.seo.sharpe.desc') || "Evaluating Bitcoin's performance relative to its risk. Despite higher volatility, BTC often exhibits a superior Sharpe Ratio over 4+ year horizons."}</p>
          </div>
          
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-6">
            <ShieldAlert className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('volatility.seo.drawdown.title') || "Downside Deviation"}</h3>
            <p className="text-sm text-muted-foreground">{t('volatility.seo.drawdown.desc') || "Understanding the 'Sortino Ratio' — focus on negative volatility rather than total price movement for better risk management."}</p>
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-2xl p-6">
            <BarChart3 className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('volatility.seo.regime.title') || "Volatility Regimes"}</h3>
            <p className="text-sm text-muted-foreground">{t('volatility.seo.regime.desc') || "Historical data showing how Bitcoin transitions from low-volatility accumulation phases to high-volatility price discovery."}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CorrelationRegimeMatrix = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 bg-muted/20 px-4 sm:px-6 border-y border-border/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title={t('correlation.seo.title') || "Asset Correlation & Macro Decoupling"}
          lead={t('correlation.seo.subtitle') || "Track how Bitcoin moves in relation to the Nasdaq, Gold, and the US Dollar (DXY)."}
          eyebrow={t('correlation.seo.badge') || "Macro Correlation"}
        />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border border-border/40 rounded-xl overflow-hidden">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 font-semibold">{t('correlation.table.asset') || "Asset Group"}</th>
                <th className="p-4 font-semibold text-center">{t('correlation.table.bull') || "Bull Market Correlation"}</th>
                <th className="p-4 font-semibold text-center">{t('correlation.table.bear') || "Bear Market Correlation"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="p-4 font-medium">Nasdaq 100 / Tech</td>
                <td className="p-4 text-center">High (0.7 - 0.9)</td>
                <td className="p-4 text-center">Extreme (0.9+)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Gold (Store of Value)</td>
                <td className="p-4 text-center">Low (0.1 - 0.3)</td>
                <td className="p-4 text-center">Moderate (0.4 - 0.5)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium">US Dollar (DXY)</td>
                <td className="p-4 text-center">Inverse (-0.6)</td>
                <td className="p-4 text-center">High Inverse (-0.8)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export const ScarcityLifecycleExplorer = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 px-4 sm:px-6 border-t border-border/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title={t('supply.seo.title') || "The 21 Million Hard Cap & Scarcity Lifecycle"}
          lead={t('supply.seo.subtitle') || "Deep dive into Bitcoin's issuance schedule, lost coins, and illiquid supply metrics."}
          eyebrow={t('supply.seo.badge') || "Supply Metrics"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('supply.seo.lost.title') || "Estimated Lost Coins"}</h3>
            <p className="text-muted-foreground leading-relaxed">
              It is estimated that roughly 3.7 to 4 million BTC are lost forever due to forgotten keys, death, or Satoshi's untouched stash. This effectively reduces the circulating supply to approximately 17 million BTC.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('supply.seo.illiquid.title') || "Illiquid Supply Growth"}</h3>
            <p className="text-muted-foreground leading-relaxed">
              Illiquid supply tracks Bitcoin held by entities that rarely sell. Historically, price appreciation correlates strongly with the movement of supply from exchanges to long-term 'cold' storage.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const EtfArbitrageFlows = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 bg-muted/20 px-4 sm:px-6 border-y border-border/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title={t('etf.seo.title') || "Institutional ETF Flows & Price Impact"}
          lead={t('etf.seo.subtitle') || "Analyzing the structural shift in Bitcoin demand driven by Wall Street spot ETFs."}
          eyebrow={t('etf.seo.badge') || "Institutional Analysis"}
        />
        <div className="bg-background border border-border/60 rounded-3xl p-8 mt-10">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground italic mb-6">
              "The introduction of Spot Bitcoin ETFs represents the largest institutional bridge in financial history, allowing $100T+ of capital to access BTC via standard brokerage accounts."
            </p>
            <h4 className="text-foreground font-bold text-base mt-4">ETF NAV Premiums & Discounts</h4>
            <p>
              Unlike the legacy GBTC trust, spot ETFs use a creation/redemption mechanism that keeps the share price pegged closely to the underlying Bitcoin Net Asset Value (NAV). Monitoring these flows provides insight into institutional sentiment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SatoshiStandardGuide = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 px-4 sm:px-6 border-t border-border/10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title={t('converter.seo.title') || "The Satoshi Standard (sats)"}
          lead={t('converter.seo.subtitle') || "Why denominating in Satoshis is the future of micro-payments and global accounting."}
          eyebrow={t('converter.seo.badge') || "Education"}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "1 Bitcoin", value: "100,000,000 sats" },
            { label: "0.1 Bitcoin", value: "10,000,000 sats" },
            { label: "0.01 Bitcoin", value: "1,000,000 sats" },
            { label: "0.001 Bitcoin", value: "100,000 sats" }
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-border/40 rounded-xl text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</div>
              <div className="font-mono font-bold text-primary">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
