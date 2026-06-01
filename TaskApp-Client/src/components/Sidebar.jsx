import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  tasks:     'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  reports:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  report_new:'M12 5v14 M5 12h14',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  user:      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  my_reports:'M4 6h16M4 10h16M4 14h10',
};

const SideNavLink = ({ to, icon, children, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 group ${
        isActive
          ? 'bg-accent-500/10 text-accent-400 font-medium'
          : 'text-surface-400 hover:text-surface-100 hover:bg-surface-700/50'
      }`
    }
  >
    <span className="flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
      <Icon d={ICONS[icon]} />
    </span>
    {children}
  </NavLink>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside className="w-[220px] bg-surface-900 border-r border-surface-700/60 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent-500 rounded flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#0c0c0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif' }}
            className="font-bold text-surface-50 text-base tracking-tight">
            TaskApp
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-medium text-surface-500 uppercase tracking-widest px-3 mb-2">
          Main
        </p>
        <SideNavLink to="/" icon="dashboard" end>Dashboard</SideNavLink>
        <SideNavLink to="/tasks" icon="tasks">Tasks</SideNavLink>

        {user?.role === 'manager' && (
          <>
            <div className="divider !my-3" />
            <p className="text-[10px] font-medium text-surface-500 uppercase tracking-widest px-3 mb-2">
              Management
            </p>
            <SideNavLink to="/reports" icon="reports">All Reports</SideNavLink>
          </>
        )}

        {user?.role === 'employee' && (
          <>
            <div className="divider !my-3" />
            <p className="text-[10px] font-medium text-surface-500 uppercase tracking-widest px-3 mb-2">
              Reports
            </p>
            <SideNavLink to="/my-reports" icon="my_reports">My Reports</SideNavLink>
            <SideNavLink to="/reports/new" icon="report_new">Submit Report</SideNavLink>
          </>
        )}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-surface-700/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded mb-2">
          <div className="w-8 h-8 rounded bg-surface-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-surface-200">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-100 truncate leading-none">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-surface-400 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm text-surface-400
                     hover:text-danger-400 hover:bg-danger-500/5 transition-all duration-150"
        >
          <Icon d={ICONS.logout} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
