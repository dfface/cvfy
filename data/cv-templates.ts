import type { Component } from 'vue'
import type { TemplateId } from '~/types/cvfy'
import CvPreviewClassic from '~/components/CvPreviewClassic.vue'
import CvPreviewOneColumn from '~/components/CvPreviewOneColumn.vue'
import CvPreviewTwoColumn from '~/components/CvPreviewTwoColumn.vue'

export interface CvTemplate {
  /** Template id, also used as the i18n key for its label. */
  id: TemplateId
  /** Component that renders the CV content inside `.cv`. */
  component: Component
  /** Classes applied to the `.cv` wrapper (padding, grid, ...). */
  wrapperClass: string
}

/**
 * Template registry. To add a new template:
 *   1. Add its id to `TEMPLATES` in `~/types/cvfy.ts`.
 *   2. Create the component and add an entry here.
 *   3. Add the translation key (same as the id) to every locale file.
 */
export const cvTemplates: CvTemplate[] = [
  {
    id: 'one-column',
    component: CvPreviewOneColumn,
    wrapperClass: 'p-10 flex flex-col gap-3',
  },
  {
    id: 'two-column',
    component: CvPreviewTwoColumn,
    wrapperClass: 'grid grid-cols-3',
  },
  {
    id: 'classic',
    component: CvPreviewClassic,
    wrapperClass: 'px-8 py-7 flex flex-col gap-3',
  },
]

export const cvTemplateMap = cvTemplates.reduce(
  (map, template) => {
    map[template.id] = template
    return map
  },
  {} as Record<TemplateId, CvTemplate>,
)

export const DEFAULT_TEMPLATE: TemplateId = 'classic'

/**
 * Returns the template config for the given id, falling back to the default
 * template when the id is missing or unknown (e.g. old stored settings).
 */
export function getCvTemplate(id?: TemplateId): CvTemplate {
  return cvTemplateMap[id as TemplateId] ?? cvTemplateMap[DEFAULT_TEMPLATE]
}
