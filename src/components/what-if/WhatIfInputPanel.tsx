import { ModernInputPanel } from "@/components/modern/ModernInputPanel";

interface Props {
  onCalculate: (params: {
    amount: number;
    startDate: Date;
    currency: string;
    showInBtc: boolean;
    inputMode: 'fiat' | 'btc';
  }) => void;
  loading: boolean;
  initialValues?: {
    amount: number;
    startDate: Date;
    currency: string;
    inputMode: 'fiat' | 'btc';
    showInBtc: boolean;
  };
  autoSubmit?: boolean;
}

export const WhatIfInputPanel = ({ onCalculate, loading, initialValues, autoSubmit }: Props) => (
  <div>
    <ModernInputPanel
      onCalculate={onCalculate}
      loading={loading}
      initialValues={initialValues}
      autoSubmit={autoSubmit}
    />
  </div>
);
