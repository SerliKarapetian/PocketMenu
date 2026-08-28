// middleware/i18n.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const { locale, setLocale } = useI18n()

    // Get locale from URL path
    const pathSegments = to.path.split('/')
    const localeFromPath = pathSegments[1]

    // Check if the first path segment is a valid locale
    const validLocales = ['en', 'fa']

    if (localeFromPath && validLocales.includes(localeFromPath)) {
        // Set locale from URL
        if (locale.value !== localeFromPath) {
            setLocale(localeFromPath)
        }
        // Update document direction
        if (process.client) {
            const isRtl = localeFromPath === 'fa'
            document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
            document.documentElement.lang = localeFromPath
        }
    }
})