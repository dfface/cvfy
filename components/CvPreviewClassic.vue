<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import { hasRichTextContent, orderEvents } from '~/utils/functions'
import { type CvEvent, type CvSectionId, DEFAULT_SECTION_ORDER } from '~/types/cvfy'
import { useSectionTitle } from '~/composables/useSectionTitle'

const { formSettings } = useCvState()
const sectionTitle = useSectionTitle()

/**
 * Maps each section to its position so the flex column can re-order them
 * without touching the template structure.
 */
const sectionOrderMap = computed<Partial<Record<CvSectionId, number>>>(() => {
  const order = formSettings.value.sectionOrder ?? DEFAULT_SECTION_ORDER
  return order.reduce<Partial<Record<CvSectionId, number>>>(
    (map, id, index) => {
      map[id] = index
      return map
    },
    {},
  )
})

const workSorted = computed(() => orderEvents(formSettings.value.work))
const educationSorted = computed(() => orderEvents(formSettings.value.education))
const projectsSorted = computed(() => orderEvents(formSettings.value.projects))

const fullName = computed(() =>
  [formSettings.value.name, formSettings.value.lastName]
    .filter(Boolean)
    .join(' '),
)

/**
 * User defined skill groups, rendered on a single flowing line to save space.
 */
const skillGroups = computed(() =>
  (formSettings.value.skillGroups ?? []).filter(
    group => group.display !== false && group.values.length > 0,
  ),
)

const hasSocial = computed(
  () =>
    formSettings.value.displaySocial
    && Boolean(
      formSettings.value.linkedin
      || formSettings.value.twitter
      || formSettings.value.github
      || formSettings.value.website,
    ),
)

const displayProjects = computed(() => Boolean(formSettings.value.displayProjects))

/**
 * Resolves the work entry a project belongs to.
 * `parentId` set to an id wins; `null` means "keep it standalone";
 * when unset the project is auto-matched to the work entry whose period
 * contains the project start date, so generic data renders combined.
 */
function resolveParentId(project: CvEvent): string | null {
  if (project.parentId)
    return project.parentId
  if (project.parentId === null)
    return null

  const start = new Date(project.from).getTime()
  if (Number.isNaN(start))
    return null

  const match = workSorted.value.find((job) => {
    const jobFrom = new Date(job.from).getTime()
    const jobTo = job.current ? Date.now() : new Date(job.to).getTime()
    return !Number.isNaN(jobFrom) && start >= jobFrom && start <= jobTo
  })
  return match ? match.id : null
}

/** Projects attached to a given work entry. */
function projectsOf(workId: string) {
  if (!displayProjects.value)
    return []
  return projectsSorted.value.filter(project => resolveParentId(project) === workId)
}

/** Projects that stay on their own section. */
const standaloneProjects = computed(() => {
  if (!displayProjects.value)
    return []
  return projectsSorted.value.filter(project => resolveParentId(project) === null)
})

/**
 * Formats a date as `YYYY.MM`, matching the compact professional style.
 */
function formatPeriod(date: Date | string | null | undefined): string {
  if (!date)
    return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime()))
    return ''
  return `${parsed.getUTCFullYear()}.${String(parsed.getUTCMonth() + 1).padStart(2, '0')}`
}
</script>

