import type { Config } from 'tailwindcss'
import TailwindUtopia from '@domchristie/tailwind-utopia'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        app: ['Helvetica', 'sans-serif'],
        landing: ['Inter', 'sans-serif'],
        logo: ['"Roboto Slab"', 'serif'],
        // Selectable CV fonts (see ~/data/cv-fonts.ts). All of them are system
        // stacks, so switching fonts never triggers a webfont download.
        'cv-default': ['Helvetica', 'Arial', 'sans-serif'],
        'cv-sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        'cv-serif': ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        'cv-mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', '"Liberation Mono"', 'monospace'],
        'cv-garamond': ['Garamond', '"EB Garamond"', '"Apple Garamond"', 'Georgia', 'serif'],
        'cv-palatino': ['Palatino', '"Palatino Linotype"', '"Book Antiqua"', 'Georgia', 'serif'],
        'cv-baskerville': ['Baskerville', '"Baskerville Old Face"', '"Libre Baskerville"', 'Georgia', 'serif'],
        'cv-avenir': ['"Avenir Next"', 'Avenir', 'Futura', '"Trebuchet MS"', 'sans-serif'],
        'cv-trebuchet': ['"Trebuchet MS"', '"Segoe UI"', 'Tahoma', 'sans-serif'],
        'cv-verdana': ['Verdana', 'Geneva', '"DejaVu Sans"', 'sans-serif'],
        'cv-optima': ['Optima', 'Candara', '"Gill Sans"', 'sans-serif'],
        'cv-courier': ['"Courier New"', 'Courier', '"Nimbus Mono PS"', 'monospace'],
        'cv-cjk-sans': ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans CJK SC"', 'Helvetica', 'sans-serif'],
        'cv-cjk-serif': ['"Songti SC"', 'SimSun', '"Noto Serif CJK SC"', 'Georgia', 'serif'],
        'cv-cjk-kai': ['"Kaiti SC"', 'KaiTi', 'STKaiti', '"Noto Serif CJK SC"', 'serif'],
        'cv-cjk-fangsong': ['FangSong', 'STFangsong', '"Noto Serif CJK SC"', 'serif'],
        // Chinese webfonts (self-hosted, see `fonts.families` in nuxt.config.ts).
        // Each one falls back to a matching system font if it fails to load.
        'cv-noto-sans-sc': ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        'cv-noto-serif-sc': ['"Noto Serif SC"', '"Songti SC"', 'SimSun', 'serif'],
        'cv-zcool-xiaowei': ['"ZCOOL XiaoWei"', '"Songti SC"', 'SimSun', 'serif'],
      },
      colors: {
        primary: 'var(--primary)',
      },
    },
  },
  content: [
    'components/**/*.vue',
    // Font / template registries reference utility classes from plain TS files.
    'data/**/*.ts',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'plugins/**/*.js',
    'nuxt.config.js',
  ],
  plugins: [
    TailwindUtopia,
  ],
}
