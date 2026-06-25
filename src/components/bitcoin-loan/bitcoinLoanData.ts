import { LoanFormInputs } from './BitcoinLoanInputPanel';

export const DEFAULT_INPUTS: LoanFormInputs = {
  btcCollateral: 0,
  btcPrice: 0,
  loanAmountUsd: 0,
  interestRateAnnual: 8,
  loanTermMonths: 12,
  initialLtv: 50,
  marginCallLtv: 65,
  liquidationLtv: 80,
  expectedBtcGrowthRate: 25,
  platform: 'conservative',
};

export const loanPlatformRows = [
  { platform: 'Ledn', custody: 'Centralized custody; BTC held with institutional custodians', ltv: 'Up to 50% commonly advertised', margin: 'Margin call and liquidation thresholds depend on the active loan agreement', notes: 'Rates and availability vary by jurisdiction; verify current terms before applying', fit: 'Borrowers who want a known CeFi lender and accept third-party custody risk' },
  { platform: 'Unchained', custody: 'Collaborative custody model with multisig structure', ltv: 'Often lower-LTV, conservative structures', margin: 'Designed around overcollateralization; exact thresholds depend on product terms', notes: 'Availability can be limited and underwriting may be stricter than generic CeFi', fit: 'Borrowers who value custody transparency and lower operational risk' },
  { platform: 'Nexo', custody: 'Centralized platform custody; terms vary by region and account status', ltv: 'Flexible LTV ranges when available', margin: 'Automated collateral health monitoring and liquidation rules', notes: 'Product availability, rates, and eligible regions change frequently', fit: 'Users comparing flexible CeFi credit lines, with careful counterparty review' },
  { platform: 'Generic CeFi lender', custody: 'Usually full lender custody or third-party custodian custody', ltv: '25%–60% depending on risk appetite', margin: 'Higher LTV means margin calls arrive faster during drawdowns', notes: 'Use this fallback when live lender rates are unstable or unavailable', fit: 'Early planning before checking exact lender disclosures' },
];

export const faqSchema = [
  { "@type": "Question", "name": "What is a Bitcoin-backed loan?", "acceptedAnswer": { "@type": "Answer", "text": "A Bitcoin-backed loan lets you borrow fiat currency by locking your Bitcoin as collateral. You keep ownership of your BTC — the lender holds it until you repay the loan. Unlike selling, borrowing doesn't trigger a taxable capital gains event." }},
  { "@type": "Question", "name": "What is LTV (Loan-to-Value) ratio?", "acceptedAnswer": { "@type": "Answer", "text": "LTV is the ratio of your loan amount to your Bitcoin collateral value. A 50% LTV on $100,000 of BTC means you borrow $50,000. Lower LTV ratios are safer because Bitcoin's price must drop further before triggering liquidation." }},
  { "@type": "Question", "name": "What happens if Bitcoin's price drops during my loan?", "acceptedAnswer": { "@type": "Answer", "text": "If Bitcoin's price falls far enough, your LTV rises. When it reaches the margin call threshold, the platform asks you to add collateral. If it reaches the liquidation threshold, the platform force-sells your Bitcoin to recover the loan." }},
  { "@type": "Question", "name": "How is the liquidation price calculated?", "acceptedAnswer": { "@type": "Answer", "text": "Liquidation price = (Loan Amount ÷ BTC Collateral) ÷ (Liquidation LTV ÷ 100). For example, borrowing $50,000 against 1 BTC with 80% liquidation LTV gives a liquidation price of $62,500." }},
  { "@type": "Question", "name": "Is borrowing against Bitcoin better than selling?", "acceptedAnswer": { "@type": "Answer", "text": "It depends. Borrowing avoids capital gains tax (up to 23.8%) and keeps Bitcoin upside exposure. But you pay interest and face liquidation risk. Our calculator compares both scenarios with your specific numbers." }},
  { "@type": "Question", "name": "What interest rates do Bitcoin loan platforms charge?", "acceptedAnswer": { "@type": "Answer", "text": "Rates vary: 4-8% for conservative platforms, 8-12% for standard CeFi, and 5-20%+ for DeFi protocols. Rates depend on LTV ratio, loan term, and platform." }},
  { "@type": "Question", "name": "Can I lose more than my collateral?", "acceptedAnswer": { "@type": "Answer", "text": "Most Bitcoin-backed loans are non-recourse — the lender can only seize your collateral, not your other assets. However, terms vary by platform." }},
  { "@type": "Question", "name": "Is this Bitcoin loan calculator free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — completely free, no signup required. All calculations run in your browser for privacy. It covers LTV analysis, liquidation pricing, amortization schedules, and a borrow-vs-sell tax comparison." }},
];

