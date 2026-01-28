'use client'

import { cn } from '@/lib/utils'

interface Applique {
  id: number
  slug: string
  name: string
  displayName: string
}

interface AppliqueSelectorProps {
  appliques: Applique[]
  selectedAppliqueSlug: string
  onSelect: (appliqueSlug: string) => void
  disabled?: boolean
}

// Icon mapping for appliques
const APPLIQUE_ICONS: Record<string, string> = {
  corona: '👑',
  perla: '⚪',
  mariposa: '🦋',
  flor: '🌸',
}

export function AppliqueSelector({
  appliques,
  selectedAppliqueSlug,
  onSelect,
  disabled = false,
}: AppliqueSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-3">
        Aplique decorativo
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {appliques.map((applique) => {
          const isSelected = applique.slug === selectedAppliqueSlug

          return (
            <button
              key={applique.id}
              onClick={() => onSelect(applique.slug)}
              disabled={disabled}
              className={cn(
                'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
                isSelected
                  ? 'border-[#782048] bg-[#782048]/5'
                  : 'border-slate-200 hover:border-slate-300 bg-white',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="text-3xl">{APPLIQUE_ICONS[applique.slug] || '✨'}</span>
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-[#782048]' : 'text-slate-600'
                )}
              >
                {applique.displayName}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
