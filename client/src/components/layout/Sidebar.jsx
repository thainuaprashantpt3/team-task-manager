import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const adminLinks = [
  { to: '/dashboard',         icon: 'grid-dots',       label: 'Dashboard' },
  { to: '/projects',          icon: 'folder',          label: 'Projects' },
  { to: '/tasks',             icon: 'checkbox',        label: 'Tasks' },
  { to: '/admin/team-logs',  icon: 'notes',          label: 'Team logs' },
  { to: '/admin/members',     icon: 'users',           label: 'Members' },
  { to: '/admin/reports',     icon: 'chart-bar',       label: 'Reports' },
];

const memberLinks = [
  { to: '/dashboard',        icon: 'grid-dots', label: 'Dashboard' },
  { to: '/member/projects',  icon: 'folder',    label: 'My projects' },
  { to: '/member/tasks',     icon: 'checkbox',  label: 'My tasks' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : memberLinks;

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <p className="font-semibold text-brand-900 text-base">TaskFlow</p>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role} workspace</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
               ${isActive
                 ? 'bg-brand-50 text-brand-700 font-medium'
                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
               }`
            }
          >
            <i className={`ti ti-${icon} text-lg`} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-1">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500
                     hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <i className="ti ti-logout text-base" />
          Sign out
        </button>
      </div>
    </aside>
  );
}