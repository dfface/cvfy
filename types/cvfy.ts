export const LEVELS = [
  'elementary',
  'limited-working',
  'professional-working',
  'full-professional',
  'native-bilingual',
] as const

export type Level = (typeof LEVELS)[number]

/**
 * Available CV templates. The id is also the i18n key used as the label
 * in the settings panel and the filename of the template component.
 * Add a new id here + register it in `~/data/cv-templates.ts` + add a
 * translation key to the locale files to plug a new template in.
 */
export const TEMPLATES = ['one-column', 'two-column', 'classic'] as const

export type TemplateId = (typeof TEMPLATES)[number]

export interface Cv {
  layout?: TemplateId
  profileImageDataUri?: string | null
  jobTitle: string
  name: string
  lastName: string
  email: string
  location: string
  phoneNumber: string
  aboutme: string
  jobSkills: string[]
  displayJobSkills?: boolean
  softSkills: string[]
  displaySoftSkills?: boolean
  languages: { lang: string, level: Level }[]
  displayLanguages?: boolean
  interests: string[]
  displayInterests?: boolean
  /** Preferred, user defined skill groups. Legacy fields above are migrated on load. */
  skillGroups?: SkillGroup[]
  linkedin: string
  twitter: string
  github: string
  website: string
  education: CvEvent[]
  work: CvEvent[]
  projects: CvEvent[]
  displaySocial: boolean
  /** When true, the social links render inline in the personal-info header
   *  (right after the location) instead of as their own section. */
  displaySocialInHeader?: boolean
  displayEducation: boolean
  displayProjects: boolean
  activeColor: string
  /** Font used to render the CV (the settings panel keeps the app font). */
  fontFamily?: CvFontId
  /** Rendering order of the sections. Missing ids are appended automatically. */
  sectionOrder?: CvSectionId[]
}
/**
 * A user defined skill group: an editable label plus a list of skills.
 * Replaces the previously hard-coded groups (technical / soft / languages /
 * interests) so users can add, rename and remove their own groups.
 */
export interface SkillGroup {
  id: string
  label: string
  values: string[]
  display?: boolean
}

export interface CvEvent {
  id: string
  /**
   * The organization: company for a work entry, school for an education entry.
   * `location` is reserved for the actual place (city / country).
   */
  organization?: string
  title: string
  location: string
  from: Date | any
  to: Date | any
  displayDate: boolean
  current: boolean
  summary: string
  /**
   * Optional link to a parent entry. Used by projects to be rendered nested
   * under a work experience (the "company > projects" layout). When empty the
   * entry is rendered as a standalone section entry.
   */
  parentId?: string | null
  /** Optional logo (data URI) shown before the company / school name. */
  logoDataUri?: string | null
  /**
   * Honors, awards or certificates rendered inline (mainly for education),
   * so a single line can replace the full description.
   */
  honors?: string[]
  /**
   * Academic degree for education entries (e.g. Bachelor, Master, PhD),
   * rendered inline right after the major on the same line.
   */
  degree?: string
}

/**
 * Sections that can be reordered (everything except the personal info header).
 */
/** Selectable CV fonts (see `~/data/cv-fonts.ts`). */
export const CV_FONTS = [
  'default',
  'sans',
  'serif',
  'garamond',
  'palatino',
  'baskerville',
  'avenir',
  'trebuchet',
  'verdana',
  'optima',
  'mono',
  'courier',
  'cjk-sans',
  'cjk-serif',
  'cjk-kai',
  'cjk-fangsong',
] as const

export type CvFontId = (typeof CV_FONTS)[number]

export type CvSectionId = 'work' | 'projects' | 'skills' | 'education' | 'social'

export const DEFAULT_SECTION_ORDER: CvSectionId[] = [
  'work',
  'projects',
  'skills',
  'education',
  'social',
]

export type OptionalSection = 'displaySocial' | 'displayEducation' | 'displayProjects'

export type SkillType =
  'jobSkills' |
  'softSkills' |
  'languages' |
  'interests'

export interface LanguagesSkill {
  skill: { lang: string, level: Level }
  skillType: 'languages'
}
export interface DefaultSkill {
  skill: string
  skillType: Exclude<SkillType, 'languages'>
}

export type Skill = DefaultSkill['skill'] | LanguagesSkill['skill']

export const SectionNameList = {
  work: 'experience',
  education: 'education',
  projects: 'projects',
} as const
export type SectionName = keyof typeof SectionNameList
