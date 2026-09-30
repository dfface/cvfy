<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    /** Placeholder / accessible name for the text input. */
    label?: string
  }>(),
  {
    modelValue: () => [],
    label: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void
}>()

const uid = useId()
// Unique DOM ids so drag & drop keeps working with several lists on the page.
const tagPrefix = `${uid}::`

const state = reactive({ input: '' })
const inputEmpty = computed(() => state.input.trim() === '')

function addTag() {
  const value = state.input.trim()
  if (!value)
    return
  if (!props.modelValue.includes(value))
    emit('update:modelValue', [...props.modelValue, value])
  state.input = ''
}

function removeTag(value: string) {
  emit('update:modelValue', props.modelValue.filter(tag => tag !== value))
}

// Drag and drop to reorder
const parentEl = ref<HTMLElement>()
const dragList = ref<string[]>(props.modelValue.map(value => `${tagPrefix}${value}`))

watch(
  () => props.modelValue,
  (values) => {
    dragList.value = (values ?? []).map(value => `${tagPrefix}${value}`)
  },
  { deep: true },
)

useDrag(parentEl, dragList, {
  onDrop() {
    emit(
      'update:modelValue',
      dragList.value.map(id => (id.startsWith(tagPrefix) ? id.slice(tagPrefix.length) : id)),
    )
  },
})
</script>

<template>
  <div class="tags-input">
    <div class="flex gap-3">
      <input
        :id="`${uid}-tags`"
        v-model="state.input"
        class="form__control mt-2 mb-1"
        type="text"
        :placeholder="label || $t('add')"
        :aria-label="label || $t('add')"
        @keyup.enter="addTag"
      >
      <button
        class="form__btn"
        type="button"
        :disabled="inputEmpty"
        :aria-disabled="inputEmpty"
        @click="addTag"
      >
        {{ $t("add") }}
      </button>
    </div>
    <ul
      ref="parentEl"
      class="tags"
    >
      <li
        v-for="value in modelValue"
        :id="`${tagPrefix}${value}`"
        :key="value"
        draggable="true"
        class="tags__tag form__btn"
      >
        <span class="tags__tag-text">{{ value }}</span>
        <button
          type="button"
          :aria-label="`${$t('remove')} ${value}`"
          @click="removeTag(value)"
        >
          <svg class="form__icon">
            <use href="@/assets/sprite.svg#close" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.tags {
  @apply flex flex-wrap gap-3 mt-3 text-xs/normal items-stretch w-full;

  &__tag {
    @apply flex justify-between items-end gap-3 m-0 px-2 py-1 h-fit;

    &[draggable] {
      @apply cursor-move select-none;
    }

    &:hover {
      background-color: var(--primary-darker);
    }
  }
}
</style>
