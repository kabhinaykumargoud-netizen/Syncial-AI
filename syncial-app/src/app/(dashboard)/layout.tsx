export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const userName = user.user_metadata?.full_name as string | undefined;
  const userEmail = user.email;

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar userEmail={userEmail} userName={userName} />
      <main className="flex-1 min-w-0 lg:overflow-auto">
        {/* Mobile top padding for fixed header */}
        <div className="lg:hidden h-14" />
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
