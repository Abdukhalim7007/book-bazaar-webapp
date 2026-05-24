import WebApp from '@twa-dev/sdk'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface TelegramUser {
  id: number
  first_name: string
  last_name: string
  username: string
  photo_url: string
}

interface TelegramContextValue {
  webApp: typeof WebApp
  user: TelegramUser | null
  initData: string
  isReady: boolean
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)

  useEffect(() => {
    WebApp.ready()
    WebApp.expand()

    const rawUser = WebApp.initDataUnsafe?.user
    if (rawUser) {
      setUser({
        id: rawUser.id,
        first_name: rawUser.first_name ?? '',
        last_name: rawUser.last_name ?? '',
        username: rawUser.username ?? '',
        photo_url: rawUser.photo_url ?? '',
      })
    }

    setIsReady(true)
  }, [])

  return (
    <TelegramContext.Provider
      value={{
        webApp: WebApp,
        user,
        initData: WebApp.initData,
        isReady,
      }}
    >
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram(): TelegramContextValue {
  const ctx = useContext(TelegramContext)
  if (!ctx) {
    throw new Error('useTelegram must be used inside <TelegramProvider>')
  }
  return ctx
}
