'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NotificationContextType {
  showNotification: () => void
  isNotificationVisible: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false)

  const showNotification = () => {
    setIsNotificationVisible(true)
    setTimeout(() => {
      setIsNotificationVisible(false)
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ showNotification, isNotificationVisible }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
