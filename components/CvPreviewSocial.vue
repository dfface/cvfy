<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import { useSectionTitle } from '~/composables/useSectionTitle'

const { formSettings } = useCvState()
const sectionTitle = useSectionTitle()
</script>

<template>
  <section
    v-if="formSettings.displaySocial && !formSettings.displaySocialInHeader"
    class="cv__section"
  >
    <h4
      class="cv__section-title"
      :class="formSettings.layout === 'one-column' && 'sr-only'"
    >
      {{ sectionTitle('social') }}
    </h4>
    <div
      class="flex"
      :class="formSettings.layout === 'one-column' ? 'flex-row flex-wrap gap-2' : 'flex-col'"
    >
      <CvPreviewSocialLinks />
    </div>
  </section>
</template>
