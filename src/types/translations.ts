export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'ko' | 'ar' | 'it' | 'zh' | 'ru' | 'tr';

export interface Translations {
  [key: string]: string;
}

export interface AllTranslations {
  [key: string]: Translations;
}
