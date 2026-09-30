<script setup lang="ts">
import { SectionNameList } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'
import { cvTemplates } from '~/data/cv-templates'
import { cvFonts } from '~/data/cv-fonts'

const {
  formSettings,
  uploadCV,
  clearForm,
  resetForm,
  addSkillGroup,
} = useCvState()
const switchLocalePath = useSwitchLocalePath()
const i18n = useI18n()
const { downloadPdf } = usePrint()

const config = {
  colors: [
    { name: 'indigo', color: '#4F46E5', darker: '#4338CA' },
    { name: 'violet', color: '#7C3AED', darker: '#6D28D9' },
    { name: 'sky', color: '#0284C7', darker: '#0369A1' },
    { name: 'teal', color: '#0D9488', darker: '#0F766E' },
    { name: 'rose', color: '#BE123C', darker: '#9F1239' },
    { name: 'amber', color: '#B45309', darker: '#92400E' },
    { name: 'slate', color: '#334155', darker: '#1E293B' },
    { name: 'blue', color: '#1E40AF', darker: '#1E3A8A' },
    { name: 'green', color: '#065F46', darker: '#064E3B' },
    { name: 'purple', color: '#5B21B6', darker: '#4C1D95' },
    { name: 'pink', color: '#9D174D', darker: '#831843' },
    { name: 'black', color: '#1F2937', darker: '#111827' },
  ],
  languages: [
    { name: 'es-name', code: 'es' },
    { name: 'en-name', code: 'en' },
    { name: 'id-name', code: 'id' },
    { name: 'fr-name', code: 'fr' },
    { name: 'zh-name', code: 'zh' },
    { name: 'de-name', code: 'de' },
    { name: 'ar-name', code: 'ar' },
    { name: 'pt-name', code: 'pt' },
  ],
}

watch(
  () => formSettings.value,
  (newValue, oldValue) => {
    localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify(newValue))
    if (newValue.activeColor !== oldValue.activeColor) {
      const newColor = getCurrentColor(newValue.activeColor)
      changeColor(newColor.color, newColor.darker)
    }
  },
  { deep: true },
)

