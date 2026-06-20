/**
 * Shared section spacing tokens for retirement (and any other long-form)
 * pages. Use these instead of hand-rolled `py-*` so sibling sections share
 * one rhythm and parents never wrap them in a second padded container
 * (which is what creates double-gaps).
 *
 *   SECTION_Y        — standard vertical rhythm between top-level sections
 *   SECTION_Y_TIGHT  — first section after the interactive calculator,
 *                      where we want a smaller transition gap
 *   SECTION_CONTAINER — inner container (matches PageSection width="wide")
 *   SCROLL_ANCHOR_OFFSET — accounts for the 80px fixed nav (main pt-20)
 *                          so smooth-scroll/anchor jumps don't hide
 *                          headings under it.
 */
export const SECTION_Y = "py-16 md:py-20";
export const SECTION_Y_TIGHT = "pt-10 pb-14 md:pt-12 md:pb-16 lg:pb-20";
export const SECTION_CONTAINER = "container mx-auto px-6";
export const SCROLL_ANCHOR_OFFSET = "scroll-mt-24";
