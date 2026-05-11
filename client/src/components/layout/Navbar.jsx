import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Top navbar — shown on mobile or as a supplement to the sidebar
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <i className="ti ti-checkbox text-white text-sm" />
        </div>
        <span className="font-semibold text-gray-900 text-sm">TaskFlow</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
          ${user?.role === 'admin'
            ? 'bg-purple-50 text-purple-700'
            : 'bg-gray-100 text-gray-600'
          }`}>
          {user?.role}
        </span>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center
                          text-xs font-semibold text-brand-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 font-medium hidden sm:block">
            {user?.name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50
                     rounded-lg transition-colors"
        >
          <i className="ti ti-logout text-base" />
        </button>
      </div>
    </header>
  );
}