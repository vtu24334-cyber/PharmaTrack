'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Header } from './header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login page, just return children without sidebar/header
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Otherwise, show full layout with sidebar and header
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarNav />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
