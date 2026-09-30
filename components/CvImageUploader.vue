<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    label: string
    /** Optional explicit input id (defaults to a unique generated id). */
    id?: string
  }>(),
  {
    modelValue: null,
    id: undefined,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null | undefined): void
}>()

const uid = useId()
const inputId = computed(() => props.id ?? `image-uploader-${uid}`)

const isPhotoLoading = ref(false)

async function uploadImage(e: Event) {
  isPhotoLoading.value = true
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const readerResult = await fileToDataUri(file)
    const imageDataUri = await resizeImageFromReader(readerResult)
    emit('update:modelValue', imageDataUri)
  }
  isPhotoLoading.value = false
}

function clearImage() {
  emit('update:modelValue', null)
  isPhotoLoading.value = false
}

function fileToDataUri(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)

    reader.addEventListener(
      'load',
      (e) => {
        const readerResult = e.target?.result
        if (typeof readerResult === 'string')
          resolve(readerResult)
        else
          reject(new Error('Something went wrong'))
      },
      { once: true },
    )
  })
}

function resizeImageFromReader(readerResult: string) {
  const img = new Image()
  img.src = readerResult
  return new Promise<string>(resolve =>
    img.addEventListener(
      'load',
      () => resolve(resizeImage(img)),
      { once: true },
    ),
  )
}

function resizeImage(imgToResize: HTMLImageElement, resizingFactor = 0.25) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  const canvasWidth = imgToResize.width * resizingFactor
  const canvasHeight = imgToResize.height * resizingFactor

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  if (context)
    context.drawImage(imgToResize, 0, 0, canvasWidth, canvasHeight)

  return canvas.toDataURL()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <img
      v-if="modelValue"
      class="size-10 rounded object-contain bg-white border border-slate-200"
      :src="modelValue"
      alt=""
    >
    <label
      tabindex="0"
      :for="inputId"
      class="form__btn basis-full"
    >{{ isPhotoLoading ? "Loading..." : label }}
      <input
        :id="inputId"
        type="file"
        accept="image/*"
        class="hidden"
        @change="uploadImage"
      >
    </label>
    <button
      v-if="modelValue"
      class="form__btn flex flex-col justify-center"
      type="button"
      @click="clearImage"
    >
      {{ $t("clear-profile-image") }}
    </button>
  </div>
</template>
