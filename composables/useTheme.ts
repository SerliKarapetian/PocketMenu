// composables/useTheme.ts
export const useTheme = () => {
  const isDark = ref(false)

  // Apply theme to document
  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save to localStorage
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    applyTheme(!isDark.value)
  }

  // Set specific theme
  const setTheme = (dark: boolean) => {
    applyTheme(dark)
  }

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

    if (savedTheme) {
      // User has previously set a preference
      applyTheme(savedTheme === 'dark')
    } else {
      // First time - follow system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(systemPrefersDark)
    }
  }

  // Listen for system theme changes (only if user hasn't set a preference)
  const listenForSystemThemeChanges = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    setTheme,
    initTheme,
    listenForSystemThemeChanges
  }
}