const formSettingsHref = computed(() => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ formSettings: formSettings.value }),
  )}`
})

const availableLocales = computed(() => {
  return i18n.localeCodes.value.filter((locale: any) => !locale.includes('-'))
})

function changeColor(color: string, darker: string): void {
  formSettings.value.activeColor = color
  document.documentElement.style.setProperty('--primary', color)
  document.documentElement.style.setProperty('--primary-darker', darker)
}

function getCurrentColor(colorValue: string): {
  color: string
  darker: string
} {
  return (
    config.colors.find(color => color.color === colorValue)
    || config.colors[1]
  )
}

// Apply the stored accent color on load, otherwise the CSS default is used.
onMounted(() => {
  const currentColor = getCurrentColor(formSettings.value.activeColor)
  changeColor(currentColor.color, currentColor.darker)
})
</script>

<template>
  <div class="settings">
    <div class="flex justify-between items-center title pt-2 px-6">
      <LandingLogo />
    </div>
    <h2 class="flex flex-wrap text-xl/normal pt-10 px-6 tracking-wide uppercase">
      <span class="title__text">
        {{ $t("cv-settings") }}
      </span>
    </h2>
    <form
      class="form mb-10"
      autocomplete="on"
    >
      <div class="form__section px-6 py-3">
        <button
          class="form__btn form__btn--ghost"
          type="button"
          @click="resetForm"
        >
          {{ $t("reset-settings") }}
        </button>
        <button
          class="form__btn form__btn--ghost"
          type="button"
          @click="clearForm"
        >
          {{ $t("clear-settings") }}
        </button>
      </div>

      <!-- LANGUAGE -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("cv-language") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start w-full">
          <nuxt-link
            v-for="locale in availableLocales"
            :key="locale"
            class="form__btn form__btn--ghost"
            :to="switchLocalePath(locale)"
            :exact="true"
          >
            {{ $t(`${locale}-name`) }}
          </nuxt-link>
        </div>
      </fieldset>
      <!-- LANGUAGE -->

      <!-- LAYOUT -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("layout-theme") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start">
          <label
            v-for="cvTemplate in cvTemplates"
            :key="cvTemplate.id"
            tabindex="0"
            class="form__btn form__btn--ghost capitalize"
            :class="[
              {
                'form__btn--active':
                  cvTemplate.id === formSettings.layout,
              },
            ]"
          >
            {{ $t(cvTemplate.id) }}
            <input
              v-model="formSettings.layout"
              :value="cvTemplate.id"
              type="radio"
              class="sr-only"
            >
          </label>
        </div>
      </fieldset>
      <!-- LAYOUT -->

      <!-- COLOR THEME -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("color-theme") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start">
          <label
            v-for="color in config.colors"
            :key="color.color"
            tabindex="0"
            class="form__btn form__btn--color-theme capitalize"
            :class="[
              `form__btn--${color.name}`,
              {
                'form__btn--color-selected':
                  color.color === formSettings.activeColor,
              },
            ]"
            @keydown.enter="changeColor(color.color, color.darker)"
          >
            {{ $t(color.name) }}
            <input
              v-model="formSettings.activeColor"
              type="radio"
              class="sr-only"
              :value="color.color"
              @change="changeColor(color.color, color.darker)"
            >
          </label>
        </div>
      </fieldset>
      <!-- COLOR THEME -->

      <!-- FONT -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("font-theme") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start">
          <label
            v-for="font in cvFonts"
            :key="font.id"
            tabindex="0"
            class="form__btn form__btn--ghost"
            :class="[
              font.class,
              {
                'form__btn--active':
                  font.id === formSettings.fontFamily,
              },
            ]"
          >
            {{ $t(`font-${font.id}`) }}
            <input
              v-model="formSettings.fontFamily"
              :value="font.id"
              type="radio"
              class="sr-only"
            >
          </label>
        </div>
      </fieldset>
      <!-- FONT -->

      <!-- SECTION ORDER -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("section-order") }}
        </legend>
        <CvSectionOrder />
      </fieldset>
      <!-- SECTION ORDER -->

      <!-- PERSONAL DETAILS -->
      <fieldset class="form__section">
        <expansion-panel :panel-name="$t('personal-details')">
          <template #title>
            <legend class="form__legend">
              {{ $t("personal-details") }}
            </legend>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-x-3 gap-y-10">
              <div class="form__group col-span-full">
                <span class="form__label">📷 {{ $t("profile-image") }} </span>
                <CvProfileImageUploader
                  v-model="formSettings.profileImageDataUri"
                />
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="job-pos"
                >💼 {{ $t("job-title") }}</label>
                <input
                  id="job-pos"
                  v-model="formSettings.jobTitle"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="first-name"
                >👤 {{ $t("first-name") }}</label>
                <input
                  id="first-name"
                  v-model="formSettings.name"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="last-name"
                >👤 {{ $t("last-name") }}</label>
                <input
                  id="last-name"
                  v-model="formSettings.lastName"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="email"
                >✉️ {{ $t("email") }}</label>
                <input
                  id="email"
                  v-model="formSettings.email"
                  class="form__control"
                  type="email"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="location"
                >📍 {{ $t("location") }}</label>
                <input
                  id="location"
                  v-model="formSettings.location"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="phone"
                >📱 {{ $t("phone-number") }}</label>
                <input
                  id="phone"
                  v-model="formSettings.phoneNumber"
                  class="form__control"
                  type="tel"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="aboutme"
                >🌟 {{ $t("about-me") }}</label>
                <textarea
                  id="aboutme"
                  v-model="formSettings.aboutme"
                  class="form__control"
                  name="aboutme"
                  cols="30"
                  rows="10"
                />
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- PERSONAL DETAILS -->

      <!-- SKILLS -->
      <fieldset class="form__section grid gap-3">
        <expansion-panel :panel-name="$t('skills')">
          <template #title>
            <legend class="form__legend">
              {{ $t("skills") }}
            </legend>
          </template>
          <template #content>
            <div>
              <CvSkillGroupEditor
                v-for="group in (formSettings.skillGroups || [])"
                :key="group.id"
                :group="group"
              />
              <button
                class="form__btn"
                type="button"
                @click="addSkillGroup"
              >
                {{ $t("add-skill-group") }}
              </button>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SKILLS -->

      <!-- SOCIAL -->
      <fieldset class="form__section grid gap-3">
        <expansion-panel :panel-name="$t('social')">
          <template #title>
            <legend class="form__legend">
              {{ $t("social") }}
            </legend>
          </template>
          <template #content>
            <div>
              <CvDisplayCheckbox
                class="form__display-checkbox mb-3"
                :display-section="formSettings.displaySocial"
                section-name="social"
              />
              <!-- Sub-option of the toggle above: indented, same checkbox styling. -->
              <div
                v-if="formSettings.displaySocial"
                class="form__display-checkbox checkbox mb-10 pl-5"
              >
                <label class="checkbox__label">
                  <input
                    v-model="formSettings.displaySocialInHeader"
                    class="checkbox__input mr-2"
                    type="checkbox"
                  >
                  <span class="checkbox__text">{{ $t("social-in-header") }}</span>
                </label>
              </div>
              <div class="grid grid-cols-2 gap-x-3 gap-y-10">
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="linkedin"
                  >
                    <svg class="form__icon rounded mr-1">
                      <use href="@/assets/sprite.svg#linkedin" />
                    </svg>
                    Linkedin
                  </label>
                  <input
                    id="linkedin"
                    v-model="formSettings.linkedin"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="twitter"
                  >
                    <svg class="form__icon rounded mr-1">
                      <use href="@/assets/sprite.svg#twitter" />
                    </svg>
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    v-model="formSettings.twitter"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="github"
                  >
                    <svg class="form__icon mr-1">
                      <use href="@/assets/sprite.svg#github" />
                    </svg>
                    GitHub
                  </label>
                  <input
                    id="github"
                    v-model="formSettings.github"
                    class="form__control"
                    type="text"
                  >
                </div>
                <div class="form__group col-span-full">
                  <label
                    class="form__label flex"
                    for="website"
                  >
                    <svg class="form__icon mr-1">
                      <use href="@/assets/sprite.svg#website" />
                    </svg>
                    Website
                  </label>
                  <input
                    id="website"
                    v-model="formSettings.website"
                    class="form__control"
                    type="text"
                  >
                </div>
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SOCIAL -->

      <!-- HISTORY SECTIONS -->
      <CvSettingsHistorySection
        v-for="(value, key) in SectionNameList"
        :key="key"
        :section="key"
        :name="value"
      />
      <!-- HISTORY SECTIONS -->

      <!-- CTA -->
      <div class="form__section flex flex-col p-6 gap-3">
        <button
          type="button"
          class="form__btn flex flex-col justify-center"
          @click="downloadPdf"
        >
          <span>{{ $t("download-cv-pdf") }}</span>
        </button>
        <label
          tabindex="0"
          class="form__btn flex justify-center"
        >
          {{ $t("upload-cv") }} (JSON)
          <input
            type="file"
            accept=".json"
            name="uploadCV"
            class="hidden"
            @change="uploadCV"
          >
        </label>
        <a
          :href="formSettingsHref"
          rel="noopener"
          :download="`CV_${formSettings.name}_${formSettings.lastName}_${$i18n.locale}.json`"
          class="form__btn flex justify-center"
        >{{ $t("download-cv-settings") }}
          (JSON)</a>
      </div>
      <!-- CTA -->
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.settings {
  /*
   * `relative` makes this panel the containing block for the sr-only radio
   * inputs (`position: absolute`, no offsets). Otherwise their containing block
   * is the initial containing block, they escape this panel's `overflow-y-auto`
   * clipping, stretch the document and make the whole page scroll — and the
   * browser then scrolls the document to the focused radio on font switch.
   */
  @apply bg-slate-50 bg-opacity-100 shadow-lg font-bold z-10 relative;

  @media screen and (min-width: 1024px) {
    & {
      @apply overflow-y-auto;
    }
  }

  @media print {
    display: none;
    box-shadow: none;
    z-index: 0;
  }
}
</style>
