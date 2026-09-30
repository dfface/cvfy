<script setup lang="ts">
import type { CvSectionId } from '~/types/cvfy'
import { DEFAULT_SECTION_ORDER } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
const { t } = useI18n()

const LABEL_KEYS: Record<CvSectionId, string> = {
  work: 'experience',
  projects: 'projects',
  skills: 'skills',
  education: 'education',
  social: 'social',
}

/**
 * `sectionOrder` is only filled in once the stored CV has been loaded on the
 * client, so fall back to the default order to render the list during SSR too
 * (otherwise the box is empty until hydration).
 */
const sections = computed<CvSectionId[]>(() => {
  const order = formSettings.value.sectionOrder
  return order && order.length > 0 ? order : DEFAULT_SECTION_ORDER
})

function swap(index: number, offset: number): void {
  const target = index + offset
  if (target < 0 || target >= sections.value.length)
    return
  const ordered = [...sections.value]
  ordered[index] = sections.value[target]
  ordered[target] = sections.value[index]
  formSettings.value.sectionOrder = ordered
}

// Drag and drop support (mouse), the buttons below cover keyboard use.
const parentEl = ref<HTMLElement>()
const prefix = 'section-order-'
const dragList = ref<string[]>(sections.value.map(id => `${prefix}${id}`))

watch(sections, (value) => {
  dragList.value = value.map(id => `${prefix}${id}`)
}, { deep: true })

useDrag(parentEl, dragList, {
  onDrop() {
    formSettings.value.sectionOrder = dragList.value.map(
      id => (id.startsWith(prefix) ? id.slice(prefix.length) : id),
    ) as CvSectionId[]
  },
})
</script>

<template>
  <ul
    ref="parentEl"
    class="section-order"
  >
    <li
      v-for="(id, index) in sections"
      :id="`${prefix}${id}`"
      :key="id"
      draggable="true"
      class="section-order__item form__btn"
    >
      <span class="section-order__label">{{ t(LABEL_KEYS[id]) }}</span>
      <span class="section-order__actions">
        <button
          type="button"
          class="section-order__btn"
          :disabled="index === 0"
          :aria-disabled="index === 0"
          :aria-label="`${$t('move-up')} ${t(LABEL_KEYS[id])}`"
          @click="swap(index, -1)"
        >
          ↑
        </button>
        <button
          type="button"
          class="section-order__btn section-order__btn--down"
          :disabled="index === sections.length - 1"
          :aria-disabled="index === sections.length - 1"
          :aria-label="`${$t('move-down')} ${t(LABEL_KEYS[id])}`"
          @click="swap(index, 1)"
        >
          ↓
        </button>
      </span>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
.section-order {
  @apply flex flex-col gap-2 w-full;

  &__item {
    @apply flex justify-between items-center text-left m-0 px-2 py-1;

    &[draggable] {
      @apply cursor-move select-none;
    }
  }

  &__actions {
    @apply flex items-center gap-1 flex-shrink-0;
  }

  &__btn {
    @apply bg-transparent shadow-none p-0 m-0 text-white text-base/normal leading-none;
    width: 1.25rem;
    height: 1.25rem;

    &:disabled {
      @apply opacity-40 cursor-not-allowed;
    }
  }
}
</style>
