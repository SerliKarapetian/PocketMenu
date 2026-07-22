import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    activeId: null as string | null
  }),
  
  actions: {
    open(id: string) {
      this.activeId = id
    },
    
    close() {
      this.activeId = null
    },
    
    toggle(id: string) {
      if (this.activeId === id) {
        this.close()
      } else {
        this.open(id)
      }
    }
  },
  
  getters: {
    isOpen: (state) => (id: string) => {
      return state.activeId === id
    }
  }
})