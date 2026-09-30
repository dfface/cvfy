<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import { useSectionTitle } from '~/composables/useSectionTitle'

const { formSettings } = useCvState()
const sectionTitle = useSectionTitle()

const skillGroups = computed(() =>
  (formSettings.value.skillGroups ?? []).filter(
    group => group.display !== false && group.values.length > 0,
  ),
)
</script>

<template>
  <section
    v-if="skillGroups.length"
    class="cv__section"
  >
    <h4
      class="cv__section-title"
      :class="formSettings.layout === 'one-column' ? 'cv__section-title--main' : 'sr-only'"
    >
      {{ sectionTitle('skills') }}
    </h4>
    <CvPreviewSkill
      v-for="group in skillGroups"
      :key="group.id"
      :skill-name="group.label"
      :display="true"
      :skills="group.values"
      :with-tags="formSettings.layout === 'two-column'"
    />
  </section>
</template>
