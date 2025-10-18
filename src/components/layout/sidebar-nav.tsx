'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Pill,
  Box,
  FlaskConical,
  Landmark,
  Beaker,
  Shield,
  LayoutDashboard  // ADD THIS IMPORT
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/inventory', label: 'Inventory', icon: Box, tooltip: 'Inventory' },
  { href: '/batch-tracking', label: 'Batch Tracking', icon: FlaskConical, tooltip: 'Batch Tracking' },
  { href: '/formulas', label: 'Formulas', icon: Beaker, tooltip: 'Formulas' },
  { href: '/compliance', label: 'Compliance', icon: Shield, tooltip: 'Compliance' },
  { href: '/budget', label: 'Budget', icon: Landmark, tooltip: 'Budget' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center gap-2 px-4 py-3">
        <Pill className="h-8 w-8 text-primary" />
        <span className="text-lg font-semibold">
          PharmaTrack Lite
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.tooltip}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