<template>
  <header class="classic__header">
    <div class="classic__identity">
      <h2 class="classic__name">
        {{ fullName }}
      </h2>
      <p
        v-if="formSettings.jobTitle"
        class="classic__role"
      >
        {{ formSettings.jobTitle }}
      </p>
      <ul class="classic__contacts">
        <li
          v-if="formSettings.phoneNumber"
          class="cv__icon-wrapper"
        >
          <svg class="cv__icon">
            <use href="@/assets/sprite.svg#phone" />
          </svg>
          <a
            :href="`tel:${formSettings.phoneNumber}`"
            rel="noopener"
          >{{ formSettings.phoneNumber }}</a>
        </li>
        <li
          v-if="formSettings.email"
          class="cv__icon-wrapper"
        >
          <svg class="cv__icon">
            <use href="@/assets/sprite.svg#email" />
          </svg>
          <a
            :href="`mailto:${formSettings.email}`"
            rel="noopener"
          >{{ formSettings.email }}</a>
        </li>
        <li
          v-if="formSettings.location"
          class="cv__icon-wrapper"
        >
          <svg class="cv__icon">
            <use href="@/assets/sprite.svg#location" />
          </svg>
          <span>{{ formSettings.location }}</span>
        </li>
        <CvPreviewSocialLinks
          v-if="formSettings.displaySocial && formSettings.displaySocialInHeader"
          as-list
        />
      </ul>
      <p
        v-if="formSettings.aboutme"
        class="classic__about"
      >
        <span class="whitespace-pre-wrap">{{ formSettings.aboutme }}</span>
      </p>
    </div>
    <img
      v-if="formSettings.profileImageDataUri"
      class="classic__photo"
      :src="formSettings.profileImageDataUri ?? ''"
      alt="Your profile image"
    >
  </header>

  <section
    v-if="workSorted.length"
    class="classic__section"
    :style="{ order: sectionOrderMap.work ?? 99 }"
  >
    <h3 class="classic__section-title">
      {{ sectionTitle('experience') }}
    </h3>
    <ul class="classic__entries">
      <li
        v-for="job in workSorted"
        :key="job.id"
        class="classic__entry"
      >
        <div class="classic__entry-head">
          <span class="classic__company">
            <img
              v-if="job.logoDataUri"
              class="classic__company-logo"
              :src="job.logoDataUri"
              alt=""
            >
            <span class="classic__company-text">
              <span v-if="job.organization">{{ job.organization }}</span>
              <span
                v-if="job.location"
                class="classic__org-location"
              >({{ job.location }})</span>
            </span>
          </span>
          <h4 class="classic__entry-title">
            {{ job.title }}
          </h4>
          <span class="classic__entry-period">
            {{ formatPeriod(job.from) }}
            <template v-if="job.current"> - {{ $t("current") }}</template>
            <template v-else> - {{ formatPeriod(job.to) }}</template>
          </span>
        </div>

        <CvTextEditor
          v-if="hasRichTextContent(job.summary)"
          v-model="job.summary"
          :read-only="true"
          class="classic__desc"
        />

        <ul
          v-if="projectsOf(job.id).length"
          class="classic__subentries"
        >
          <li
            v-for="project in projectsOf(job.id)"
            :key="project.id"
            class="classic__subentry"
          >
            <div class="classic__subentry-head">
              <h5 class="classic__subentry-title">
                {{ project.title }}
              </h5>
              <CvPreviewProjectLink
                :title="project.title"
                :href="project.location"
              />
              <span
                v-if="project.displayDate"
                class="classic__entry-period"
              >
                {{ formatPeriod(project.from) }}
                <template v-if="project.current"> - {{ $t("current") }}</template>
                <template v-else> - {{ formatPeriod(project.to) }}</template>
              </span>
            </div>
            <CvTextEditor
              v-if="hasRichTextContent(project.summary)"
              v-model="project.summary"
              :read-only="true"
              class="classic__desc"
            />
          </li>
        </ul>
      </li>
    </ul>
  </section>

  <section
    v-if="standaloneProjects.length"
    class="classic__section"
    :style="{ order: sectionOrderMap.projects ?? 99 }"
  >
    <h3 class="classic__section-title">
      {{ sectionTitle('projects') }}
    </h3>
    <ul class="classic__entries">
      <li
        v-for="project in standaloneProjects"
        :key="project.id"
        class="classic__entry"
      >
        <div class="classic__entry-head classic__entry-head--split">
          <h4 class="classic__entry-title">
            {{ project.title }}
          </h4>
          <CvPreviewProjectLink
            :title="project.title"
            :href="project.location"
          />
          <span
            v-if="project.displayDate"
            class="classic__entry-period"
          >
            {{ formatPeriod(project.from) }}
            <template v-if="project.current"> - {{ $t("current") }}</template>
            <template v-else> - {{ formatPeriod(project.to) }}</template>
          </span>
        </div>
        <CvTextEditor
          v-if="hasRichTextContent(project.summary)"
          v-model="project.summary"
          :read-only="true"
          class="classic__desc"
        />
      </li>
    </ul>
  </section>

  <section
    v-if="skillGroups.length"
    class="classic__section"
    :style="{ order: sectionOrderMap.skills ?? 99 }"
  >
    <h3 class="classic__section-title">
      {{ sectionTitle('skills') }}
    </h3>
    <p class="classic__skills-inline">
      <span
        v-for="group in skillGroups"
        :key="group.id"
        class="classic__skill-group"
      >
        <span class="classic__skill-label">{{ group.label }}</span>
        <span>{{ group.values.join(" · ") }}</span>
      </span>
    </p>
  </section>

  <section
    v-if="formSettings.displayEducation && educationSorted.length"
    class="classic__section"
    :style="{ order: sectionOrderMap.education ?? 99 }"
  >
    <h3 class="classic__section-title">
      {{ sectionTitle('education') }}
    </h3>
    <ul class="classic__entries">
      <li
        v-for="edu in educationSorted"
        :key="edu.id"
        class="classic__entry"
      >
        <div class="classic__entry-head classic__entry-head--education">
          <span class="classic__company">
            <img
              v-if="edu.logoDataUri"
              class="classic__company-logo"
              :src="edu.logoDataUri"
              alt=""
            >
            <span class="classic__company-text">
              <span v-if="edu.organization">{{ edu.organization }}</span>
              <span
                v-if="edu.location"
                class="classic__org-location"
              >({{ edu.location }})</span>
            </span>
          </span>
          <h4 class="classic__entry-title">
            {{ edu.title }}<span
              v-if="edu.degree"
              class="classic__degree"
            >, {{ edu.degree }}</span>
          </h4>
          <span class="classic__honors">{{ (edu.honors || []).join(" ｜ ") }}</span>
          <span
            v-if="edu.displayDate"
            class="classic__entry-period"
          >
            {{ formatPeriod(edu.from) }}
            <template v-if="edu.current"> - {{ $t("current") }}</template>
            <template v-else> - {{ formatPeriod(edu.to) }}</template>
          </span>
        </div>
        <CvTextEditor
          v-if="hasRichTextContent(edu.summary)"
          v-model="edu.summary"
          :read-only="true"
          class="classic__desc"
        />
      </li>
    </ul>
  </section>

  <section
    v-if="hasSocial && !formSettings.displaySocialInHeader"
    class="classic__section"
    :style="{ order: sectionOrderMap.social ?? 99 }"
  >
    <h3 class="classic__section-title">
      {{ sectionTitle('social') }}
    </h3>
    <ul class="classic__contacts">
      <li
        v-if="formSettings.linkedin"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#linkedin-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://linkedin.com/in/${formSettings.linkedin}`"
        >{{ formSettings.linkedin }}</a>
      </li>
      <li
        v-if="formSettings.twitter"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#twitter-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://twitter.com/${formSettings.twitter}`"
        >{{ formSettings.twitter }}</a>
      </li>
      <li
        v-if="formSettings.github"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#github-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://github.com/${formSettings.github}`"
        >{{ formSettings.github }}</a>
      </li>
      <li
        v-if="formSettings.website"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#website" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="formSettings.website.includes('https') ? formSettings.website : `https://${formSettings.website}`"
        >{{ formSettings.website }}</a>
      </li>
    </ul>
  </section>
