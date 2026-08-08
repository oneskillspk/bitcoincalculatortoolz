import { CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SubmissionStatusProps {
  tr: boolean;
  type: 'contact' | 'newsletter';
  email: string;
  onEdit: () => void;
}

export const SubmissionStatus = ({ tr, type, email, onEdit }: SubmissionStatusProps) => {
  const isContact = type === 'contact';

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <Card className="card-premium border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <CardTitle className="text-display-sm font-heading text-emerald-700 dark:text-emerald-400">
            {tr 
              ? (isContact ? 'Mesajınız Alındı!' : 'Abonelik Başarılı!')
              : (isContact ? 'Message Received!' : 'Subscription Successful!')}
          </CardTitle>
          <CardDescription className="text-emerald-600/80 dark:text-emerald-400/80">
            {tr
              ? `${email} adresine bir onay e-postası gönderdik.`
              : `We've sent a confirmation email to ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-background/50 border border-emerald-500/10 text-sm space-y-3">
            <p className="font-medium text-foreground">
              {tr ? 'Sırada ne var?' : 'What happens next?'}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                {tr 
                  ? (isContact ? 'Ekibimiz mesajınızı inceliyor.' : 'En son Bitcoin haberlerini alacaksınız.')
                  : (isContact ? 'Our team is reviewing your inquiry.' : 'You will start receiving the latest Bitcoin insights.')}
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                {tr
                  ? (isContact ? '24 saat içinde yanıt vereceğiz.' : 'İstediğiniz zaman abonelikten çıkabilirsiniz.')
                  : (isContact ? 'We will respond within 24 hours.' : 'You can unsubscribe at any time.')}
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={onEdit}
              className="flex-1 gap-2 border-emerald-500/20 hover:bg-emerald-500/10"
            >
              <RotateCcw className="w-4 h-4" />
              {tr ? 'Bilgileri Düzenle / Tekrar Gönder' : 'Edit Details / Resend'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
