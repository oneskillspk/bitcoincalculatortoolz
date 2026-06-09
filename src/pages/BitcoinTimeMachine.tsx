import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { CompactLiveBitcoinPrice } from "@/components/CompactLiveBitcoinPrice";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import RelatedCalculators from "@/components/RelatedCalculators";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeMachinePresets } from "@/components/timemachine/TimeMachinePresets";
import { TimeMachineResultCard } from "@/components/timemachine/TimeMachineResultCard";
import { TimeMachineScrubber } from "@/components/timemachine/TimeMachineScrubber";
import { TimeMachineShareSnapshot } from "@/components/timemachine/TimeMachineShareSnapshot";
import { TimeMachineHistoricalContent } from "@/components/timemachine/TimeMachineHistoricalContent";
import { TimeMachineHowToUse } from "@/components/timemachine/TimeMachineHowToUse";
import { TimeMachineFAQSection } from "@/components/timemachine/TimeMachineFAQSection";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalPrice, fetchCurrentPrice, calculateTimeMachine, type PresetDate } from "@/services/timeMachineService";
import { useLiveBitcoinPrice } from "@/hooks/useLiveBitcoinPrice";
import { format } from "date-fns";
import { CalendarIcon, Clock, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocalizedSchema } from "@/hooks/useLocalizedSchema";

