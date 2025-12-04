import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons({
      collections: {
        tabler: () =>
          import("@iconify-json/tabler/icons.json").then((i) => i.default),
        "svg-spinners": () =>
          import("@iconify-json/svg-spinners/icons.json").then(
            (i) => i.default
          ),
      },
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    breakpoint: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  // 全局安全区域处理（移动端刘海屏等）
  safelist: [
    "min-h-screen",
    "min-h-[100dvh]",
    "min-h-[100svh]",
    "overflow-y-auto",
    "scroll-container",
  ],
});
