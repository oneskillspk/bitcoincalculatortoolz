import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadBlob, downloadTextFile } from '@/utils/downloadFile';

describe('downloadFile', () => {
  let created: string[];
  let revoked: string[];

  beforeEach(() => {
    vi.useFakeTimers();
    created = [];
    revoked = [];
    let n = 0;
    URL.createObjectURL = vi.fn(() => {
      const url = `blob:mock/${n++}`;
      created.push(url);
      return url;
    });
    URL.revokeObjectURL = vi.fn((url: string) => revoked.push(url));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('appends the anchor to the DOM before clicking (required by iOS Safari/WebView)', () => {
    let attachedDuringClick = false;
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        attachedDuringClick = document.body.contains(this);
      });

    downloadTextFile('a,b', 'test.csv', 'text/csv;charset=utf-8;');

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(attachedDuringClick).toBe(true);
    expect(document.querySelectorAll('a[download]').length).toBe(0);
  });

  it('sets the HTML5 download attribute with the descriptive filename', () => {
    let filename = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      filename = this.download;
    });
    downloadTextFile('x', 'bitcoin-dca-results-2026-05-24.csv', 'text/csv');
    expect(filename).toBe('bitcoin-dca-results-2026-05-24.csv');
  });

  it('does not revoke the object URL synchronously (would abort slow mobile downloads)', () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    downloadBlob(new Blob(['x']), 'a.csv');
    expect(revoked).toHaveLength(0);
    vi.advanceTimersByTime(4000);
    expect(revoked).toEqual(created);
  });

  it('keeps the URL alive for 60s when a fallback link is offered', () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const { url, revoke } = downloadBlob(new Blob(['x']), 'a.csv', { keepAliveForFallback: true });
    vi.advanceTimersByTime(30_000);
    expect(revoked).toHaveLength(0);
    vi.advanceTimersByTime(31_000);
    expect(revoked).toEqual([url]);
    revoke();
    expect(revoked).toHaveLength(1); // idempotent
  });
});