const BitcoinTimeMachine = () => {
  const { language, t } = useLanguage();

  const trUrl = "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zaman-makinesi";
  const enUrl = "https://bitcoincalculator.tools/calculators/time-machine";

  const webAppSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "WebApplication", "inLanguage": "en",
      "name": "Bitcoin Time Machine Calculator",
      "description": "Travel back to any date since 2010. Enter an amount and see what your Bitcoin is worth today. Famous dates included: pizza day, ATH, crash lows and more.",
      "url": enUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", "inLanguage": "tr",
      "name": "Bitcoin Zaman Makinesi Hesaplayıcısı",
      "description": "2010'dan bu yana herhangi bir tarihe geri dönün. Bir miktar girin ve Bitcoin'inizin bugünkü değerini görün. Pizza günü, ATH, çöküş dipleri gibi ünlü tarihler dahil.",
      "url": trUrl, "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
      "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools" },
      "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
    },
  );

  const howToSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "en",
      "name": "How to Use the Bitcoin Time Machine",
      "description": "Step-by-step guide to calculating historical Bitcoin investment returns",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Pick a Date", "text": "Select a historical date or click a famous preset like Pizza Day", "url": `${enUrl}#step1` },
        { "@type": "HowToStep", "name": "Enter Investment", "text": "Type how much you would have invested (default $100)", "url": `${enUrl}#step2` },
        { "@type": "HowToStep", "name": "View Results", "text": "See BTC purchased, current value, ROI, and profit instantly", "url": `${enUrl}#step3` },
        { "@type": "HowToStep", "name": "Compare Dates", "text": "Try different dates to see how timing affects returns", "url": `${enUrl}#step4` },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "HowTo", "inLanguage": "tr",
      "name": "Bitcoin Zaman Makinesi Nasıl Kullanılır",
      "description": "Geçmiş Bitcoin yatırım getirilerini hesaplamak için adım adım rehber",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Tarih Seçin", "text": "Geçmişten bir tarih seçin veya Pizza Günü gibi ünlü bir ön ayara tıklayın", "url": `${trUrl}#step1` },
        { "@type": "HowToStep", "name": "Yatırımı Girin", "text": "Ne kadar yatırım yapmış olacağınızı yazın (varsayılan 100 $)", "url": `${trUrl}#step2` },
        { "@type": "HowToStep", "name": "Sonuçları Görün", "text": "Satın alınan BTC, güncel değer, ROI ve kârı anında görün", "url": `${trUrl}#step3` },
        { "@type": "HowToStep", "name": "Tarihleri Karşılaştırın", "text": "Zamanlamanın getiriyi nasıl etkilediğini görmek için farklı tarihler deneyin", "url": `${trUrl}#step4` },
      ],
    },
  );

  const faqSchema = useLocalizedSchema(
    {
      "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "en",
      "mainEntity": [
        { "@type": "Question", "name": "How far back can I go?", "acceptedAnswer": { "@type": "Answer", "text": "You can look up any date since Bitcoin's first exchange trade in July 2010." } },
        { "@type": "Question", "name": "Where does the price data come from?", "acceptedAnswer": { "@type": "Answer", "text": "Historical prices come from CoinGecko's coin history API, current prices from their real-time endpoint." } },
        { "@type": "Question", "name": "Does this account for fees and taxes?", "acceptedAnswer": { "@type": "Answer", "text": "No. Returns are shown before exchange fees, withdrawal costs, or capital gains taxes." } },
        { "@type": "Question", "name": "What if I bought Bitcoin on Pizza Day?", "acceptedAnswer": { "@type": "Answer", "text": "$100 invested on May 22, 2010 when BTC was ~$0.003 would have bought ~33,333 BTC — worth billions today." } },
        { "@type": "Question", "name": "Is past performance a guarantee of future returns?", "acceptedAnswer": { "@type": "Answer", "text": "No. Past performance does not guarantee future results. This tool is for educational purposes only." } },
        { "@type": "Question", "name": "Can I calculate Bitcoin's value by year?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — enter any year from 2010 to today and our Bitcoin time machine shows the exact price on that date, how much BTC your investment would have bought, and what it would be worth now." } },
        { "@type": "Question", "name": "How do I look up Bitcoin's price on a specific date?", "acceptedAnswer": { "@type": "Answer", "text": "Use the date picker to select any calendar date since July 2010. The calculator instantly fetches the historical Bitcoin price for that day and calculates your hypothetical return at today's live price." } },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "tr",
      "mainEntity": [
        { "@type": "Question", "name": "Ne kadar geriye gidebilirim?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin'in Temmuz 2010'daki ilk borsa işleminden bu yana herhangi bir tarihe bakabilirsiniz." } },
        { "@type": "Question", "name": "Fiyat verileri nereden geliyor?", "acceptedAnswer": { "@type": "Answer", "text": "Geçmiş fiyatlar CoinGecko'nun coin history API'sinden, güncel fiyatlar gerçek zamanlı uç noktasından gelmektedir." } },
        { "@type": "Question", "name": "Ücretler ve vergiler dikkate alınıyor mu?", "acceptedAnswer": { "@type": "Answer", "text": "Hayır. Getiriler borsa ücretleri, çekim maliyetleri veya sermaye kazancı vergileri öncesinde gösterilir." } },
        { "@type": "Question", "name": "Pizza Günü'nde Bitcoin alsaydım ne olurdu?", "acceptedAnswer": { "@type": "Answer", "text": "BTC'nin ~0,003 $ olduğu 22 Mayıs 2010'da yatırılan 100 $ ile ~33.333 BTC alınabilirdi — bugün milyarlarca dolar değerinde." } },
        { "@type": "Question", "name": "Geçmiş performans gelecekteki getirilerin garantisi midir?", "acceptedAnswer": { "@type": "Answer", "text": "Hayır. Geçmiş performans gelecekteki sonuçların garantisi değildir. Bu araç yalnızca eğitim amaçlıdır." } },
        { "@type": "Question", "name": "Bitcoin'in değerini yıla göre hesaplayabilir miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Evet — 2010'dan bugüne herhangi bir yılı girin; Bitcoin zaman makinemiz o tarihteki tam fiyatı, yatırımınızın ne kadar BTC alabildiğini ve bugünkü değerini gösterir." } },
        { "@type": "Question", "name": "Belirli bir tarihte Bitcoin'in fiyatını nasıl görürüm?", "acceptedAnswer": { "@type": "Answer", "text": "Temmuz 2010'dan bu yana herhangi bir takvim tarihini seçmek için tarih seçiciyi kullanın. Hesaplayıcı o güne ait Bitcoin fiyatını anında getirir ve hipotetik getirinizi bugünkü canlı fiyatla hesaplar." } },
      ],
    },
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [investment, setInvestment] = useState(100);
  const [dateStr, setDateStr] = useState('');

  const dateKey = dateStr || '';

  const { data: historicalPrice, isLoading: loadingHistorical, isError: errorHistorical } = useQuery({
    queryKey: ["btc-historical-price", dateKey],
    queryFn: () => fetchHistoricalPrice(dateKey),
    enabled: !!dateKey,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 2,
  });

  const { price: currentPrice, isLoading: loadingCurrentPrice, error: currentPriceError, refreshPrice } = useLiveBitcoinPrice("USD");
  const {
    data: fallbackCurrentPrice,
    isFetching: loadingFallbackCurrentPrice,
    refetch: retryFallbackCurrentPrice,
  } = useQuery({
    queryKey: ["btc-current-price-time-machine-fallback"],
    queryFn: fetchCurrentPrice,
    enabled: !!currentPriceError && currentPrice <= 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const effectiveCurrentPrice = currentPrice > 0 ? currentPrice : fallbackCurrentPrice ?? 0;
  const usingFallbackCurrentPrice = currentPrice <= 0 && effectiveCurrentPrice > 0;

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setDateStr(format(date, 'yyyy-MM-dd'));
  };

  const handlePresetSelect = (preset: PresetDate) => {
    const [y, m, d] = preset.date.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    setSelectedDate(date);
    setDateStr(preset.date);
  };

  const result = historicalPrice && effectiveCurrentPrice && historicalPrice > 0
    ? calculateTimeMachine(historicalPrice, effectiveCurrentPrice, investment)
    : null;

  const dateLabel = selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '';

  return (
    <>
      <Helmet>
        <title>{language==='tr'?'Bitcoin Zaman Makinesi Hesaplayıcısı':'Bitcoin Time Machine Calculator'}</title>
        <meta name="description" content={language==='tr'?'2010\'dan bu yana istediğiniz bir tarihe geri dönün. Tutar girin — Bitcoin\'inizin bugünkü değerini görün. Pizza günü, ATH, çöküş dipleri ve daha fazlası dahil.':'Travel back to any date since 2010. Enter an amount and see what your Bitcoin is worth today. Famous dates included: pizza day, ATH, crash lows and more.'} />
        <meta name="keywords" content="what if I bought bitcoin, bitcoin time machine, if I invested in bitcoin, bitcoin price on date, bitcoin ROI calculator" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zaman-makinesi':'https://bitcoincalculator.tools/calculators/time-machine'} />

        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zaman-makinesi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/time-machine" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/time-machine" />
        <meta property="og:title" content={language==='tr'?'Bitcoin Zaman Makinesi Hesaplayıcısı':'Bitcoin Time Machine Calculator'} />
        <meta property="og:description" content={language==='tr'?'2010\'dan bu yana istediğiniz bir tarihe geri dönün. Tutar girin — Bitcoin\'inizin bugünkü değerini görün. Pizza günü, ATH, çöküş dipleri dahil.':'Travel back to any date since 2010. Enter an amount and see what your Bitcoin is worth today. Famous dates included: pizza day, ATH, crash lows and more.'} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-zaman-makinesi':'https://bitcoincalculator.tools/calculators/time-machine'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-time-machine" enAlt={`Bitcoin Time Machine Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin Zaman Makinesi Hesaplayıcısı':'Bitcoin Time Machine Calculator'} />
        <meta name="twitter:description" content={language==='tr'?'2010\'dan bu yana herhangi bir tarihe gidin — Bitcoin yatırımınızın bugünkü değerini görün.':'Travel back to any date since 2010 and see what your Bitcoin investment is worth today.'} />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <BreadcrumbSchema
        language={language}
        items={language === 'tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr/" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Zaman Makinesi", url: trUrl },
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "Time Machine", url: enUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' }, { label: language==='tr'?'Zaman Makinesi':'Time Machine' }]} />
          </div>

          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/10">
                <Clock className="w-4 h-4" />
                {language==='tr'?'Tarihsel ROI Hesaplayıcısı':'Historical ROI Calculator'}
              </div>
              <h1 className="text-h1 font-bold text-foreground">
                {language==='tr'?<>Bitcoin <span className="text-gradient-premium">Zaman Makinesi</span></>:<>Bitcoin <span className="text-gradient-premium">Time Machine</span></>}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language==='tr'?'2010\'dan bugüne Bitcoin\'in fiyatını yıl, ay veya tam tarihe göre arayın. Herhangi bir tutar girerek yatırımınızın şu anki değerini gerçek zamanlı hesaplamayla görün.':'Look up Bitcoin\'s price by year, month, or exact date — from 2010 to today. Enter any amount to see what your investment would be worth now, with returns calculated in real time.'}
              </p>
              <div className="max-w-sm mx-auto">
                <CompactLiveBitcoinPrice currency="USD" />
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-4xl mx-auto space-y-8">
              <OfflineIndicator />

              {currentPriceError && (
                <Alert className="border-warning/30 bg-warning/$3 text-foreground">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertTitle>{language==='tr'?'Canlı BTC fiyatı geçici olarak kullanılamıyor':'Live BTC price is temporarily unavailable'}</AlertTitle>
                  <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-muted-foreground">
                    <span>
                      {usingFallbackCurrentPrice
                        ? (language==='tr'?`Hesaplamaların ve dışa aktarımların çalışmaya devam etmesi için yedek fiyat (${effectiveCurrentPrice.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}) kullanılıyor.`:`Using a resilient fallback price (${effectiveCurrentPrice.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}) so calculations and exports keep working.`)
                        : (language==='tr'?'Sayfa otomatik olarak yeniden deneyecek. Canlı dönüştürülmüş değerleri yenilemek için şimdi de yeniden deneyebilirsiniz.':'The page will retry automatically. You can also retry now to refresh live-converted values.')}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        refreshPrice();
                        retryFallbackCurrentPrice();
                      }}
                      disabled={loadingCurrentPrice || loadingFallbackCurrentPrice}
                      className="gap-2 shrink-0"
                    >
                      <RefreshCw className={cn("w-4 h-4", (loadingCurrentPrice || loadingFallbackCurrentPrice) && "animate-spin")} />
                      {language==='tr'?'Fiyatı yenile':'Retry price'}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Input Card */}
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{language==='tr'?'Tarih Seçin':'Select a Date'}</label>
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
                            {selectedDate ? format(selectedDate, "PPP") : (language==='tr'?'Tarih seçin':'Pick a date')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2010-07-17")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Investment Amount */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{language==='tr'?'Yatırım Tutarı (USD)':'Investment Amount (USD)'}</label>
                      <Input
                        type="number"
                        placeholder="100"
                        min={1}
                        value={investment || ''}
                        onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
                      />
                      <div className="flex gap-2">
                        {[100, 500, 1000, 10000].map((amt) => (
                          <Button
                            key={amt}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setInvestment(amt)}
                          >
                            ${amt.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Signature interaction: timeline scrubber */}
                  <ErrorBoundary>
                    <TimeMachineScrubber
                      selectedDate={selectedDate}
                      onDateChange={handleDateSelect}
                    />
                  </ErrorBoundary>

                  {/* Presets */}
                  <ErrorBoundary>
                    <TimeMachinePresets onSelect={handlePresetSelect} selectedDate={dateStr} />
                  </ErrorBoundary>
                </CardContent>
              </Card>

              {/* Loading */}
              {loadingHistorical && dateKey && (
                <div className="flex items-center justify-center gap-3 py-8">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">{language==='tr'?`${dateLabel} için fiyat getiriliyor...`:`Fetching price for ${dateLabel}...`}</span>
                </div>
              )}

              {/* Error */}
              {errorHistorical && (
                <div className="flex items-center gap-3 bg-warning/$3 border border-warning/20 rounded-xl p-4">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  <p className="text-sm text-warning">{language==='tr'?'Bu tarihin fiyatı alınamadı. CoinGecko bu kadar geriye ait veriye sahip olmayabilir veya hız sınırlamaları uygulanıyor olabilir. Kısa süre sonra tekrar deneyin.':'Could not fetch price for this date. CoinGecko may not have data this far back, or rate limits may apply. Try again shortly.'}</p>
                </div>
              )}

              {/* Result */}
              {result && !loadingHistorical && (
                <ErrorBoundary>
                  <TimeMachineResultCard key={dateKey} result={result} dateLabel={dateLabel} />
                  <div className="mt-4">
                    <TimeMachineShareSnapshot result={result} dateLabel={dateLabel} />
                  </div>
                </ErrorBoundary>
              )}

              {/* No date selected prompt */}
              {!dateKey && !loadingHistorical && (
                <Card className="glass-morphism-card border-border/20 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">{language==='tr'?'Zamanda geri gitmek için yukarıdan bir tarih seçin veya ünlü bir ön ayara tıklayın.':'Pick a date above or click a famous preset to travel back in time.'}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <TimeMachineHowToUse />
          <TimeMachineHistoricalContent currentPrice={effectiveCurrentPrice} isLoading={loadingCurrentPrice || loadingFallbackCurrentPrice} />
          <TimeMachineFAQSection />
          <RelatedCalculators />

          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{language==='tr'?'Sorumluluk Reddi':'Disclaimer'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language==='tr'?'Geçmiş performans gelecekteki sonuçları garanti etmez. Bu hesaplayıcı, yalnızca eğitim amaçlı tarihsel CoinGecko verilerini kullanmaktadır. Gösterilen getiriler ücret ve vergiler öncesidir. Bu finansal tavsiye değildir.':'Past performance does not guarantee future results. This calculator uses historical CoinGecko data for educational purposes only. Returns shown are before fees and taxes. This is not financial advice.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinTimeMachine;
