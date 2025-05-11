"use client"

// Simple localStorage wrapper with error handling
const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return defaultValue
    }
  },

  set: <T,>(key: string, value: T): void => {
    if (typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
    }
  },
}

export default storage
