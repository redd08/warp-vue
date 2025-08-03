export class LocalStorageManager {
  private static instance: LocalStorageManager
  private prefix = 'football-draw-'

  private constructor() {}

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager()
    }
    return LocalStorageManager.instance
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  save<T>(key: string, data: T): boolean {
    try {
      const serializedData = JSON.stringify(data)
      localStorage.setItem(this.getKey(key), serializedData)
      return true
    } catch (error) {
      console.error(`Failed to save data to localStorage for key "${key}":`, error)
      return false
    }
  }

  load<T>(key: string): T | null {
    try {
      const serializedData = localStorage.getItem(this.getKey(key))
      if (serializedData === null) {
        return null
      }
      return JSON.parse(serializedData) as T
    } catch (error) {
      console.error(`Failed to load data from localStorage for key "${key}":`, error)
      return null
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error(`Failed to remove data from localStorage for key "${key}":`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix))
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  exists(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null
  }

  getAllKeys(): string[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''))
  }
}

export const storage = LocalStorageManager.getInstance()
