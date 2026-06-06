import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import { TaxTransaction, TaxConfiguration } from '@/services/enhancedTaxCalculator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface TestDataButtonProps {
  onLoadTestData: (transactions: TaxTransaction[], config: TaxConfiguration) => void;
}

export const TestDataButton: React.FC<TestDataButtonProps> = ({ onLoadTestData }) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const loadSampleData = () => {
    const sampleTransactions: TaxTransaction[] = [
      {
        id: 'buy-1',
        date: '2024-01-15',
        type: 'buy',
        amount: 0.5,
        price: 42000,
        fiatAmount: 21000,
        currency: 'USD',
        fees: 50,
        description: 'Initial purchase',
        exchange: 'Coinbase'
      },
      {
        id: 'buy-2',
        date: '2024-03-20',
        type: 'buy',
        amount: 0.3,
        price: 65000,
        fiatAmount: 19500,
        currency: 'USD',
        fees: 30,
        description: 'Dollar cost average',
        exchange: 'Kraken'
      },
      {
        id: 'sell-1',
        date: '2024-06-10',
        type: 'sell',
        amount: 0.2,
        price: 70000,
        fiatAmount: 14000,
        currency: 'USD',
        fees: 25,
        description: 'Partial sale (short-term)',
        exchange: 'Coinbase'
      },
      {
        id: 'trade-1',
        date: '2024-09-15',
        type: 'trade',
        amount: 0.1,
        price: 60000,
        fiatAmount: 6000,
        currency: 'USD',
        fees: 15,
        description: 'Trade to stablecoin',
        exchange: 'Binance'
      },
      {
        id: 'sell-2',
        date: '2024-11-20',
        type: 'sell',
        amount: 0.25,
        price: 75000,
        fiatAmount: 18750,
        currency: 'USD',
        fees: 35,
        description: 'Long-term sale',
        exchange: 'Coinbase'
      },
      {
        id: 'sell-loss',
        date: '2024-07-01',
        type: 'sell',
        amount: 0.15,
        price: 50000,
        fiatAmount: 7500,
        currency: 'USD',
        fees: 20,
        description: 'Loss sale',
        exchange: 'Kraken'
      },
      {
        id: 'repurchase',
        date: '2024-07-15',
        type: 'buy',
        amount: 0.15,
        price: 52000,
        fiatAmount: 7800,
        currency: 'USD',
        fees: 25,
        description: 'Repurchase within 30 days (wash sale)',
        exchange: 'Kraken'
      }
    ];

    const sampleConfig: TaxConfiguration = {
      jurisdiction: 'US',
      state: 'CA',
      filingStatus: 'single',
      annualIncome: 85000,
      taxYear: 2024,
      costBasisMethod: 'FIFO'
    };

    onLoadTestData(sampleTransactions, sampleConfig);

    toast({
      title: tr ? 'Örnek Veriler Yüklendi' : 'Sample Data Loaded',
      description: tr
        ? "Wash sale senaryoları dahil örnek işlemler yüklendi. Sonuçları görmek için 'Vergi Yükümlülüğünü Hesapla' butonuna tıklayın."
        : "Loaded sample transactions including wash sale scenarios for testing. Click 'Calculate Taxes' to see results.",
    });
  };

  return (
    <Button
      onClick={loadSampleData}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <TestTube className="w-4 h-4" />
      {tr ? 'Örnek Veri Yükle' : 'Load Sample Data'}
    </Button>
  );
};
