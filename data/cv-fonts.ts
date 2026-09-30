import type { CvFontId } from '~/types/cvfy'

export interface CvFont {
  id: CvFontId
  /**
   * Tailwind font-family utility. Applied to the CV and reused on the picker
   * button so the option previews itself.
   */
  class: string
}

/**
 * Font options for the CV. Add an entry here plus a `font-cv-<id>` family in
 * `tailwind.config.ts` and a `font-<id>` translation to add a new one.
 */
export const cvFonts: CvFont[] = [
  { id: 'default', class: 'font-cv-default' },
  { id: 'sans', class: 'font-cv-sans' },
  { id: 'serif', class: 'font-cv-serif' },
  { id: 'garamond', class: 'font-cv-garamond' },
  { id: 'palatino', class: 'font-cv-palatino' },
  { id: 'baskerville', class: 'font-cv-baskerville' },
  { id: 'avenir', class: 'font-cv-avenir' },
  { id: 'trebuchet', class: 'font-cv-trebuchet' },
  { id: 'verdana', class: 'font-cv-verdana' },
  { id: 'optima', class: 'font-cv-optima' },
  { id: 'mono', class: 'font-cv-mono' },
  { id: 'courier', class: 'font-cv-courier' },
  { id: 'cjk-sans', class: 'font-cv-cjk-sans' },
  { id: 'cjk-serif', class: 'font-cv-cjk-serif' },
  { id: 'cjk-kai', class: 'font-cv-cjk-kai' },
  { id: 'cjk-fangsong', class: 'font-cv-cjk-fangsong' },
]

export function getCvFont(id?: CvFontId): CvFont {
  return cvFonts.find(font => font.id === id) ?? cvFonts[0]
}
