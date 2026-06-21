import { Link } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { GooglePlayBadge } from "@/components/cinematic/badges/GooglePlayBadge";
import { AppStoreBadge } from "@/components/cinematic/badges/AppStoreBadge";
import { AnimatedBrandLogo } from "@/components/AnimatedBrandLogo";
import { AffiliateOptOutToggle } from "@/components/affiliateAI/AffiliateOptOutToggle";
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export const Footer = () => {
  const { t, language } = useLanguage();
  const isTurkish = language === 'tr';
  // Suppress the sitewide pre-footer affiliate slot on the homepage —
  // the homepage already renders its own dedicated Ledger banner, and
  // stacking two ads back-to-back looks unprofessional.
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isHome = pathname === "/" || pathname === "/tr" || pathname === "/tr/";

  const links = {
    whatIf:    isTurkish ? '/tr/hesaplayicilar/bitcoin-ya-olsaydi'             : '/calculators/what-if',
    retirement:isTurkish ? '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi': '/calculators/retirement',
    dca:       isTurkish ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi'       : '/calculators/dca',
    lumpSum:   isTurkish ? '/tr/hesaplayicilar/bitcoin-maliyet-ortalama'        : '/calculators/lump-sum-vs-dca',
    converter: isTurkish ? '/tr/hesaplayicilar/bitcoin-donusturucu'             : '/calculators/bitcoin-converter',
    powerLaw:  isTurkish ? '/tr/hesaplayicilar/bitcoin-guc-yasasi'              : '/calculators/power-law',
    rainbow:   isTurkish ? '/tr/hesaplayicilar/bitcoin-gokkusagi-grafigi'       : '/calculators/rainbow-chart',
    onChain:   isTurkish ? '/tr/hesaplayicilar/bitcoin-stok-akis'               : '/calculators/on-chain',
    dominance: isTurkish ? '/tr/hesaplayicilar/bitcoin-dominansi'               : '/calculators/dominance',
    volatility:isTurkish ? '/tr/hesaplayicilar/bitcoin-oynaklik'                : '/calculators/volatility',
    about:     isTurkish ? '/tr/hakkimizda'  : '/about',
    contact:   isTurkish ? '/tr/iletisim'    : '/contact',
    privacy:   isTurkish ? '/tr/gizlilik'    : '/privacy',
    terms:     isTurkish ? '/tr/kosullar'    : '/terms',
    learn:     isTurkish ? '/tr/ogrenin'     : '/learn',
    sitemap:   isTurkish ? '/tr/site-haritasi': '/sitemap',
  };

  const navLink = (to: string, label: string) => (
    <li>
      <Link
        to={to}
        className="inline-block text-[13px] leading-[1.45] tracking-[-0.005em] text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        {label}
      </Link>
    </li>
  );

  const colHeading = (label: string) => (
    <h3 className="mb-5 flex items-center gap-2">
      <span className="ip-dot" aria-hidden />
      <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-foreground/80 font-semibold">
        {label}
      </span>
    </h3>
  );

  return (
    <footer className="site-footer relative overflow-hidden animate-fade-in">
      {!isHome && (
        <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
          <AffiliatePlacement
            slug="site"
            lang={isTurkish ? "tr" : "en"}
            zone="pre-footer"
            className="!my-0"
          />
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16">
        <div className="ip-card max-w-7xl mx-auto">

          {/* App promo band — terminal strip + body */}
          <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/40 px-4 sm:px-5 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="ip-dot" aria-hidden />
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground truncate">
                <span className="text-foreground/60">MOBILE</span>
              </span>
            </div>
            <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-foreground/70 shrink-0">
              {t('footer.appBadge')}
            </span>
          </div>

          <div className="px-5 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 border-b border-border/60">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="font-display font-semibold text-foreground text-[22px] sm:text-[30px] md:text-[34px] leading-[1.15] tracking-[-0.025em] text-balance">
                  {t('footer.appHeadline')}
                </h2>
                <p className="mt-3 text-[13.5px] sm:text-sm md:text-[14.5px] text-muted-foreground leading-relaxed text-balance">
                  {t('footer.appTagline')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end shrink-0">
                <GooglePlayBadge />
                <AppStoreBadge />
              </div>
            </div>
          </div>

          {/* Link grid — desktop / tablet */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 px-5 sm:px-8 md:px-10 py-10 md:py-12">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex">
                <AnimatedBrandLogo variant="full" size="sm" animated={false} />
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
                {t('footer.tagline')}
              </p>
              <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground/80">
                {t('footer.madeWith')}
              </p>
            </div>

            <div>
              {colHeading(t('footer.coreCalcs'))}
              <ul className="space-y-3">
                {navLink(links.whatIf,    t('footer.link.whatIf'))}
                {navLink(links.retirement,t('footer.link.retirement'))}
                {navLink(links.dca,       t('footer.link.dca'))}
                {navLink(links.lumpSum,   t('footer.link.lumpSum'))}
                {navLink(links.converter, t('footer.link.converter'))}
              </ul>
            </div>

            <div>
              {colHeading(t('footer.marketAnalysis'))}
              <ul className="space-y-3">
                {navLink(links.powerLaw,  t('footer.link.powerLaw'))}
                {navLink(links.rainbow,   t('footer.link.rainbow'))}
                {navLink(links.onChain,   t('footer.link.onChain'))}
                {navLink(links.dominance, t('footer.link.dominance'))}
                {navLink(links.volatility,t('footer.link.volatility'))}
              </ul>
            </div>

            <div>
              {colHeading(t('footer.supportResources'))}
              <ul className="space-y-3">
                {navLink(links.about,   t('footer.link.about'))}
                {navLink(links.contact, t('footer.link.contact'))}
                {navLink(links.privacy, t('footer.link.privacy'))}
                {navLink(links.terms,   t('footer.link.terms'))}
                {navLink(links.sitemap, t('footer.link.sitemap'))}
              </ul>
            </div>
          </div>

          {/* Link list — mobile accordion */}
          <div className="sm:hidden px-5 py-8">
            <div className="mb-6 flex flex-col items-center text-center gap-4">
              <AnimatedBrandLogo variant="full" size="sm" animated={false} />
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px]">
                {t('footer.tagline')}
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="core" className="border-border/60">
                <AccordionTrigger className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground hover:no-underline py-4 min-h-[48px]">
                  <span className="inline-flex items-center gap-2">
                    <span className="ip-dot" aria-hidden />
                    {t('footer.coreCalcs')}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-5 pb-3">
                    {navLink(links.whatIf,    t('footer.link.whatIf'))}
                    {navLink(links.retirement,t('footer.link.retirement'))}
                    {navLink(links.dca,       t('footer.link.dca'))}
                    {navLink(links.lumpSum,   t('footer.link.lumpSum'))}
                    {navLink(links.converter, t('footer.link.converter'))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="market" className="border-border/60">
                <AccordionTrigger className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground hover:no-underline py-4 min-h-[48px]">
                  <span className="inline-flex items-center gap-2">
                    <span className="ip-dot" aria-hidden />
                    {t('footer.marketAnalysis')}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-5 pb-3">
                    {navLink(links.powerLaw,  t('footer.link.powerLaw'))}
                    {navLink(links.rainbow,   t('footer.link.rainbow'))}
                    {navLink(links.onChain,   t('footer.link.onChain'))}
                    {navLink(links.dominance, t('footer.link.dominance'))}
                    {navLink(links.volatility,t('footer.link.volatility'))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support" className="border-border/60">
                <AccordionTrigger className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground hover:no-underline py-4 min-h-[48px]">
                  <span className="inline-flex items-center gap-2">
                    <span className="ip-dot" aria-hidden />
                    {t('footer.supportResources')}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-5 pb-3">
                    {navLink(links.about,   t('footer.link.about'))}
                    {navLink(links.contact, t('footer.link.contact'))}
                    {navLink(links.privacy, t('footer.link.privacy'))}
                    {navLink(links.terms,   t('footer.link.terms'))}
                    {navLink(links.sitemap, t('footer.link.sitemap'))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="mt-6 text-center font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground/80">
              {t('footer.madeWith')}
            </p>
          </div>


          {/* Bottom Bar */}
          <div className="px-5 sm:px-8 md:px-10 py-6 sm:py-7 bg-background/30 border-t border-border/60">
            <p className="text-[11px] sm:text-[12px] text-muted-foreground/80 leading-relaxed text-center max-w-4xl mx-auto">
              {t('footer.dataSources')}
            </p>
            <p className="mt-3 text-[11px] sm:text-[12px] text-muted-foreground/70 leading-relaxed text-center max-w-4xl mx-auto">
              {t('footer.ftcDisclosure')}{' '}
              <a
                href={language === 'tr' ? '/tr/bagli-kurulus-aciklamasi' : '/affiliate-disclosure'}
                className="underline underline-offset-2 hover:text-primary"
              >
                {language === 'tr' ? 'Tam açıklamayı oku' : 'Read full disclosure'}
              </a>
              .
            </p>
            <div className="mt-5 pt-4 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-3 text-center md:text-left">
              <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground/80 order-2 md:order-1">{t('footer.copyright')}</p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 order-1 md:order-2">
                <AffiliateOptOutToggle />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground hover:text-primary group">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-border/60 group-hover:border-primary/40 transition-colors">
                        <Info className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span>{t('footer.disclaimerBtn')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl rounded-xl border-border/70 bg-card shadow-xl">
                    <DialogHeader>
                      <DialogTitle>{t('footer.disclaimerTitle')}</DialogTitle>
                      <DialogDescription>{t('footer.disclaimerDesc')}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                      <p>{t('footer.disclaimerP1')}</p>
                      <p>{t('footer.disclaimerP2')}</p>
                      <p>{t('footer.disclaimerP3')}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
