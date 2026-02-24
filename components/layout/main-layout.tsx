import { ReactNode } from 'react'
import { Header } from './header'
import { Aside } from './aside'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[240px_1fr] min-h-screen">
      <Header className="col-span-2 row-start-1" />
      <Aside className="row-start-2" />
      <main className="row-start-2 overflow-auto bg-white">
        {children}
      </main>
    </div>
  )
}
