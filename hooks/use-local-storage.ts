"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
      setIsLoaded(true)
    }
  }, [key])

  const setStoredValue = (newValue: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)

      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [value, setStoredValue, isLoaded] as const
}

export function clearLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}

export function getAllLocalStorageKeys() {
  if (typeof window !== "undefined") {
    return Object.keys(localStorage)
  }
  return []
}
