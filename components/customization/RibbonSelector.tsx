'use client'

import { cn } from '@/lib/utils'

interface Ribbon {
  id: number
  slug: string
  name: string
  displayName: string
  hexColor: string | null
}

interface RibbonSelectorProps {
  ribbons: Ribbon[]
  selectedRibbonSlug: string
  onSelect: (ribbonSlug: string) => void
  disabled?: boolean
}

export function RibbonSelector({
  ribbons,
  selectedRibbonSlug,
  onSelect,
  disabled = false,
}: RibbonSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-3">
        Color de cinta
      </label>
      <div className="flex flex-wrap gap-3">
        {ribbons.map((ribbon) => {
          const isSelected = ribbon.slug === selectedRibbonSlug

          return (
            <button
              key={ribbon.id}
              onClick={() => onSelect(ribbon.slug)}
              disabled={disabled}
              className={cn(
                'group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                isSelected
                  ? 'border-[#782048] bg-[#782048]/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-full border-2 transition-all',
                  isSelected ? 'border-[#782048] scale-110' : 'border-slate-300'
                )}
                style={{ backgroundColor: ribbon.hexColor || '#ccc' }}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  isSelected ? 'text-[#782048]' : 'text-slate-600'
                )}
              >
                {ribbon.displayName}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
