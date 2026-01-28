import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/utils'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // This is a fallback - middleware should handle this
  if (!session) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar adminName={session.name} />
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
