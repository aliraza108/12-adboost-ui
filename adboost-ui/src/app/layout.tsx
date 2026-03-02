import './globals.css'

import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { RouteTransition } from '@/components/layout/RouteTransition'
import { Toaster } from 'sonner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'AdBoost Studio',
  description: 'AI marketing creative optimization engine.'
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-sand-50 text-sand-800">
        <Sidebar />
        <div className="lg:pl-60 pb-20 lg:pb-0">
          <main className="mx-auto max-w-[1200px] px-6 py-10">
            <TopBar />
            <RouteTransition>{children}</RouteTransition>
          </main>
        </div>
        <GrainOverlay />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-sand-100 text-sand-800 border border-sand-200',
            style: { fontFamily: 'var(--font-body)' }
          }}
        />
      </body>
    </html>
  )
}
