import React from 'react';
import { ShareExportPanel } from './ShareExportPanel';
import { useShareExport } from './useShareExport';
import type { ShareParams } from '@/utils/shareLink';

interface QuickShareLinkPanelProps {
  slug: string;
  headline: string;
  params?: ShareParams;
  className?: string;
}

/**
 * Lightweight always-visible Copy-link panel for calculators that don't yet
 * have a full export report. Renders the canonical ShareExportPanel with a
 * single Copy-link action so the share audit finds a proper panel.
 */
export const QuickShareLinkPanel = React.memo(({ slug, headline, params = {}, className }: QuickShareLinkPanelProps) => {
  const { copied, copyLink } = useShareExport({ slug, headline, params });
  return (
    <ShareExportPanel
      className={className}
      actions={[{ kind: 'copy-link', onClick: copyLink, copied }]}
    />
  );
});

QuickShareLinkPanel.displayName = 'QuickShareLinkPanel';
