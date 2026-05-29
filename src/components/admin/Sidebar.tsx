// components/admin/Sidebar.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { href: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
  { href: '/admin/sessions',     icon: '📅', label: 'Sessions' },
  { href: '/admin/word-bank',    icon: '🗂️', label: 'Word Bank' },
  { href: '/admin/users',        icon: '👥', label: 'Users & Roles' },
  { href: '/admin/certificates', icon: '🏆', label: 'Certificates' },
  { href: '/admin/analytics',    icon: '📈', label: 'Analytics' },
];

export function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 flex flex-col bg-white/[0.02] border-r border-white/10 shrink-0`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex flex-col justify-between items-start gap-2">
        {!collapsed ? (
          <div>
            <div className="text-yellow-400 font-black text-lg">🐝 Modern Bee</div>
            <div className="text-white/30 text-[10px] uppercase tracking-wider font-bold mt-0.5">Admin Portal</div>
          </div>
        ) : (
          <span className="text-yellow-400 text-xl font-black">🐝</span>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white/30 hover:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer">
          {collapsed ? '→' : '← Collapse'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-grow p-3 space-y-1 mt-4">
        {NAV_ITEMS.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + signout */}
      <div className="p-4 border-t border-white/10 mt-auto">
        {!collapsed && (
          <div className="mb-3">
            <div className="text-white text-xs font-semibold truncate">{user?.name || 'Admin'}</div>
            <div className="text-purple-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">🛡️ Admin</div>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-left text-red-450 text-red-400/70 hover:text-red-400 text-xs font-medium transition-colors cursor-pointer"
        >
          {collapsed ? '🚪' : '🚪 Sign out'}
        </button>
      </div>
    </aside>
  );
}
