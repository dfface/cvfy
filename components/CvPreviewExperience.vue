<script lang="ts" setup>
import useFormatDate from '~/composables/useFormatDate'
import { hasRichTextContent, orderEvents } from '~/utils/functions'
import { useCvState } from '~/data/useCvState'
import { useSectionTitle } from '~/composables/useSectionTitle'

const { formSettings } = useCvState()
const sectionTitle = useSectionTitle()

const formatDate = useFormatDate()

const workSorted = computed(() => {
  return orderEvents(formSettings.value.work)
})
</script>

<template>
  <section class="cv__section cv__section--main w-full">
    <h4 class="cv__section-title cv__section-title--main">
      {{ sectionTitle('experience') }}
    </h4>
    <ul class="cv__event">
      <li
        v-for="job in workSorted"
        :key="job.id"
      >
        <div class="grid grid-cols-3 gap-3">
          <h5 class="cv__section-title cv__section-title--sm">
            {{ job.title }}
          </h5>
          <span class="justify-self-center">{{ job.organization }}</span>
          <span class="justify-self-end">
            {{ formatDate(job.from) }} –
            <template v-if="job.current">
              {{ $t("current") }}
            </template>
            <template v-else>
              {{ formatDate(job.to) }}
            </template>
          </span>
        </div>
        <CvTextEditor
          v-if="hasRichTextContent(job.summary)"
          v-model="job.summary"
          :read-only="true"
          class="cv__desc"
        />
      </li>
    </ul>
  </section>
</template>
