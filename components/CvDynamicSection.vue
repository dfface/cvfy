<script setup lang="ts">
import type { CvEvent, SectionName } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'

const { sectionName, entries = [] } = defineProps<{
  sectionName: SectionName
  entries: CvEvent[]
}>()
const { formSettings, addEntry, removeEntry } = useCvState()

/**
 * Display name of an entry: the organization (company / school) when set,
 * otherwise the title (position, major or project name).
 */
function entryName(entry: CvEvent): string {
  return entry.organization?.trim() || entry.title?.trim() || ''
}

function focusEditor(id: string) {
  const editorElem = document.getElementById(`${id}-editor`)
  if (editorElem)
    editorElem.focus()
}
</script>

<template>
  <div
    v-if="sectionName"
    class="dynamic-section"
  >
    <button
      class="form__btn col-span-full"
      type="button"
      @click="addEntry({ sectionName })"
    >
      {{ $t("add") }} {{ $t(sectionName) }}
    </button>
    <ul class="col-span-full">
      <li
        v-for="entry in entries"
        :key="entry.id"
      >
        <expansion-panel
          :panel-name="entryName(entry)"
          class="mb-3"
        >
          <template #title>
            <h3 class="form__legend form__legend--small dynamic-section__title">
              <span>
                {{ entryName(entry) }}
              </span>
            </h3>
          </template>
          <template #action-button>
            <button
              :aria-label="`Remove ${entryName(entry)} ${$t(sectionName)} from CV`"
              type="button"
              class="form__btn form__btn--delete mr-3"
              @click.stop="removeEntry({ sectionName, entry })"
            >
              <svg class="form__icon">
                <use href="@/assets/sprite.svg#trash" />
              </svg>
            </button>
          </template>
          <template #content>
            <div class="dynamic-section">
              <div
                v-if="sectionName !== 'projects'"
                class="form__group col-span-full"
              >
                <label
                  class="form__label"
                  :for="`entryOrganization-${entry.id}`"
                >
                  <template v-if="sectionName === 'education'">🏫 {{ $t("school") }}</template>
                  <template v-else>🏢 {{ $t("company") }}</template>
                </label>
                <input
                  :id="`entryOrganization-${entry.id}`"
                  v-model="entry.organization"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryTitle--${entry.id}`"
                >
                  <template v-if="sectionName === 'education'">🎓 {{ $t("major") }}</template>
                  <template v-else-if="sectionName === 'projects'">✨ {{ $t("title") }}</template>
                  <template v-else>💼 {{ $t("title") }}</template>
                </label>
                <input
                  :id="`entryTitle--${entry.id}`"
                  v-model="entry.title"
                  class="form__control"
                  type="text"
                >
              </div>
              <div
                v-if="sectionName === 'education'"
                class="form__group col-span-full"
              >
                <label
                  class="form__label"
                  :for="`entryDegree-${entry.id}`"
                >
                  🎓 {{ $t("degree") }}
                </label>
                <input
                  :id="`entryDegree-${entry.id}`"
                  v-model="entry.degree"
                  class="form__control"
                  type="text"
                >
              </div>
              <div
                v-if="sectionName !== 'projects'"
                class="form__group col-span-full"
              >
                <span class="form__label">
                  <template v-if="sectionName === 'education'">🎓</template>
                  <template v-else>🏢</template>
                  {{ $t("logo") }}
                </span>
                <CvImageUploader
                  v-model="entry.logoDataUri"
                  :label="$t('upload-logo')"
                />
              </div>
              <div
                v-if="sectionName === 'projects'"
                class="form__group col-span-full"
              >
                <label
                  class="form__label"
                  :for="`entryParent-${entry.id}`"
                >🏢 {{ $t("belongs-to") }}</label>
                <select
                  :id="`entryParent-${entry.id}`"
                  v-model="entry.parentId"
                  class="form__control"
                >
                  <option :value="undefined">
                    {{ $t("auto-parent") }}
                  </option>
                  <option :value="null">
                    {{ $t("no-parent") }}
                  </option>
                  <option
                    v-for="job in formSettings.work"
                    :key="job.id"
                    :value="job.id"
                  >
                    {{ entryName(job) }}<template v-if="job.location"> · {{ job.location }}</template>
                  </option>
                </select>
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >
                  <template v-if="sectionName === 'projects'">
                    🔗 Link
                  </template>
                  <template v-else>
                    📍 {{ $t("location") }}
                  </template>
                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.location"
                  class="form__control"
                  type="text"
                >
              </div>
              <div
                v-if="sectionName === 'education'"
                class="form__group col-span-full"
              >
                <span class="form__label">🏅 {{ $t("honors") }}</span>
                <CvTagsInput
                  v-model="entry.honors"
                  :label="$t('honors')"
                />
              </div>
              <div class="form__group col-span-full">
                <div class="form__label flex justify-between">
                  <label :for="`entryFrom-${entry.id}`">
                    📆 {{ $t("from") }}
                  </label>
                  <label v-if="sectionName !== 'work'" class="form__label flex items-center">
                    <input
                      v-model="entry.displayDate"
                      class="form__control form__control--checkbox"
                      type="checkbox"
                    >
                    {{ $t("show-date") }}
                  </label>
                </div>
                <input
                  :id="`entryFrom-${entry.id}`"
                  v-model="entry.from"
                  class="form__control"
                  type="date"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label flex justify-between"
                  :for="`entryTo-${entry.id}`"
                >
                  📆 {{ $t("to") }}
                  <label class="form__label flex items-center">
                    <input
                      v-model="entry.current"
                      class="form__control form__control--checkbox"
                      type="checkbox"
                    >
                    {{ $t("current") }}
                  </label>
                </label>
                <input
                  v-if="!entry.current"
                  :id="`entryTo-${entry.id}`"
                  v-model="entry.to"
                  class="form__control"
                  type="date"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entrySummary-${entry.id}`"
                  @click="focusEditor(`entrySummary-${entry.id}`)"
                >📝 {{ $t("summary")
                }}</label>
                <CvTextEditor
                  :id="`entrySummary-${entry.id}`"
                  v-model="entry.summary"
                  class="form__control"
                  :read-only="false"
                />
              </div>
            </div>
          </template>
        </expansion-panel>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.dynamic-section {
  @apply grid grid-cols-2 gap-x-3 gap-y-4;

  &__title {
    @apply flex items-center flex-row-reverse;
  }
}
</style>
