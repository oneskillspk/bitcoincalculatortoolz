/**
 * Phase D — Share/Export singularity guard.
 *
 * Asserts the consolidated <ShareExportPanel> exposes its `data-share-export-panel`
 * root attribute so future tests (and a CI walker) can verify pages mount at
 * most one panel. Defends the contract in src/components/share-export/README.md.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ShareExportPanel } from '@/components/share-export';

function renderPanel(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('ShareExportPanel singularity contract', () => {
  it('card variant marks itself with data-share-export-panel="card"', () => {
    const { container } = renderPanel(
      <ShareExportPanel actions={[{ kind: 'copy-link', onClick: () => {} }]} />,
    );
    const roots = container.querySelectorAll('[data-share-export-panel]');
    expect(roots).toHaveLength(1);
    expect(roots[0].getAttribute('data-share-export-panel')).toBe('card');
  });

  it('inline variant marks itself with data-share-export-panel="inline"', () => {
    const { container } = renderPanel(
      <ShareExportPanel variant="inline" actions={[{ kind: 'twitter', onClick: () => {} }]} />,
    );
    const roots = container.querySelectorAll('[data-share-export-panel]');
    expect(roots).toHaveLength(1);
    expect(roots[0].getAttribute('data-share-export-panel')).toBe('inline');
  });
});
