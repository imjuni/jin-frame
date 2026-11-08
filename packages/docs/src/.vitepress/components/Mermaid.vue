<template>
  <div ref="mermaidRef" class="mermaid-diagram"></div>
</template>

<script setup lang="ts">
import mermaid from "mermaid";
import { useData } from "vitepress";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  code: string;
}>();

const mermaidRef = ref<HTMLElement>();
const { isDark } = useData();

const renderMermaid = async () => {
  if (!mermaidRef.value) return;

  try {
    // Set Mermaid theme from the current VitePress theme.
    const theme = isDark.value ? "dark" : "default";

    mermaid.initialize({
      startOnLoad: false,
      theme,
      securityLevel: "loose",
    });

    const decodedCode = decodeURIComponent(props.code);
    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, decodedCode);
    mermaidRef.value.innerHTML = svg;
  } catch (error) {
    console.error("Mermaid rendering error:", error);
    if (mermaidRef.value) {
      mermaidRef.value.innerHTML = '<p style="color: red;">Error rendering Mermaid diagram</p>';
    }
  }
};

onMounted(() => {
  renderMermaid();
});

// Re-render when the theme changes.
watch(isDark, () => {
  renderMermaid();
});
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
