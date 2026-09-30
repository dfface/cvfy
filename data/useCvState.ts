import { reactive, toRefs } from 'vue'
import {
  cvSettingTemplate,
  cvSettingsEmptyTemplate,
} from './example-cv-settings'
import {
  type Cv,
  type CvEvent,
  type CvSectionId,
  type DefaultSkill,
  type LanguagesSkill,
  type SectionName,
  type SkillGroup,
  DEFAULT_SECTION_ORDER,
  SectionNameList,
  CV_FONTS,
} from '~/types/cvfy'

/** Fresh, empty skill groups used when a CV has no skills at all. */
function createEmptySkillGroups(): SkillGroup[] {
  return [
    { id: crypto.randomUUID(), label: '', values: [], display: true },
  ]
}

const state = reactive({
  formSettings: { ...cvSettingsEmptyTemplate } as Cv,
  isLoading: true,
  isProfilePhotoLoading: false,
})

export function useCvState() {
  const i18n = useI18n()

  function setUpCvSettings(): void {
    const locale = `cvSettings-${i18n.locale.value}`
    const cvSettings = localStorage.getItem(locale)

    if (cvSettings == null) {
      state.formSettings = {
        ...cvSettingTemplate,
      }
    }
    else {
      const cvSettingsObj = JSON.parse(cvSettings)
      state.formSettings = { ...cvSettingsEmptyTemplate, ...cvSettingsObj }
    }
    prepareSettings(state.formSettings)
    localStorage.setItem(locale, JSON.stringify(state.formSettings))
    state.isLoading = false
  }

  /** Applies the one-off migrations needed by older stored CVs. */
  function prepareSettings(formSettings: Cv): void {
    patchId(formSettings)
    patchDisplayDate(formSettings)
    patchOrganization(formSettings)
    patchFontFamily(formSettings)
    patchSectionOrder(formSettings)
    migrateSkillGroups(formSettings)
  }

  /** Falls back to the default font when unset or unknown. */
  function patchFontFamily(formSettings: Cv): void {
    if (!formSettings.fontFamily || !CV_FONTS.includes(formSettings.fontFamily))
      formSettings.fontFamily = 'default'
  }

  /** Keeps the section order valid: stored order first, missing ids appended. */
  function patchSectionOrder(formSettings: Cv): void {
    const stored = (formSettings.sectionOrder ?? []).filter(id =>
      DEFAULT_SECTION_ORDER.includes(id),
    )
    formSettings.sectionOrder = [
      ...new Set<CvSectionId>([...stored, ...DEFAULT_SECTION_ORDER]),
    ]
  }

  /**
   * Work and education entries used to keep the company / school in the
   * `location` field. Move it to the dedicated `organization` field and let
   * `location` mean the actual place again. Projects store a link in
   * `location`, so they are left untouched.
   */
  function patchOrganization(formSettings: Cv): void {
    for (const section of ['work', 'education'] as const) {
      for (const entry of formSettings[section]) {
        if (!entry.organization && entry.location) {
          entry.organization = entry.location
          entry.location = ''
        }
      }
    }
  }

  /**
   * Older CVs stored skills in four hard-coded fields. When no `skillGroups`
   * exist yet, convert them into editable groups (translated once).
   */
  function migrateSkillGroups(formSettings: Cv): void {
    if (formSettings.skillGroups && formSettings.skillGroups.length > 0)
      return

    const legacy = [
      { labelKey: 'technical-skills', display: formSettings.displayJobSkills, values: formSettings.jobSkills },
      { labelKey: 'soft-skills', display: formSettings.displaySoftSkills, values: formSettings.softSkills },
      {
        labelKey: 'languages',
        display: formSettings.displayLanguages,
        values: (formSettings.languages ?? []).map(lang => `${lang.lang}(${i18n.t(lang.level)})`),
      },
      { labelKey: 'interests', display: formSettings.displayInterests, values: formSettings.interests },
    ]

    const groups: SkillGroup[] = legacy
      .filter(item => (item.values?.length ?? 0) > 0)
      .map(item => ({
        id: crypto.randomUUID(),
        label: i18n.t(item.labelKey),
        values: [...item.values],
        display: item.display !== false,
      }))

    formSettings.skillGroups = groups.length > 0 ? groups : createEmptySkillGroups()
  }

  function addSkill<T extends LanguagesSkill | DefaultSkill>(e: T): void {
    if (e.skillType === 'languages') {
      if (e.skill.lang.trim() === '')
        return
      const newLang = e.skill
      const newLangIdx = state.formSettings.languages.findIndex(
        lang => lang.lang === newLang.lang,
      )
      if (newLangIdx < 0) {
        state.formSettings.languages = [
          ...new Set([
            ...state.formSettings.languages,
            { lang: e.skill.lang, level: e.skill.level },
          ]),
        ]
      }
    }
    else {
      if (e.skill.trim() === '')
        return
      state.formSettings[e.skillType] = [
        ...new Set([...state.formSettings[e.skillType], e.skill]),
      ]
    }
  }

  function removeSkill<T extends LanguagesSkill | DefaultSkill>(e: T): void {
    if (e.skillType === 'languages') {
      state.formSettings[e.skillType] = [
        ...state.formSettings[e.skillType].filter(
          skill => skill.lang !== e.skill.lang,
        ),
      ]
    }
    else {
      state.formSettings[e.skillType] = [
        ...state.formSettings[e.skillType].filter(skill => skill !== e.skill),
      ]
    }
  }

  function addEntry(e: { sectionName: SectionName }) {
    state.formSettings[e.sectionName].unshift({
      id: crypto.randomUUID(),
      title: '',
      location: '',
      from: new Date(),
      to: new Date(),
      current: false,
      summary: '',
      degree: '',
      displayDate: e.sectionName !== 'education',
    })
  }

  function removeEntry(e: { sectionName: SectionName, entry: CvEvent }) {
    state.formSettings[e.sectionName] = state.formSettings[
      e.sectionName
    ].filter(entry => entry.id !== e.entry.id)
  }

  function uploadCV(e: any): void {
    const fr = new FileReader()
    fr.onload = (e: any) => {
      const data = JSON.parse(e.target.result)
      state.formSettings = {
        ...cvSettingsEmptyTemplate,
        ...data.formSettings,
      }
      prepareSettings(state.formSettings)
    }
    fr.readAsText(e.target.files[0])
  }

  function resetForm(): void {
    state.formSettings = {
      ...cvSettingTemplate,
    }
    prepareSettings(state.formSettings)
    localStorage.setItem(
      `cvSettings-${i18n.locale.value}`,
      JSON.stringify(state.formSettings),
    )
  }

  function clearForm(): void {
    state.formSettings = { ...cvSettingsEmptyTemplate }
    prepareSettings(state.formSettings)
    localStorage.removeItem(`cvSettings-${i18n.locale.value}`)
  }

  function addSkillGroup(): void {
    state.formSettings.skillGroups = [
      ...(state.formSettings.skillGroups ?? []),
      { id: crypto.randomUUID(), label: '', values: [], display: true },
    ]
  }

  function removeSkillGroup(id: string): void {
    state.formSettings.skillGroups = (state.formSettings.skillGroups ?? []).filter(
      group => group.id !== id,
    )
  }

  function changeDisplaySection(e: {
    sectionName: string
    status: boolean
  }): void {
    const propName = `display${e.sectionName
      .slice(0, 1)
      .toUpperCase()}${e.sectionName.slice(1)}` as
      | 'displayEducation'
      | 'displayProjects'
      | 'displayJobSkills'
      | 'displaySoftSkills'
      | 'displayLanguages'
    state.formSettings[propName] = e.status
  }

  function patchId(formSettings: Cv) {
    // Make sure that older cvs have id in each entry of a section
    for (const key in SectionNameList) {
      const section = key as SectionName
      for (const e of formSettings[section]) {
        if (!e.id) {
          e.id = crypto.randomUUID()
        }
      }
    }
  }

  function patchDisplayDate(formSettings: Cv) {
    // Make sure that older cvs have the correct default displayDate
    for (const key in SectionNameList) {
      const section = key as SectionName
      for (const e of formSettings[section]) {
        if (e.displayDate == null) {
          e.displayDate = section !== 'education'
        }
      }
    }
  }

  return {
    ...toRefs(state),
    setUpCvSettings,
    addSkill,
    removeSkill,
    addEntry,
    removeEntry,
    uploadCV,
    resetForm,
    clearForm,
    changeDisplaySection,
    addSkillGroup,
    removeSkillGroup,
  }
}
