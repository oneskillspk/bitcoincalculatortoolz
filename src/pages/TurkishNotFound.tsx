import { Link } from "@/components/LocalizedLink";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Home, Calculator } from "lucide-react";

const TurkishNotFound = () => {
  return (
    <>
      <Helmet>
        <html lang="tr" />
        <title>Sayfa Bulunamadı | Bitcoin Hesaplayıcı Araçları</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Aradığınız sayfa bulunamadı. Ücretsiz Bitcoin hesaplayıcılarımıza göz atmak için ana sayfaya dönün."
        />
        <link rel="canonical" href="https://bitcoincalculator.tools/tr/404" />
        <meta property="og:locale" content="tr_TR" />
      </Helmet>

      <main className="min-h-dvh flex items-center justify-center" aria-labelledby="tr-notfound-heading">
        <div className="text-center animate-fade-in">
          <div className="text-8xl font-bold text-bitcoin-gradient mb-4" aria-hidden="true">404</div>
          <h1 id="tr-notfound-heading" className="text-h1 font-bold mb-4">Sayfa Bulunamadı</h1>
          <p className="text-xl text-foreground/70 mb-8 max-w-md mx-auto">
            Bu Bitcoin hesaplayıcısı henüz mevcut değil gibi görünüyor. Sizi hesaplamaya geri götürelim!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-bitcoin">
              <Link to="/tr/">
                <Home className="mr-2 w-4 h-4" aria-hidden="true" />
                Ana Sayfaya Dön
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/tr/hesaplayicilar">
                <Calculator className="mr-2 w-4 h-4" aria-hidden="true" />
                Hesaplayıcıları Görüntüle
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default TurkishNotFound;
