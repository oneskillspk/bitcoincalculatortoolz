import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/contexts/LanguageContext";
import { EXCHANGES, FEE_PRESETS, FeePresetKey } from './bitcoinArbitrageData';

interface Props {
  exchangeA: string; setExchangeA: (v: string) => void;
  priceA: number; setPriceA: (v: number) => void;
  feeA: number; setFeeA: (v: number) => void;
  exchangeB: string; setExchangeB: (v: string) => void;
  priceB: number; setPriceB: (v: number) => void;
  feeB: number; setFeeB: (v: number) => void;
  tradeAmount: number; setTradeAmount: (v: number) => void;
  feePreset: FeePresetKey; setFeePreset: (v: FeePresetKey) => void;
  buyOrderType: 'maker' | 'taker'; setBuyOrderType: (v: 'maker' | 'taker') => void;
  sellOrderType: 'maker' | 'taker'; setSellOrderType: (v: 'maker' | 'taker') => void;
  withdrawalFeeUsd: number; setWithdrawalFeeUsd: (v: number) => void;
  settlementCostUsd: number; setSettlementCostUsd: (v: number) => void;
  slippagePct: number; setSlippagePct: (v: number) => void;
  advancedOpen: boolean; setAdvancedOpen: (v: boolean) => void;
  applyFeePreset: (key: FeePresetKey) => void;
}

export const BitcoinArbitrageInputPanel: React.FC<Props> = (p) => {
  const { t } = useLanguage();
  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{t('arb.input.title')}</h2>

        {/* Exchange A */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
          <h3 className="text-sm font-medium text-foreground">{t('arb.input.exchangeA')}</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.exchangeName')}</Label>
              <Select value={p.exchangeA} onValueChange={p.setExchangeA}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXCHANGES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.btcPrice')}</Label>
              <Input type="number" inputMode="decimal" value={p.priceA || ''} onChange={e => p.setPriceA(Number(e.target.value))} placeholder="84900" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.tradingFee')}</Label>
              <Input type="number" inputMode="decimal" value={p.feeA} onChange={e => p.setFeeA(Number(e.target.value))} step="0.01" />
            </div>
          </div>
        </div>

        {/* Exchange B */}
        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
          <h3 className="text-sm font-medium text-foreground">{t('arb.input.exchangeB')}</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.exchangeName')}</Label>
              <Select value={p.exchangeB} onValueChange={p.setExchangeB}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXCHANGES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.btcPrice')}</Label>
              <Input type="number" inputMode="decimal" value={p.priceB || ''} onChange={e => p.setPriceB(Number(e.target.value))} placeholder="85200" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.tradingFee')}</Label>
              <Input type="number" inputMode="decimal" value={p.feeB} onChange={e => p.setFeeB(Number(e.target.value))} step="0.01" />
            </div>
          </div>
        </div>

        {/* Trade Amount */}
        <div>
          <Label className="text-xs text-muted-foreground">{t('arb.input.tradeAmount')}</Label>
          <Input type="number" inputMode="decimal" value={p.tradeAmount || ''} onChange={e => p.setTradeAmount(Number(e.target.value))} placeholder="1000" />
        </div>

        <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-foreground">{t('arb.input.presets')}</h3>
            <span className="text-xs text-muted-foreground">{t('arb.input.editable')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.entries(FEE_PRESETS) as [FeePresetKey, typeof FEE_PRESETS[FeePresetKey]][]).map(([key, preset]) => (
              <Button key={key} type="button" variant={p.feePreset === key ? 'default' : 'outline'} onClick={() => p.applyFeePreset(key)} className="h-auto min-h-14 flex-col items-start gap-1 p-3 text-left">
                <span className="text-sm font-semibold">{preset.label}</span>
                <span className="text-xs opacity-80">Taker {preset.taker}% · Slip {preset.slippage}%</span>
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.buyOrder')}</Label>
              <Select value={p.buyOrderType} onValueChange={(value) => {
                const orderType = value as 'maker' | 'taker';
                p.setBuyOrderType(orderType);
                p.setFeeA(orderType === 'maker' ? FEE_PRESETS[p.feePreset].maker : FEE_PRESETS[p.feePreset].taker);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maker">{t('arb.input.maker')}</SelectItem>
                  <SelectItem value="taker">{t('arb.input.taker')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{t('arb.input.sellOrder')}</Label>
              <Select value={p.sellOrderType} onValueChange={(value) => {
                const orderType = value as 'maker' | 'taker';
                p.setSellOrderType(orderType);
                p.setFeeB(orderType === 'maker' ? FEE_PRESETS[p.feePreset].maker : FEE_PRESETS[p.feePreset].taker);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="maker">{t('arb.input.maker')}</SelectItem>
                  <SelectItem value="taker">{t('arb.input.taker')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Collapsible open={p.advancedOpen} onOpenChange={p.setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between">{t('arb.input.advanced')} <span>{p.advancedOpen ? '−' : '+'}</span></Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">{t('arb.input.withdrawalFee')}</Label>
                  <Input type="number" inputMode="decimal" value={p.withdrawalFeeUsd} onChange={e => p.setWithdrawalFeeUsd(Number(e.target.value))} step="1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('arb.input.fiatCost')}</Label>
                  <Input type="number" inputMode="decimal" value={p.settlementCostUsd} onChange={e => p.setSettlementCostUsd(Number(e.target.value))} step="1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">{t('arb.input.slippage')}</Label>
                  <Input type="number" inputMode="decimal" value={p.slippagePct} onChange={e => p.setSlippagePct(Number(e.target.value))} step="0.01" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
};
