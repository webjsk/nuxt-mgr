// stores/theme.ts
export const useThemeStore = defineStore("theme", () => {
  // 使用自定义的 useColorMode（基于 cookie，SSR 友好）
  const colorMode = useColorMode({
    storageKey: "theme-mode",
    modes: {
      light: "light",
      dark: "dark",
    },
    initialValue: "light",
  });

  const isDark = computed(() => colorMode.value === "dark");

  const toggleTheme = () => {
    colorMode.value = isDark.value ? "light" : "dark";
  };

  const setTheme = (mode: "light" | "dark") => {
    colorMode.value = mode;
  };

  return {
    colorMode,
    isDark,
    toggleTheme,
    setTheme,
  };
});
