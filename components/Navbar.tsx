'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { CartButton } from './cart/CartButton'
import { CartDrawer } from './cart/CartDrawer'
import { MobileToast } from './cart/MobileToast'
import { useCartStore } from '@/lib/store/cart-store'

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showDesktopNotification, setShowDesktopNotification] = useState(false)
  const [showMobileToast, setShowMobileToast] = useState(false)
  const [prevItemCount, setPrevItemCount] = useState(0)

  const totalItems = useCartStore((state) => state.getTotalItems())

  const user = null
  const isAdmin = false

  // Watch for cart item changes
  useEffect(() => {
    if (totalItems > prevItemCount) {
      // Desktop notification
      setShowDesktopNotification(true)
      setTimeout(() => {
        setShowDesktopNotification(false)
      }, 5000)

      // Mobile toast
      setShowMobileToast(true)
      setTimeout(() => {
        setShowMobileToast(false)
      }, 5000)
    }
    setPrevItemCount(totalItems)
  }, [totalItems, prevItemCount])

  return (
    <>
      <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
        <MaxWidthWrapper>
          <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
            <Link href='/' className='flex z-40 font-semibold'>
              Sengge<span className='text-[#782048]'>Soul</span>
            </Link>

            <div className='h-full flex items-center space-x-4'>
              {user ? (
                <>
                  <Link
                    href='/api/auth/logout'
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'ghost',
                    })}>
                    Sign out
                  </Link>
                  {isAdmin ? (
                    <Link
                      href='/dashboard'
                      className={buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                      })}>
                      Dashboard ✨
                    </Link>
                  ) : null}
                  <Link
                    href='/configure/customize'
                    className={buttonVariants({
                      size: 'sm',
                      className: 'hidden sm:flex items-center gap-1',
                    })}>
                    Crear Souvenir
                    <ArrowRight className='ml-1.5 h-5 w-5' />
                  </Link>
                </>
              ) : (
                <>
  

                  <Link
                    href='/catalog'
                    className={buttonVariants({
                      size: 'sm',
                      className: 'hidden sm:flex items-center gap-1',
                    })}>
                    Ver Catálogo
                    <ArrowRight className='ml-1.5 h-5 w-5' />
                  </Link>
                </>
              )}

              {/* Cart Button - Desktop with notification */}
              <div className='h-8 w-px bg-zinc-200 hidden sm:block' />
              <CartButton
                onClick={() => setIsCartOpen(true)}
                showNotificationText={showDesktopNotification}
                className="hidden sm:flex"
              />

              {/* Cart Button - Mobile without notification */}
              <CartButton
                onClick={() => setIsCartOpen(true)}
                className="sm:hidden"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>

      {/* Mobile Toast Notification */}
      <MobileToast
        isVisible={showMobileToast}
        onClose={() => setShowMobileToast(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

export default Navbar