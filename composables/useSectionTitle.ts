import { useI18n } from 'vue-i18n'
import { useCvState } from '~/data/useCvState'

/**
 * Resolve a CV section heading. Returns the user-provided override from
 * `formSettings.sectionTitles[key]` when set, otherwise the localized default.
 */
export function useSectionTitle() {
  const { t } = useI18n()
  const { formSettings } = useCvState()

  return (key: string): string => {
    const override = formSettings.value.sectionTitles?.[key]
    return override && override.trim() ? override : (t(key) as string)
  }
}
