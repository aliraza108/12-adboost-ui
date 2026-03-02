'use client'

import { usePathname } from 'next/navigation'

const buildCrumbs = (pathname: string) =>
  pathname
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/-/g, ' '))

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/campaigns': 'Campaigns',
  '/campaigns/new': 'Create Campaign',
  '/optimize': 'Optimization Loop'
}

export function TopBar() {
  const pathname = usePathname()
  const title = titleMap[pathname] ?? 'AdBoost'
  const crumbs = buildCrumbs(pathname)

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-sand-500">
          {crumbs.length ? crumbs.join(' / ') : 'AdBoost'}
        </p>
        <h1 className="font-display text-3xl text-sand-900">{title}</h1>
      </div>
      <div className="hidden md:flex items-center gap-3 text-sm text-sand-600">
        <span className="h-2 w-2 rounded-full bg-sage" />
        API Connected
      </div>
    </header>
  )
}
