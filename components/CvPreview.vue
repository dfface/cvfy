<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import { getCvTemplate } from '~/data/cv-templates'
import { getCvFont } from '~/data/cv-fonts'

const { formSettings, isLoading } = useCvState()

const cvTemplate = computed(() => getCvTemplate(formSettings.value.layout))
const cvFont = computed(() => getCvFont(formSettings.value.fontFamily))
</script>

<template>
  <div
    class="
    cvWrapper
    font-normal
    text-slate-800 text-sm/normal
    bg-white
    relative
    w-full
    overflow-y-auto
    overflow-x-hidden
    p-6
    flex
    flex-col
    items-center
    "
  >
    <div>
      <div
        tabindex="0"
        aria-label="CV preview"
        class="cv shadow-lg mt-6 bg-white relative"
        :class="[{ blur: isLoading }, cvTemplate.wrapperClass, cvFont.class]"
      >
        <component :is="cvTemplate.component" />
      </div>
    </div>

  </div>
</template>

<style lang="postcss" scoped>
p {
  @apply leading-normal;
}

.cvWrapper {
  @media print {
    position: unset;
    margin: 0;
    padding: 0;
    /* The on-screen container is a scroll area; printing it would clip content. */
    overflow: visible;

    & .cv {
      width: auto;
      height: auto;
      min-width: auto;
      /* Let the content define the height: a forced A4 min-height plus the
         page margin overflows onto a blank second page. */
      min-height: auto;
      margin: 0;
      border: none;
      padding: 0;
      /* Reset the on-screen preview zoom. */
      zoom: 1;
      box-shadow: none;
      /* Force colored backgrounds (badges, tags, accent bars) to be printed. */
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
}

.cv {
  --height: 29.69cm;
  width: 21cm;
  min-width: 21cm;
  max-width: 21cm;
  min-height: var(--height);
  word-break: break-word;
  /*
   * `zoom` instead of `transform: scale()` on purpose: a transform only scales
   * the painting, so the A4-sized layout box stays reserved inside the scroll
   * wrapper and leaves a blank gap below the preview. That gap grew whenever a
   * font change altered the content height. `zoom` scales the layout box too,
   * so no blank space is left behind.
   */
  zoom: 0.4;

  @media screen and (min-width: 425px) {
    zoom: 0.45;
  }

  @media screen and (min-width: 768px) {
    zoom: 0.8;
  }

  @media screen and (min-width: 1024px) {
    zoom: 0.7;
  }

  &__pages {
    position: absolute;
    right: -5%;
    left: -5%;
    background-image: linear-gradient(to right,
        grey 50%,
        rgba(255, 255, 255, 0) 0%);
    background-size: 20px 1px;
    background-repeat: repeat-x;

    @media print {
      display: none;
    }
  }

  :deep(&__section-title) {
    @apply text-base uppercase mb-1 font-bold tracking-wide;

    &--sm {
      @apply text-sm/normal mb-0;
      text-transform: none;

    }

    &--main {
      color: var(--primary);
    }
  }

  :deep(&__icon-wrapper) {
    @apply flex font-light gap-1 items-center;

    a,
    span {
      margin-top: 2px;
    }
  }

  :deep(&__icon) {
    @apply fill-current rounded;
    width: 16px;
    height: 16px;
    min-width: 16px;
  }

  :deep(&__list) {
    font-weight: 300;
    list-style: inside;

    ::marker {
      color: var(--primary);
    }
  }

  :deep(&__event) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.blur {
  filter: blur(5px);
  min-height: var(--height);
}
</style>