</template>

<style lang="postcss" scoped>
.classic__header {
  @apply flex justify-between items-start gap-5;
}

/* Type scale, strictly descending (do not invent intermediate values):
   name 1.3 > section title 1.05 > role 0.9 > company/position/date 0.86 >
   project name 0.82 > body 0.78 > meta (place, honors) 0.76 > contacts 0.74 */
.classic__name {
  font-size: 1.3rem;
  line-height: 1.15;
  @apply font-bold tracking-tight text-slate-900;
}

.classic__role {
  font-size: 0.9rem;
  line-height: 1.35;
  @apply font-semibold mt-0.5;
  color: var(--primary);
}

.classic__contacts {
  font-size: 0.74rem;
  line-height: 1.35;
  @apply flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-slate-600;
}

.classic__about {
  font-size: 0.78rem;
  line-height: 1.5;
  @apply mt-1.5 text-slate-600;
}

.classic__photo {
  @apply object-cover rounded ring-1 ring-slate-200 flex-shrink-0;
  width: 4.25rem;
  height: 5.5rem;
}

.classic__section-title {
  font-size: 1.05rem;
  line-height: 1.3;
  @apply font-bold tracking-wide text-slate-900 pb-0.5 mb-1 border-b border-slate-300;
  break-after: avoid;
}

.classic__entries {
  @apply flex flex-col gap-2;
}

.classic__entry {
  @apply flex flex-col gap-0.5;
  break-inside: avoid;
}