export const faqSchemaTr = [
  { "@type": "Question", "name": "Bitcoin teminatlı kredi nedir?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin teminatlı kredi, Bitcoin'inizi teminat olarak kilitleyerek fiat para birimi ödünç almanıza olanak tanır. BTC'nizin mülkiyetini elinde tutarsınız — borç vereni krediyi geri ödeyene kadar onu tutar. Satıştan farklı olarak, borçlanma vergiye tabi bir sermaye kazancı olayını tetiklemez." }},
  { "@type": "Question", "name": "LTV (Kredi-Teminat Oranı) nedir?", "acceptedAnswer": { "@type": "Answer", "text": "LTV, kredi tutarınızın Bitcoin teminat değerinize oranıdır. 100.000 $ BTC üzerinde %50 LTV, 50.000 $ ödünç aldığınız anlamına gelir. Daha düşük LTV oranları daha güvenlidir çünkü tasfiye tetiklenmeden önce Bitcoin fiyatının daha fazla düşmesi gerekir." }},
  { "@type": "Question", "name": "Kredim sırasında Bitcoin fiyatı düşerse ne olur?", "acceptedAnswer": { "@type": "Answer", "text": "Bitcoin fiyatı yeterince düşerse LTV'niz artar. Marjin çağrısı eşiğine ulaştığında platform ek teminat eklemenizi ister. Tasfiye eşiğine ulaşırsa platform, krediyi geri almak için Bitcoin'inizi zorla satar." }},
  { "@type": "Question", "name": "Tasfiye fiyatı nasıl hesaplanır?", "acceptedAnswer": { "@type": "Answer", "text": "Tasfiye fiyatı = (Kredi Tutarı ÷ BTC Teminatı) ÷ (Tasfiye LTV ÷ 100). Örneğin, %80 tasfiye LTV ile 1 BTC karşılığında 50.000 $ ödünç almak 62.500 $ tasfiye fiyatı verir." }},
  { "@type": "Question", "name": "Bitcoin karşılığı borçlanmak satmaktan daha mı iyi?", "acceptedAnswer": { "@type": "Answer", "text": "Duruma bağlı. Borçlanmak, sermaye kazancı vergisinden (%23,8'e kadar) kaçınır ve Bitcoin'in yukarı yönlü potansiyelini korur. Ancak faiz ödersiniz ve tasfiye riskiyle karşılaşırsınız. Hesaplayıcımız her iki senaryoyu sizin rakamlarınızla karşılaştırır." }},
  { "@type": "Question", "name": "Bitcoin kredi platformları hangi faiz oranlarını uygular?", "acceptedAnswer": { "@type": "Answer", "text": "Oranlar değişir: muhafazakâr platformlar için %4-8, standart CeFi için %8-12 ve DeFi protokolleri için %5-20+. Oranlar LTV oranına, kredi vadesine ve platforma bağlıdır." }},
  { "@type": "Question", "name": "Teminatımdan daha fazlasını kaybedebilir miyim?", "acceptedAnswer": { "@type": "Answer", "text": "Çoğu Bitcoin teminatlı kredi rücu hakkı içermez — borç veren yalnızca teminatınıza el koyabilir, diğer varlıklarınıza değil. Ancak şartlar platforma göre değişir." }},
  { "@type": "Question", "name": "Bu Bitcoin kredi hesaplayıcısı ücretsiz mi?", "acceptedAnswer": { "@type": "Answer", "text": "Evet — tamamen ücretsiz, kayıt gerekmez. Tüm hesaplamalar gizlilik için tarayıcınızda çalışır. LTV analizi, tasfiye fiyatlandırması, amortisman çizelgeleri ve borçlanma-satma vergi karşılaştırmasını kapsar." }},
];
