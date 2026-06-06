import { useLocation } from "react-router-dom";
import { Link } from "@/components/LocalizedLink";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Home, Calculator } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const tr = language === 'tr';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{tr ? 'Sayfa Bulunamadı | Bitcoin Calculator Tools' : 'Page Not Found | Bitcoin Calculator Tools'}</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="description" content={tr ? 'Aradığınız sayfa bulunamadı. Bitcoin Calculator Tools ana sayfasına dönüp ücretsiz hesaplayıcıları keşfedin.' : "The page you're looking for doesn't exist. Return to Bitcoin Calculator Tools to explore our free investment calculators."} />
        <link rel="canonical" href="https://bitcoincalculator.tools/404" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-8xl font-bold text-bitcoin-gradient mb-4">404</div>
        <h1 className="text-h1 font-bold mb-4">{tr ? 'Sayfa Bulunamadı' : 'Page Not Found'}</h1>
        <p className="text-xl text-foreground/70 mb-8 max-w-md mx-auto">
          {tr ? 'Bu Bitcoin hesaplayıcısı henüz موجود değil. Hadi sizi tekrar hesaplamaya döndürelim!' : "Looks like this Bitcoin calculator doesn't exist yet. Let's get you back to calculating!"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="btn-bitcoin">
            <Link to="/">
              <Home className="mr-2 w-4 h-4" />
              {tr ? 'Ana Sayfa' : 'Return Home'}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/#calculators">
              <Calculator className="mr-2 w-4 h-4" />
              {tr ? 'Hesaplayıcıları Gör' : 'View Calculators'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;
