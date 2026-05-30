import { Link, useLocation, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  LayoutDashboard, ClipboardList, Clock, Users,
  CheckSquare, FileText, User, LogOut, ChevronRight,
  CalendarDays, BarChart3, Tag, Target
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STAFF_NAV = [
  { path: '/', label: 'My Dashboard', icon: LayoutDashboard },
  { path: '/daily-log', label: 'Daily Task Log', icon: ClipboardList },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/timesheets', label: 'My Timesheets', icon: Clock },
];

const ADMIN_NAV = [
  { path: '/', label: 'Team Dashboard', icon: LayoutDashboard },
  { path: '/team', label: 'Team Management', icon: Users },
  { path: '/tasks', label: 'Task Management', icon: CheckSquare },
  { path: '/timesheets/review', label: 'Timesheet Review', icon: Clock },
  { path: '/admin-reports', label: 'Reports', icon: BarChart3 },
  { path: '/dept-summary', label: 'Hours vs Estimates', icon: Target },
  { path: '/tags', label: 'Tag Management', icon: Tag },
];

const SUPERUSER_NAV = [
  { path: '/', label: 'Global Dashboard', icon: LayoutDashboard },
  { path: '/audit-trail', label: 'Audit Trail', icon: FileText },
  { path: '/admin-reports', label: 'Reports', icon: BarChart3 },
  { path: '/tags', label: 'Tag Management', icon: Tag },
];

function getNavItems(role) {
  if (role === 'superuser') return SUPERUSER_NAV;
  if (role === 'admin') return ADMIN_NAV;
  return STAFF_NAV;
}

const ROLE_BADGE = {
  superuser: 'bg-amber-100 text-amber-900 border-amber-200',
  admin: 'bg-red-50 text-[#c10d00] border-red-200',
  staff: 'bg-gray-100 text-black border-gray-200',
};

const ROLE_LABEL = { superuser: 'Super User', admin: 'Admin', staff: 'Staff' };

export default function Layout() {
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const role = user?.role || 'staff';
  const navItems = getNavItems(role);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 flex flex-col flex-shrink-0 border-r border-sidebar-border bg-sidebar">
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div>
              <p className="text-sidebar-foreground font-semibold text-base leading-tight">Khonofy</p>
              <p className="text-sidebar-foreground/50 text-xs">Time &amp; Task Tracking</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
              </Link>
            );
          })}

          <div className="py-2"><div className="border-t border-sidebar-border" /></div>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
              location.pathname === '/profile'
                ? 'bg-primary text-white'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
        </nav>

        <div className="border-t border-sidebar-border p-3 flex-shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {(user?.full_name || user?.email || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sidebar-foreground text-sm font-medium truncate leading-tight">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-sidebar-foreground/50 text-xs truncate">{user?.email || ''}</p>
              </div>
              <button
                onClick={() => base44.auth.logout()}
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors p-1 rounded"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_BADGE[role] || ROLE_BADGE.staff}`}>
              {ROLE_LABEL[role] || 'Staff'}
            </span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
