import React, { useState, useEffect } from 'react';
import { InputPanel, CalculateButton } from '@/components/calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Upload, Calculator, Settings, DollarSign } from 'lucide-react';
import { TooltipInfo } from '@/components/ui/tooltip-info';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaxTransaction, TaxConfiguration, EnhancedTaxCalculatorService, EnhancedTaxCalculation } from '@/services/enhancedTaxCalculator';
import { useToast } from '@/hooks/use-toast';
import { TestDataButton } from './TestDataButton';
import { useLanguage } from '@/contexts/LanguageContext';
interface EnhancedTaxInputPanelProps {
  transactions: TaxTransaction[];
  config: TaxConfiguration;
  onTransactionsUpdate: (transactions: TaxTransaction[]) => void;
  onConfigChange: (config: TaxConfiguration) => void;
  onCalculate: (results: EnhancedTaxCalculation) => void;
  loading?: boolean;
}

export const EnhancedTaxInputPanel = ({
  transactions,
  config,
  onTransactionsUpdate,
  onConfigChange,
  onCalculate,
  loading = false
}: EnhancedTaxInputPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [newTransaction, setNewTransaction] = useState<Partial<TaxTransaction>>({
    type: 'buy',
    currency: 'USD'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const currentYear = new Date().getFullYear();
  const taxYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const availableStates = EnhancedTaxCalculatorService.getAvailableStates();

  const { toast } = useToast();

  useEffect(() => {
    setSelectedDate((prev) => {
      if (!prev) return new Date(config.taxYear, 0, 1);
      const d = new Date(prev);
      d.setFullYear(config.taxYear);
      return d;
    });
  }, [config.taxYear]);

  const taxableCount = transactions.filter(t => {
    const y = new Date(t.date).getFullYear();
    return y === config.taxYear && ['sell','trade','mining','staking'].includes(t.type);
  }).length;

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.price || !selectedDate) {
      return;
    }

    const transaction: TaxTransaction = {
      id: crypto.randomUUID(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      type: newTransaction.type as TaxTransaction['type'],
      amount: Number(newTransaction.amount),
      price: Number(newTransaction.price),
      fiatAmount: Number(newTransaction.amount) * Number(newTransaction.price),
      currency: newTransaction.currency || 'USD',
      fees: newTransaction.fees ? Number(newTransaction.fees) : 0,
      description: newTransaction.description || '',
      exchange: newTransaction.exchange || ''
    };

    if (new Date(transaction.date).getFullYear() !== config.taxYear) {
      toast({
        title: tr
          ? `İşlem ${config.taxYear} yılında değil`
          : `Transaction not in ${config.taxYear}`,
        description: tr
          ? `${format(new Date(transaction.date), 'dd MMM yyyy')} tarihli bu ${transaction.type} işlemi ${config.taxYear} hesaplamalarına dahil edilmeyecektir.`
          : `This ${transaction.type} dated ${format(new Date(transaction.date), 'MMM dd, yyyy')} will not be included in ${config.taxYear} calculations.`,
      });
    }

    onTransactionsUpdate([...transactions, transaction]);
    setNewTransaction({ type: 'buy', currency: 'USD' });
    setSelectedDate(new Date(config.taxYear, 0, 1));
  };

  const loadTestData = (transactions: TaxTransaction[], config: TaxConfiguration) => {
    onTransactionsUpdate(transactions);
    onConfigChange(config);
  };

  const calculateTaxes = () => {
    if (transactions.length === 0) return;

    if (taxableCount === 0) {
      toast({
        title: tr
          ? `${config.taxYear} yılında vergilendirilebilir olay yok`
          : `No taxable events in ${config.taxYear}`,
        description: tr
          ? 'Seçilen vergi yılına en az bir Satış/Takas veya Madencilik/Staking işlemi ekleyin ya da Vergi Yılını işlemlerinizle eşleşecek şekilde değiştirin.'
          : 'Add at least one Sell/Trade or Mining/Staking in the selected tax year, or change the Tax Year to match your transactions.',
      });
    }

    const results = EnhancedTaxCalculatorService.calculateTaxes(transactions, config);
    onCalculate(results);
  };

  const updateConfig = (updates: Partial<TaxConfiguration>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Tax Configuration */}
      <InputPanel
        className="glass-morphism-card border-border/20"
        title={
          <span className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            {tr ? 'Vergi Yapılandırması' : 'Tax Configuration'}
          </span>
        }
        action={<TestDataButton onLoadTestData={loadTestData} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filingStatus">{tr ? 'Beyan Durumu' : 'Filing Status'}</Label>
              <Select value={config.filingStatus} onValueChange={(value) => updateConfig({ filingStatus: value as TaxConfiguration['filingStatus'] })}>
                <SelectTrigger>
                  <SelectValue placeholder={tr ? 'Beyan durumu seçin' : 'Select filing status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">{tr ? 'Bekar' : 'Single'}</SelectItem>
                  <SelectItem value="married-filing-jointly">{tr ? 'Evli — Birlikte Beyan' : 'Married Filing Jointly'}</SelectItem>
                  <SelectItem value="married-filing-separately">{tr ? 'Evli — Ayrı Beyan' : 'Married Filing Separately'}</SelectItem>
                  <SelectItem value="head-of-household">{tr ? 'Hane Reisi' : 'Head of Household'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxYear">{tr ? 'Vergi Yılı' : 'Tax Year'}</Label>
              <Select value={config.taxYear.toString()} onValueChange={(year) => updateConfig({ taxYear: Number(year) })}>
                <SelectTrigger>
                  <SelectValue placeholder={tr ? 'Vergi yılı seçin' : 'Select tax year'} />
                </SelectTrigger>
                <SelectContent>
                  {taxYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annualIncome">{tr ? 'Yıllık Vergilendirilebilir Gelir' : 'Annual Taxable Income'}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="annualIncome"
                  type="number"
                  placeholder="75,000"
                  className="pl-10"
                  value={config.annualIncome || ''}
                  onChange={(e) => updateConfig({ annualIncome: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">{tr ? 'Eyalet (İsteğe Bağlı)' : 'State (Optional)'}</Label>
              <Select value={config.state || 'none'} onValueChange={(state) => updateConfig({ state: state === 'none' ? undefined : state })}>
                <SelectTrigger>
                  <SelectValue placeholder={tr ? 'Eyalet seçin' : 'Select state'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{tr ? 'Eyalet Vergisi Yok' : 'No State Tax'}</SelectItem>
                  {availableStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name} ({state.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="costBasisMethod">{tr ? 'Maliyet Esası Yöntemi' : 'Cost Basis Method'}</Label>
              <TooltipInfo content={tr
                ? 'Maliyet esası yöntemi, hangi Bitcoin lotlarının önce satıldığını belirler ve vergilendirilebilir kazanç veya kaybınızı etkiler.'
                : 'The cost basis method determines which Bitcoin lots are sold first, affecting your taxable gain or loss.'} />
            </div>
            <Select value={config.costBasisMethod} onValueChange={(method) => updateConfig({ costBasisMethod: method as TaxConfiguration['costBasisMethod'] })}>
              <SelectTrigger>
                <SelectValue placeholder={tr ? 'Yöntem seçin' : 'Select cost basis method'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIFO">
                  <div className="flex flex-col">
                    <span>FIFO ({tr ? 'İlk Giren İlk Çıkar' : 'First In, First Out'})</span>
                    <span className="text-xs text-muted-foreground">
                      {tr ? 'En eski coinleri önce satar — genellikle daha fazla uzun vadeli kazanç (düşük oran)' : 'Sells oldest coins first — may yield more long-term gains (lower rate)'}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="LIFO">
                  <div className="flex flex-col">
                    <span>LIFO ({tr ? 'Son Giren İlk Çıkar' : 'Last In, First Out'})</span>
                    <span className="text-xs text-muted-foreground">
                      {tr ? 'En yeni coinleri önce satar — genellikle kısa vadeli kazanç (yüksek oran)' : 'Sells newest coins first — often produces short-term gains (higher rate)'}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="SPECIFIC_ID">
                  <div className="flex flex-col">
                    <span>HIFO ({tr ? 'En Yüksek Maliyetli İlk Çıkar' : 'Highest In, First Out'})</span>
                    <span className="text-xs text-muted-foreground">
                      {tr ? 'En yüksek maliyetli coinleri önce satar — vergilendirilebilir kazançları minimize eder' : 'Sells highest-cost coins first — minimizes taxable gains'}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="AVERAGE_COST">
                  <div className="flex flex-col">
                    <span>{tr ? 'Ortalama Maliyet' : 'Average Cost'}</span>
                    <span className="text-xs text-muted-foreground">
                      {tr ? 'Ortalama alış fiyatını kullanır — en basit ama her zaman optimal değil' : 'Uses average purchase price — simplest but not always optimal'}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </InputPanel>

      {/* Transaction Input */}
      <InputPanel
        className="glass-morphism-card border-border/20"
        onSubmit={(e) => { e.preventDefault(); if (transactions.length > 0 && !loading) calculateTaxes(); }}
        title={
          <span className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-success" />
            {tr ? 'İşlem Ekle' : 'Add Transaction'}
          </span>
        }
        footer={
          <CalculateButton fullWidth loading={loading} disabled={transactions.length === 0} loadingLabel={tr ? 'Hesaplanıyor...' : 'Calculating...'}>
            <Calculator className="w-5 h-5 mr-2" />
            <span className="truncate">
              {tr ? `Vergi Yükümlülüğünü Hesapla (${transactions.length})` : `Calculate Tax Liability (${transactions.length})`}
            </span>
          </CalculateButton>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{tr ? 'İşlem Türü' : 'Transaction Type'}</Label>
              <Select
                value={newTransaction.type}
                onValueChange={(type) => setNewTransaction(prev => ({ ...prev, type: type as TaxTransaction['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={tr ? 'Tür seçin' : 'Select type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">{tr ? 'Alış' : 'Buy'}</SelectItem>
                  <SelectItem value="sell">{tr ? 'Satış' : 'Sell'}</SelectItem>
                  <SelectItem value="trade">{tr ? 'Takas' : 'Trade'}</SelectItem>
                  <SelectItem value="mining">{tr ? 'Madencilik' : 'Mining'}</SelectItem>
                  <SelectItem value="staking">{tr ? 'Staking' : 'Staking'}</SelectItem>
                  <SelectItem value="gift">{tr ? 'Hediye' : 'Gift'}</SelectItem>
                  <SelectItem value="fork">{tr ? 'Fork' : 'Fork'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{tr ? 'Tarih' : 'Date'}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>{tr ? 'Tarih seçin' : 'Pick a date'}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && selectedDate.getFullYear() !== config.taxYear && (
                <p className="text-xs text-destructive mt-1">
                  {tr
                    ? `Not: Bu tarih seçili vergi yılı ${config.taxYear} içinde değil, hesaplamaya dahil edilmeyecek.`
                    : `Note: This date is not in the selected tax year ${config.taxYear} and will not be included in the calculation.`}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{tr ? 'Bitcoin Miktarı' : 'Bitcoin Amount'}</Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                placeholder="0.00000000"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{tr ? 'BTC Başına Fiyat' : 'Price per BTC'}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.price || ''}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fees">{tr ? 'Ücretler (İsteğe Bağlı)' : 'Fees (Optional)'}</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTransaction.fees || ''}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, fees: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exchange">{tr ? 'Borsa (İsteğe Bağlı)' : 'Exchange (Optional)'}</Label>
              <Input
                id="exchange"
                placeholder="Coinbase, Kraken, vb."
                value={newTransaction.exchange || ''}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, exchange: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{tr ? 'Açıklama (İsteğe Bağlı)' : 'Description (Optional)'}</Label>
              <Input
                id="description"
                placeholder={tr ? 'İşlem açıklaması' : 'Transaction description'}
                value={newTransaction.description || ''}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={addTransaction} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              {tr ? 'İşlem Ekle' : 'Add Transaction'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Upload className="w-4 h-4" />
              <span className="sm:inline">{tr ? 'CSV İçe Aktar' : 'Import CSV'}</span>
            </Button>
          </div>
        </div>
      </InputPanel>
    </div>
  );
};
