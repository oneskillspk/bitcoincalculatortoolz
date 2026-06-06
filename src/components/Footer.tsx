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
        className="inline-block text-[13px] leading-[1.45] tracking-[-0.005em] text-muted-foreground decoration-primary/40 underline-offset-[6px] decoration-[1.5px] hover:text-primary hover:underline transition-colors duration-200"
      >
        {label}
      </Link>
    </li>
  );

  const colHeading = (label: string) => (
    <h3 className="mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] leading-none text-foreground">
      <span className="block h-3 w-[3px] rounded-full bg-primary" aria-hidden />
      {label}
    </h3>
  );

  return (
    <footer className="site-footer relative overflow-hidden animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 pt-6">
        <AffiliatePlacement
          slug="site"
          lang={isTurkish ? "tr" : "en"}
          zone="pre-footer"
          className="!my-0"
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16">
        {/* Editorial card panel */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-[0_1px_2px_hsl(var(--foreground)/0.04),0_24px_60px_-32px_hsl(var(--foreground)/0.12)] backdrop-blur-sm">

          {/* App promo band */}
          <div className="px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 border-b border-border/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
              <div className="max-w-xl text-center md:text-left">
                <div className="mb-4 flex items-center gap-3 justify-center md:justify-start">
                  <span className="h-px w-6 bg-primary" aria-hidden />
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-foreground">
                    {t('footer.appBadge')}
                  </span>
                </div>
                <h2 className="font-editorial tracking-editorial text-balance text-foreground text-[28px] sm:text-4xl md:text-[42px] leading-[1.08]">
                  {t('footer.appHeadline')}
                </h2>
                <p className="mt-4 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                  {t('footer.appTagline')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end shrink-0">
                <GooglePlayBadge />
                <AppStoreBadge />
              </div>
            </div>
          </div>

          {/* Link grid — desktop */}
          <div className="hidden sm:grid px-6 py-12 sm:px-10 sm:py-14 md:px-14 md:py-16 grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="space-y-5 text-center sm:text-left">
              <div className="flex justify-center sm:justify-start">
                <AnimatedBrandLogo variant="full" size="sm" animated={false} />
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px] mx-auto sm:mx-0">
                {t('footer.tagline')}
              </p>
              <p className="text-[12px] text-muted-foreground/80">
                {t('footer.madeWith')}
              </p>
            </div>

            {/* Core Calculators */}
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

            {/* Market Analysis */}
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

            {/* Support & Resources */}
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
              <AccordionItem value="core" className="border-border/50">
                <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground hover:no-underline py-4">
                  {t('footer.coreCalcs')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-1 pb-2">
                    {navLink(links.whatIf,    t('footer.link.whatIf'))}
                    {navLink(links.retirement,t('footer.link.retirement'))}
                    {navLink(links.dca,       t('footer.link.dca'))}
                    {navLink(links.lumpSum,   t('footer.link.lumpSum'))}
                    {navLink(links.converter, t('footer.link.converter'))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="market" className="border-border/50">
                <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground hover:no-underline py-4">
                  {t('footer.marketAnalysis')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-1 pb-2">
                    {navLink(links.powerLaw,  t('footer.link.powerLaw'))}
                    {navLink(links.rainbow,   t('footer.link.rainbow'))}
                    {navLink(links.onChain,   t('footer.link.onChain'))}
                    {navLink(links.dominance, t('footer.link.dominance'))}
                    {navLink(links.volatility,t('footer.link.volatility'))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="support" className="border-border/50">
                <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground hover:no-underline py-4">
                  {t('footer.supportResources')}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pl-1 pb-2">
                    {navLink(links.about,   t('footer.link.about'))}
                    {navLink(links.contact, t('footer.link.contact'))}
                    {navLink(links.privacy, t('footer.link.privacy'))}
                    {navLink(links.terms,   t('footer.link.terms'))}
                    {navLink(links.sitemap, t('footer.link.sitemap'))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="mt-6 text-center text-[12px] text-muted-foreground/80">
              {t('footer.madeWith')}
            </p>
          </div>


          {/* Bottom Bar */}
          <div className="px-6 py-7 sm:px-10 sm:py-8 md:px-14 bg-muted/40 border-t border-border/50">
            <p className="text-[11px] sm:text-[12px] text-muted-foreground/80 font-medium leading-relaxed text-center max-w-4xl mx-auto">
              {t('footer.dataSources')}
            </p>
            <div className="mt-6 pt-5 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-muted-foreground/80">{t('footer.copyright')}</p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                <AffiliateOptOutToggle />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 text-[11px] text-muted-foreground hover:text-primary group">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                        <Info className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span className="underline underline-offset-4 decoration-border">{t('footer.disclaimerBtn')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl rounded-lg border-border/40 bg-background/95 shadow-xl">
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
