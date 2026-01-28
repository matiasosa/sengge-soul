'use client'

import { cn } from '@/lib/utils'

interface TextCustomizerProps {
  textName: string
  textDescription: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  maxNameChars: number
  maxDescriptionChars: number
}

export function TextCustomizer({
  textName,
  textDescription,
  onNameChange,
  onDescriptionChange,
  maxNameChars,
  maxDescriptionChars,
}: TextCustomizerProps) {
  const nameRemaining = maxNameChars - textName.length
  const descriptionRemaining = maxDescriptionChars - textDescription.length

  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="text-name" className="block text-sm font-medium text-slate-900 mb-2">
          Nombre o título
        </label>
        <input
          type="text"
          id="text-name"
          value={textName}
          onChange={(e) => {
            if (e.target.value.length <= maxNameChars) {
              onNameChange(e.target.value)
            }
          }}
          maxLength={maxNameChars}
          placeholder="Ej: María"
          className={cn(
            'w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors',
            'focus:border-[#782048] focus:outline-none focus:ring-2 focus:ring-[#782048]/20',
            'placeholder:text-slate-400'
          )}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {textName.length}/{maxNameChars} caracteres
          </span>
          {nameRemaining <= 5 && (
            <span
              className={cn(
                'font-medium',
                nameRemaining === 0 ? 'text-red-600' : 'text-amber-600'
              )}
            >
              {nameRemaining} restantes
            </span>
          )}
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="text-description" className="block text-sm font-medium text-slate-900 mb-2">
          Descripción o mensaje
        </label>
        <input
          type="text"
          id="text-description"
          value={textDescription}
          onChange={(e) => {
            if (e.target.value.length <= maxDescriptionChars) {
              onDescriptionChange(e.target.value)
            }
          }}
          maxLength={maxDescriptionChars}
          placeholder="Ej: Mis XV años"
          className={cn(
            'w-full rounded-lg border-2 px-4 py-2.5 text-sm transition-colors',
            'focus:border-[#782048] focus:outline-none focus:ring-2 focus:ring-[#782048]/20',
            'placeholder:text-slate-400'
          )}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {textDescription.length}/{maxDescriptionChars} caracteres
          </span>
          {descriptionRemaining <= 5 && (
            <span
              className={cn(
                'font-medium',
                descriptionRemaining === 0 ? 'text-red-600' : 'text-amber-600'
              )}
            >
              {descriptionRemaining} restantes
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
