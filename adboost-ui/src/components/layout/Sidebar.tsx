'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, FlaskConical, LayoutDashboard, Megaphone, Sparkles, Wand2 } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/optimize', label: 'Optimize', icon: Wand2 }
]

const secondaryItems = [
  { href: '/campaigns/demo-campaign-001/variants', label: 'Variants', icon: Sparkles },
  { href: '/campaigns/demo-campaign-001/experiments', label: 'Experiments', icon: FlaskConical },
  { href: '/campaigns/demo-campaign-001/analytics', label: 'Analytics', icon: BarChart3 }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 bg-sand-100 border-r border-sand-200 px-6 py-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="h-10 w-10 rounded-full bg-terracotta text-warm-white flex items-center justify-center font-display text-lg">
            A
          </div>
          <div>
            <p className="font-display text-xl">AdBoost</p>
            <p className="text-xs text-sand-600">Sandcastle Studio</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                  active
                    ? 'bg-sand-200 text-sand-900'
                    : 'text-sand-600 hover:bg-sand-200/60 hover:text-sand-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-sand-500 mb-3">Deep Links</p>
          <div className="flex flex-col gap-2">
            {secondaryItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                    active
                      ? 'bg-sand-200 text-sand-900'
                      : 'text-sand-600 hover:bg-sand-200/60 hover:text-sand-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="mt-auto rounded-xl bg-sand-200/70 p-4 text-sm text-sand-700">
          <p className="font-medium text-sand-800">Need ideas?</p>
          <p>Launch an optimization loop to surface fresh winners.</p>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-sand-100 border-t border-sand-200 px-4 py-2 flex items-center justify-around z-30">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs ${
                active ? 'text-terracotta' : 'text-sand-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}