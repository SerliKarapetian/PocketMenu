// stores/locale.ts
import { defineStore } from 'pinia'

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: 'fa' as string,
  }),

  actions: {
    setLocale(locale: string) {
      this.currentLocale = locale
      if (process.client) {
        localStorage.setItem('preferred-locale', locale)
      }
    },

    initLocale() {
      if (process.client) {
        const saved = localStorage.getItem('preferred-locale')
        if (saved && (saved === 'en' || saved === 'fa')) {
          this.currentLocale = saved
        } else {
          this.currentLocale = 'fa'
          localStorage.setItem('preferred-locale', 'fa')
        }
      }
    }
  }
})