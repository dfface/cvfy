import type { CvEvent } from '~/types/cvfy'

export function orderEvents(arr: CvEvent[]): CvEvent[] {
  return [...arr].sort(
    (a, b) => new Date(b.from).getTime() - new Date(a.from).getTime(),
  )
}

/**
 * True when a rich-text HTML string actually holds visible text.
 * An "empty" Tiptap document is still `<p></p>` (truthy), which would
 * otherwise render an empty editor and add unwanted vertical spacing.
 */
export function hasRichTextContent(html?: string | null): boolean {
  if (!html)
    return false
  return (
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim().length > 0
  )
}
