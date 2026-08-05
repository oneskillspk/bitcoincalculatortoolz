import { Card, CardContent } from "@/components/ui/card";
import { Info, Layers, Zap, Clock } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const MempoolExplainedSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Layers className="w-5 h-5 text-primary" /></div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Mempool Nedir?' : 'What is the Mempool?'}
            </h2>
          </div>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr 
                ? 'Mempool (Memory Pool), onaylanmayı bekleyen tüm Bitcoin işlemlerinin bulunduğu bir tür "bekleme odası"dır. Bir işlem gönderdiğinizde, önce bu havuza girer. Madenciler, bloklarına eklemek için genellikle en yüksek ücreti (sats/vB) teklif eden işlemleri seçerler.'
                : 'The Mempool (Memory Pool) is a "waiting room" for all Bitcoin transactions pending confirmation. When you send a transaction, it first enters this pool. Miners then select transactions to include in their blocks, usually prioritizing those with the highest fee (sats/vB).'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <Zap className="w-5 h-5 text-success" />
              <h3 className="font-bold text-foreground">{tr ? 'Düşük Yoğunluk' : 'Low Congestion'}</h3>
              <p className="text-xs text-muted-foreground">
                {tr ? 'Mempool boşsa, 1-2 sats/vB ile işleminiz bir sonraki blokta onaylanabilir.' : 'If the mempool is empty, 1-2 sats/vB can get you into the very next block.'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <Clock className="w-5 h-5 text-warning" />
              <h3 className="font-bold text-foreground">{tr ? 'Yüksek Yoğunluk' : 'High Congestion'}</h3>
              <p className="text-xs text-muted-foreground">
                {tr ? 'Ağ kalabalıksa, düşük ücretli işlemler günlerce bekleyebilir veya iptal edilebilir.' : 'When the network is busy, low-fee transactions can wait for days or be evicted.'}
              </p>
            </CardContent>
          </Card>
          <Card className="border border-border/30 bg-card/50">
            <CardContent className="pt-6 space-y-3">
              <Info className="w-5 h-5 text-info" />
              <h3 className="font-bold text-foreground">{tr ? 'RBF (Replace-By-Fee)' : 'RBF (Replace-By-Fee)'}</h3>
              <p className="text-xs text-muted-foreground">
                {tr ? 'İşleminiz takılırsa, daha yüksek ücret teklif ederek onu hızlandırabilirsiniz.' : 'If your transaction gets stuck, you can speed it up by offering a higher fee.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
