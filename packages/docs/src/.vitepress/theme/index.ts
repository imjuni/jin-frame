import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import DefaultTheme from "vitepress/theme";
import Mermaid from "../components/Mermaid.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue);
    app.component("Mermaid", Mermaid);
  },
};
