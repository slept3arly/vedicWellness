"use client"

import { createContext, useContext, useState } from "react"

type MenuContextType = {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

const MenuContext = createContext<MenuContextType | null>(null)

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) {
    throw new Error("useMenu must be used inside MenuProvider")
  }
  return ctx
}