/* Company, position and dates share one row. The position stays centred — its
   column is sized to its own content and flanked by two equal spare columns —
   but the company column may now grow into whatever the position does not need.
   With three equal thirds the company was pinned to 1/3 and wrapped even when
   the row still had plenty of room to its right. */
.classic__entry-head {
  @apply grid items-center gap-x-3;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);

  &--split {
    @apply flex flex-wrap items-baseline gap-x-2;
  }

  /* Education adds a fourth column: school, major, honors, dates. */
  &--education {
    grid-template-columns: auto auto 1fr auto;
  }
}

.classic__entry-head--education .classic__entry-title {
  justify-self: start;
  text-align: left;
}

/* Flex (not the previous plain inline text) so the logo centres on real box
   geometry: with `vertical-align: middle` a logo taller than the 0.86rem line
   aligned to the baseline + x-height instead of the middle of the glyphs and
   visibly hung below the text. The name + place stay wrapped in
   `.classic__company-text` though: as two separate flex items a wrapping name
   pushed the place to the far edge of the column, leaving a gap. Keeping them
   as inline text inside that wrapper keeps the place glued to the name. */
.classic__company {
  font-size: 0.86rem;
  line-height: 1.35;
  @apply flex items-center font-bold text-slate-900;
}

.classic__company-logo {
  @apply flex-shrink-0 rounded object-contain;
  width: 1.15rem;
  height: 1.15rem;
  margin-right: 0.375rem;
}

/* The place is a secondary detail of the organization: 公司名（上海） */
.classic__org-location {
  font-size: 0.76rem;
  @apply font-normal text-slate-600 whitespace-nowrap;
  margin-left: 0.3em;
}

.classic__entry-title {
  font-size: 0.86rem;
  line-height: 1.35;
  @apply font-bold text-slate-900;
  justify-self: center;
  text-align: center;
}

/* The degree is a secondary detail of the major: 专业, Bachelor */
.classic__degree {
  font-size: 0.76rem;
  @apply font-normal text-slate-600;
}

/* Education only. The honors live in the flexible column between the major and
   the dates, so they are centred in the space that is left over instead of
   being glued to the major with a large gap after them. */
.classic__honors {
  font-size: 0.76rem;
  line-height: 1.35;
  @apply text-center font-normal text-slate-600;
}

.classic__entry-period {
  font-size: 0.86rem;
  line-height: 1.35;
  @apply ml-auto whitespace-nowrap font-bold text-slate-900 tabular-nums;
}

/*
 * `.classic__desc` is not written in this template: it is handed to
 * <CvTextEditor> and TipTap applies it to the contenteditable element it
 * creates. A plain scoped selector (`.classic__desc[data-v-*]`) therefore never
 * matched it, so the summary was never 0.78rem and fell back to the inherited
 * 14px — larger than the entry and project titles above it. `:deep()` reaches
 * that injected element so the type scale actually applies:
 * company/position 0.86 > project name 0.82 > body 0.78.
 */
:deep(.classic__desc) {
  font-size: 0.78rem;
  font-weight: 400;
  line-height: 1.5;
}

:deep(.classic__desc ul),
:deep(.classic__desc ol) {
  @apply m-0;
  padding-left: 1rem;
  list-style-type: square;
}

:deep(.classic__desc ul ul) {
  list-style-type: circle;
}

:deep(.classic__desc li),
:deep(.classic__desc p) {
  @apply m-0;
}

.classic__subentries {
  @apply flex flex-col gap-1.5 mt-1;
}

.classic__subentry {
  @apply flex flex-col gap-0.5;
}

.classic__subentry-head {
  @apply flex flex-wrap items-center gap-x-2 gap-y-0.5;
}

.classic__subentry-title {
  font-size: 0.82rem;
  line-height: 1.4;
  @apply inline-block px-1.5 py-px rounded font-bold flex-shrink-0;
  color: var(--primary);
  background-color: #f1f5f9;
  background-color: color-mix(in srgb, var(--primary) 12%, white);
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

.classic__skills-inline {
  font-size: 0.76rem;
  line-height: 1.6;
  @apply text-slate-700;
}

.classic__skill-group:not(:last-child)::after {
  content: '｜';
  @apply text-slate-300;
  margin: 0 0.5rem;
}

.classic__skill-label {
  @apply font-bold mr-1;
  color: var(--primary);
}
</style>
