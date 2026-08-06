// plugins/theme.client.ts
export default defineNuxtPlugin(() => {
    // This ensures the theme is applied before the first render
    if (process.client) {
        // Check if theme is already set in localStorage
        const savedTheme = localStorage.getItem('theme')

        if (savedTheme) {
            // Apply saved theme immediately
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }
})