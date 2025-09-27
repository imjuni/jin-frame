<template>
  <div ref="mermaidRef" class="mermaid-diagram"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import mermaid from 'mermaid'

const props = defineProps<{
  code: string
}>()

const mermaidRef = ref<HTMLElement>()
const { isDark } = useData()

const renderMermaid = async () => {
  if (!mermaidRef.value) return

  try {
    // VitePress 테마에 따라 Mermaid 테마 설정
    const theme = isDark.value ? 'dark' : 'default'

    mermaid.initialize({
      startOnLoad: false,
      theme,
      securityLevel: 'loose',
    })

    const decodedCode = decodeURIComponent(props.code)
    const { svg } = await mermaid.render('mermaid-' + Date.now(), decodedCode)
    mermaidRef.value.innerHTML = svg
  } catch (error) {
    console.error('Mermaid rendering error:', error)
    if (mermaidRef.value) {
      mermaidRef.value.innerHTML = '<p style="color: red;">Error rendering Mermaid diagram</p>'
    }
  }
}

onMounted(() => {
  renderMermaid()
})

// 테마 변경 시 다시 렌더링
watch(isDark, () => {
  renderMermaid()
})
</script>

<style scoped>
.mermaid-diagram {
  text-align: center;
  margin: 1rem 0;
  overflow-x: auto;
}

.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>