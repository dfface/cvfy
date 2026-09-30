<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

withDefaults(defineProps<{ asList?: boolean }>(), { asList: false })

const { formSettings } = useCvState()
</script>

<template>
  <!--
    The four social links. Rendered as bare `.cv__icon-wrapper` blocks by default
    (for the standalone section and the contact row) or wrapped in <li> when
    `asList` is set (the classic template's header is a <ul>).
  -->
  <component
    :is="asList ? 'li' : 'div'"
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
  </component>
  <component
    :is="asList ? 'li' : 'div'"
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
  </component>
  <component
    :is="asList ? 'li' : 'div'"
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
  </component>
  <component
    :is="asList ? 'li' : 'div'"
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
    >{{
      formSettings.website
    }}</a>
  </component>
</template>
