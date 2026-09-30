import { useCvState } from '~/data/useCvState'

export default function usePrint() {
  const { formSettings } = useCvState()
  const i18n = useI18n()
  const docTitle = ref<string>()

  onMounted(() => {
    const printMargin = cssPagedMedia('margin')
    docTitle.value = document.title

    addEventListener('beforeprint', () => {
      // The two-column template bleeds to the page edges, the others keep a margin.
      if (formSettings.value.layout === 'two-column') {
        printMargin('0in')
      }
      else {
        printMargin('0.45in')
      }
    })

    addEventListener('afterprint', () => {
      if (typeof docTitle.value === 'string')
        document.title = docTitle.value
    })

    addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'p') {
        e.preventDefault()
        downloadPdf()
      }
    })
  })

  function cssPagedMedia(property: string) {
    const style = document.createElement('style')
    document.head.appendChild(style)
    return function (value: string) {
      // The page is designed for A4 (21cm wide), so pin the paper size too.
      style.innerHTML = `@page {size: A4;${property}: ${value}}`
    }
  }

  function downloadPdf(): void {
    changeDocTitle()
    window.print()
  }

  function changeDocTitle() {
    document.title = `CV_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`
  }

  return {
    downloadPdf,
  }
}
