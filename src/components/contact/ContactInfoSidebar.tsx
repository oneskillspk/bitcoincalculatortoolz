import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, MapPin } from "lucide-react";

interface ContactInfoSidebarProps {
  tr: boolean;
}

export const ContactInfoSidebar = ({ tr }: ContactInfoSidebarProps) => {
  return (
    <div className="space-y-8 animate-fade-in-up animate-stagger-2">
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-display-sm font-heading">
            {tr ? 'İletişim Bilgileri' : 'Contact Information'}
          </CardTitle>
          <CardDescription>
            {tr ? 'Destek ekibimize ulaşmanın birden fazla yolu' : 'Multiple ways to reach our support team'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-1">{tr ? 'E-posta Desteği' : 'Email Support'}</h3>
              <p className="text-foreground/70 mb-1">support@bitcoincalculator.tools</p>
              <p className="text-sm text-foreground/60">
                {tr ? 'Teknik destek ve genel sorular için' : 'For technical support and general inquiries'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-1">{tr ? 'Yanıt Süresi' : 'Response Time'}</h3>
              <p className="text-foreground/70 mb-1">{tr ? '24 saat içinde' : 'Within 24 hours'}</p>
              <p className="text-sm text-foreground/60">
                {tr ? 'Pazartesi - Cuma, 09:00 - 18:00 EST' : 'Monday - Friday, 9 AM - 6 PM EST'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-1">{tr ? 'Konum' : 'Location'}</h3>
              <p className="text-foreground/70 mb-1">{tr ? 'Bitcoin Her Yerde' : 'Bitcoin is Everywhere'}</p>
              <p className="text-sm text-foreground/60">
                {tr ? 'Dünya genelindeki Bitcoin meraklılarına hizmet ediyoruz' : 'Serving Bitcoin enthusiasts worldwide'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="text-display-sm font-heading">
            {tr ? 'Hızlı Yardım' : 'Quick Help'}
          </CardTitle>
          <CardDescription>
            {tr ? 'Sık sorulan sorular ve kaynaklar' : 'Common questions and resources'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="font-heading font-medium mb-2">
                {tr ? 'Hesaplayıcı Sorunları?' : 'Calculator Issues?'}
              </h4>
              <p className="text-sm text-foreground/70">
                {tr
                  ? 'Yaygın hesaplayıcı sorunları ve çözümleri için SSS bölümümüzü inceleyin.'
                  : 'Check our FAQ section for common calculator problems and solutions.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="font-heading font-medium mb-2">
                {tr ? 'Özellik İstekleri' : 'Feature Requests'}
              </h4>
              <p className="text-sm text-foreground/70">
                {tr
                  ? 'Yeni bir hesaplayıcı fikriniz mi var? Sizden duymayı çok isteriz!'
                  : "Have an idea for a new calculator? We'd love to hear from you!"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="font-heading font-medium mb-2">
                {tr ? 'Ortaklık Talepleri' : 'Partnership Inquiries'}
              </h4>
              <p className="text-sm text-foreground/70">
                {tr
                  ? 'Araçlarımızı entegre etmekle mi ilgileniyorsunuz? Fırsatları konuşalim.'
                  : "Interested in integrating our tools? Let's discuss opportunities."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
