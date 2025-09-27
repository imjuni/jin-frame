import DefaultTheme from 'vitepress/theme'
import Mermaid from '../components/Mermaid.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Mermaid', Mermaid)
  }
}