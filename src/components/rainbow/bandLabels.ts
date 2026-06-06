/**
 * Localized rainbow-chart band labels.
 * The canonical English names live in `services/rainbowChartService.BANDS`.
 * This helper maps them to Turkish for display in the legend, tooltip,
 * current-zone indicator and band stats list.
 *
 * Wording is kept in sync with the TR copy already used in RainbowFAQSection.
 */
const TR_BAND_LABELS: Record<string, string> = {
  'Basically a Fire Sale': 'Neredeyse Yangından Mal Kaçırır Gibi',
  'BUY!': 'AL!',
  'Accumulate': 'Biriktir',
  'Still Cheap': 'Hâlâ Ucuz',
  'HODL!': 'HODL!',
  'Is This a Bubble?': 'Bu Bir Balon mu?',
  'FOMO Intensifies': 'FOMO Yoğunlaşıyor',
  'Sell. Seriously, SELL!': 'Sat. Cidden, SAT!',
  'Maximum Bubble Territory': 'Maksimum Balon Bölgesi',
  'Future projection': 'Gelecek projeksiyonu',
  'Below Rainbow': 'Gökkuşağının Altında',
};

export const localizeBandName = (name: string, isTr: boolean): string => {
  if (!isTr) return name;
  return TR_BAND_LABELS[name] ?? name;
};
