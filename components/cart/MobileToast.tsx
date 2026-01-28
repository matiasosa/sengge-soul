'use client'

import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileToastProps {
  isVisible: boolean
  onClose: () => void
}

export function MobileToast({ isVisible, onClose }: MobileToastProps) {
  return (
    <div
      onClick={onClose}
      className={cn(
        'fixed top-20 left-4 right-4 z-[1001] transition-all duration-300 md:hidden',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="bg-[#782048] text-white rounded-lg shadow-lg p-4 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium">Producto agregado al carrito</span>
      </div>
    </div>
  )
}
