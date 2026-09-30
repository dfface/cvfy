<script setup lang="ts">
import type { SkillGroup } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'

const props = defineProps<{ group: SkillGroup }>()

const { removeSkillGroup } = useCvState()
</script>

<template>
  <div class="form__group skill-group">
    <div class="skill-group__header">
      <input
        v-model="props.group.label"
        class="form__control skill-group__name"
        type="text"
        :placeholder="$t('group-name')"
        :aria-label="$t('group-name')"
      >
      <label class="form__label skill-group__display">
        <input
          v-model="props.group.display"
          class="form__control form__control--checkbox"
          type="checkbox"
        >
        {{ $t("display-section") }}
      </label>
      <button
        class="form__btn form__btn--delete skill-group__remove"
        type="button"
        :aria-label="$t('remove-group')"
        @click="removeSkillGroup(props.group.id)"
      >
        <svg class="form__icon">
          <use href="@/assets/sprite.svg#trash" />
        </svg>
      </button>
    </div>
    <CvTagsInput
      v-model="props.group.values"
      :label="$t('group-name')"
    />
  </div>
</template>

<style lang="postcss" scoped>
.skill-group {
  @apply p-3 mb-3 rounded bg-white shadow-sm;

  &__header {
    @apply flex flex-wrap items-center gap-x-3 gap-y-1;
  }

  &__name {
    @apply flex-1 font-bold;
    min-width: 8rem;
  }

  &__display {
    @apply flex items-center whitespace-nowrap mb-0;
  }

  &__remove {
    @apply flex flex-col justify-center m-0;
  }
}
</style>
