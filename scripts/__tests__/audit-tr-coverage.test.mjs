import { describe, it, expect } from 'vitest';
import {
  checkTitles, checkH1, checkButtons, checkPlaceholders,
  checkAriaLabels, checkBreadcrumbLabels, checkFaqParity,
} from '../lib/tr-coverage-checks.mjs';

describe('audit-tr-coverage: <title>', () => {
  it('flags EN-only <title>', () => {
    expect(checkTitles(`<title>Bitcoin Calculator</title>`)).toHaveLength(1);
  });
  it('passes ternary-branched <title>', () => {
    expect(checkTitles(`<title>{language === 'tr' ? 'Bitcoin Hesaplayıcı' : 'Bitcoin Calculator'}</title>`)).toHaveLength(0);
  });
  it('passes t()-wrapped <title>', () => {
    expect(checkTitles(`<title>{t('page.title')}</title>`)).toHaveLength(0);
  });
});

describe('audit-tr-coverage: <h1>', () => {
  it('flags EN-only <h1>', () => {
    expect(checkH1(`<h1 className="x">Calculate Your Stack</h1>`)).toHaveLength(1);
  });
  it('passes pure {expr} <h1>', () => {
    expect(checkH1(`<h1>{title}</h1>`)).toHaveLength(0);
  });
  it('passes language-branched <h1>', () => {
    expect(checkH1(`<h1>{language === 'tr' ? 'Yığını Hesapla' : 'Calculate Stack'}</h1>`)).toHaveLength(0);
  });
});

describe('audit-tr-coverage: <Button>', () => {
  it('flags EN-only Button child', () => {
    expect(checkButtons(`<Button>Calculate Now</Button>`)).toHaveLength(1);
  });
  it('passes when t() gate is within ±6 lines', () => {
    const src = `const label = t('calculate');\n\n\n\n<Button>Calculate Now</Button>`;
    expect(checkButtons(src)).toHaveLength(0);
  });
  it('ignores Turkish-looking text', () => {
    expect(checkButtons(`<Button>Hesapla Şimdi</Button>`)).toHaveLength(0);
  });
});

describe('audit-tr-coverage: placeholder', () => {
  it('flags EN-only placeholder literal', () => {
    expect(checkPlaceholders(`<Input placeholder="Enter amount" />`)).toHaveLength(1);
  });
  it('ignores {expression} placeholders', () => {
    expect(checkPlaceholders(`<Input placeholder={t('amount.ph')} />`)).toHaveLength(0);
  });
  it('passes near a TR gate', () => {
    const src = `// language === 'tr' branch above\n<Input placeholder="Enter amount" />`;
    expect(checkPlaceholders(src)).toHaveLength(0);
  });
});

describe('audit-tr-coverage: aria-label', () => {
  it('flags EN-only aria-label', () => {
    expect(checkAriaLabels(`<button aria-label="Close dialog" />`)).toHaveLength(1);
  });
  it('passes ternary aria-label', () => {
    expect(checkAriaLabels(`<button aria-label={language === 'tr' ? 'Kapat' : 'Close'} />`)).toHaveLength(0);
  });
});

describe('audit-tr-coverage: Breadcrumb labels', () => {
  it('flags raw EN label inside <Breadcrumb>', () => {
    const src = `<Breadcrumb items={[{ label: "Calculators", href: "/x" }]} />`;
    expect(checkBreadcrumbLabels(src)).toHaveLength(1);
  });
  it('ignores label keys outside a Breadcrumb', () => {
    expect(checkBreadcrumbLabels(`const x = { label: "Calculators" };`)).toHaveLength(0);
  });
  it('passes when TR gate is nearby', () => {
    const src = `const isTurkish = true;\n<Breadcrumb items={[{ label: "Calculators" }]} />`;
    expect(checkBreadcrumbLabels(src)).toHaveLength(0);
  });
});

describe('audit-tr-coverage: FAQ parity', () => {
  it('flags EN FAQ dataset missing TR sibling', () => {
    const src = `const faqDataEn = [{ question: "A?" }, { question: "B?" }];`;
    expect(checkFaqParity(src)).toEqual({ missingTr: true, mismatch: null });
  });
  it('flags FAQ EN/TR length mismatch', () => {
    const src = `
      const faqDataEn = [{ question: "A?" }, { question: "B?" }];
      const faqDataTr = [{ question: "A?" }];
    `;
    expect(checkFaqParity(src)).toEqual({ missingTr: false, mismatch: { en: 2, tr: 1 } });
  });
  it('passes when EN and TR have equal counts', () => {
    const src = `
      const faqDataEn = [{ question: "A?" }, { question: "B?" }];
      const faqDataTr = [{ question: "A?" }, { question: "B?" }];
    `;
    expect(checkFaqParity(src)).toEqual({ missingTr: false, mismatch: null });
  });
  it('skips files without FAQ data', () => {
    expect(checkFaqParity(`export const x = 1;`)).toEqual({ missingTr: false, mismatch: null });
  });
});
