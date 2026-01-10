import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'

const Navbar = async () => {

    const user = null
    const isAdmin = false

  return (
    <nav className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex z-40 font-semibold'>
            Sengge<span className='text-[#782048]'>Soul</span>
          </Link>

          <div className='h-full flex items-center space-x-4'>
            <Link
              href='/catalog'
              className={buttonVariants({
                size: 'sm',
                variant: 'ghost',
              })}>
              Productos
            </Link>

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
                <div className='h-8 w-px bg-zinc-200 hidden sm:block' />

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
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar