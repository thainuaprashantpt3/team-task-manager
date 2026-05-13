// // import { NavLink, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';
// // import toast from 'react-hot-toast';

// // const adminLinks = [
// //   { to: '/dashboard',         icon: 'grid-dots',       label: 'Dashboard' },
// //   { to: '/projects',          icon: 'folder',          label: 'Projects' },
// //   { to: '/tasks',             icon: 'checkbox',        label: 'Tasks' },
// //   { to: '/admin/team-logs',  icon: 'notes',          label: 'Team logs' },
// //   { to: '/admin/members',     icon: 'users',           label: 'Members' },
// //   { to: '/admin/reports',     icon: 'chart-bar',       label: 'Reports' },
// // ];

// // const memberLinks = [
// //   { to: '/dashboard',        icon: 'grid-dots', label: 'Dashboard' },
// //   { to: '/member/projects',  icon: 'folder',    label: 'My projects' },
// //   { to: '/member/tasks',     icon: 'checkbox',  label: 'My tasks' },
// // ];

// // export default function Sidebar() {
// //   const { user, logout, isAdmin } = useAuth();
// //   const navigate = useNavigate();
// //   const links = isAdmin ? adminLinks : memberLinks;

// //   const handleLogout = () => {
// //     logout();
// //     toast.success('Signed out successfully');
// //     navigate('/login');
// //   };

// //   return (
// //     <aside className="w-56 bg-white border-r border-gray-100 flex flex-col min-h-screen shrink-0">
// //       {/* Logo */}
// //       <div className="px-5 py-5 border-b border-gray-100">
// //         <p className="font-semibold text-brand-900 text-base">TaskFlow</p>
// //         <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role} workspace</p>
// //       </div>

// //       {/* Nav */}
// //       <nav className="flex-1 py-4 px-3 space-y-0.5">
// //         {links.map(({ to, icon, label }) => (
// //           <NavLink
// //             key={to}
// //             to={to}
// //             className={({ isActive }) =>
// //               `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
// //                ${isActive
// //                  ? 'bg-brand-50 text-brand-700 font-medium'
// //                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
// //                }`
// //             }
// //           >
// //             <i className={`ti ti-${icon} text-lg`} />
// //             {label}
// //           </NavLink>
// //         ))}
// //       </nav>

// //       {/* User footer */}
// //       <div className="p-3 border-t border-gray-100">
// //         <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-1">
// //           <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
// //             {user?.name?.charAt(0).toUpperCase()}
// //           </div>
// //           <div className="overflow-hidden">
// //             <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
// //             <p className="text-xs text-gray-400 truncate">{user?.email}</p>
// //           </div>
// //         </div>
// //         <button
// //           onClick={handleLogout}
// //           className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500
// //                      hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
// //         >
// //           <i className="ti ti-logout text-base" />
// //           Sign out
// //         </button>
// //       </div>
// //     </aside>
// //   );
// // }









// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const adminLinks = [
//   { to: '/dashboard',        icon: 'layout-dashboard', label: 'Dashboard' },
//   { to: '/projects',         icon: 'folder',           label: 'Projects' },
//   { to: '/tasks',            icon: 'checkbox',         label: 'All tasks' },
//   { to: '/admin/team-logs',  icon: 'activity',         label: 'Team logs' },
//   { to: '/admin/members',    icon: 'users',            label: 'Members' },
//   { to: '/admin/reports',    icon: 'chart-bar',        label: 'Reports' },
// ];

// const memberLinks = [
//   { to: '/dashboard',       icon: 'layout-dashboard', label: 'Dashboard' },
//   { to: '/member/projects', icon: 'folder',           label: 'My projects' },
//   { to: '/member/tasks',    icon: 'checkbox',         label: 'My tasks' },
// ];

// export default function Sidebar() {
//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const links = isAdmin ? adminLinks : memberLinks;

//   const handleLogout = () => {
//     logout();
//     toast.success('Signed out successfully');
//     navigate('/login');
//   };

//   return (
//     <aside className="w-60 bg-white border-r border-gray-100 flex flex-col min-h-screen shrink-0 shadow-sm">

//       {/* Brand */}
//       <div className="px-5 py-5 border-b border-gray-100">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600
//                           rounded-xl flex items-center justify-center shadow-md
//                           shadow-indigo-200">
//             <i className="ti ti-brain text-white text-lg" />
//           </div>
//           <div>
//             <p className="font-bold text-gray-900 text-base leading-tight">Ethera AI</p>
//             <p className="text-xs text-indigo-500 font-medium">Task Manager</p>
//           </div>
//         </div>

//         {/* Role chip */}
//         <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
//                          text-xs font-medium
//                          ${isAdmin
//                            ? 'bg-purple-100 text-purple-700'
//                            : 'bg-indigo-50 text-indigo-600'
//                          }`}>
//           <i className={`ti ${isAdmin ? 'ti-shield-check' : 'ti-user'} text-xs`} />
//           {isAdmin ? 'Admin workspace' : 'Member workspace'}
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 py-4 px-3 space-y-0.5">
//         {links.map(({ to, icon, label }, i) => (
//           <NavLink
//             key={to}
//             to={to}
//             style={{ animationDelay: `${i * 0.05}s` }}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
//                transition-all duration-200 animate-fade-in
//                ${isActive
//                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
//                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
//                }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 <div className={`w-7 h-7 rounded-lg flex items-center justify-center
//                                  transition-all duration-200
//                                  ${isActive
//                                    ? 'bg-indigo-600 shadow-md shadow-indigo-200'
//                                    : 'bg-gray-100'
//                                  }`}>
//                   <i className={`ti ti-${icon} text-sm
//                     ${isActive ? 'text-white' : 'text-gray-500'}`} />
//                 </div>
//                 {label}
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>

//       {/* User footer */}
//       <div className="p-3 border-t border-gray-100 space-y-1">
//         <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500
//                           flex items-center justify-center text-xs font-bold text-white shadow-sm">
//             {user?.name?.charAt(0).toUpperCase()}
//           </div>
//           <div className="overflow-hidden flex-1">
//             <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
//             <p className="text-xs text-gray-400 truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-500
//                      hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200
//                      font-medium"
//         >
//           <i className="ti ti-logout text-sm" />
//           Sign out
//         </button>
//       </div>
//     </aside>
//   );
// }


import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const adminLinks = [
  { to: '/dashboard',        icon: 'layout-dashboard', label: 'Dashboard',   section: null },
  { to: '/projects',         icon: 'folder',           label: 'Projects',    section: null },
  { to: '/tasks',            icon: 'checkbox',         label: 'All tasks',   section: null },
  { to: '/admin/team-logs',  icon: 'activity',         label: 'Team logs',   section: 'Manage' },
  { to: '/admin/members',    icon: 'users',            label: 'Members',     section: null },
  { to: '/admin/reports',    icon: 'chart-bar',        label: 'Reports',     section: null },
];

const memberLinks = [
  { to: '/dashboard',        icon: 'layout-dashboard', label: 'Dashboard',   section: null },
  { to: '/member/projects',  icon: 'folder',           label: 'My projects', section: null },
  { to: '/member/tasks',     icon: 'checkbox',         label: 'My tasks',    section: null },
];

export default function Sidebar({ onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const links    = isAdmin ? adminLinks : memberLinks;

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-full min-h-screen bg-white border-r border-gray-100
                      flex flex-col shadow-sm">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl
                            flex items-center justify-center shadow-md shadow-indigo-200
                            animate-float">
              <i className="ti ti-brain text-white text-xl" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-base tracking-tight leading-none">
                Ethera AI
              </p>
              <p className="text-xs font-medium text-indigo-500 mt-0.5">
                Task Manager
              </p>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden btn-ghost p-1.5"
            aria-label="Close menu"
          >
            <i className="ti ti-x text-lg" />
          </button>
        </div>

        {/* Workspace chip */}
        <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                         ${isAdmin
                           ? 'bg-purple-50 text-purple-700 border border-purple-100'
                           : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                         }`}>
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse-dot
            ${isAdmin ? 'bg-purple-500' : 'bg-indigo-500'}`} />
          <i className={`ti ${isAdmin ? 'ti-shield-check' : 'ti-user'} text-sm`} />
          {isAdmin ? 'Admin workspace' : 'Member workspace'}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon, label, section }, i) => (
          <div key={to}>
            {section && (
              <p className="section-label px-3 pt-4 pb-2">{section}</p>
            )}
            <NavLink
              to={to}
              style={{ animationDelay: `${i * 0.06}s` }}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                 font-medium transition-all duration-200 animate-slide-in
                 ${isActive
                   ? 'bg-indigo-50 text-indigo-700'
                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="nav-active-bar" />}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                                   transition-all duration-200 shrink-0
                                   ${isActive
                                     ? 'bg-indigo-600 shadow-md shadow-indigo-200'
                                     : 'bg-gray-100 group-hover:bg-gray-200'
                                   }`}>
                    <i className={`ti ti-${icon} text-sm
                      ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className="truncate">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          </div>
        ))}
      </nav>

      {/* Help box */}
      <div className="mx-3 mb-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50
                      rounded-2xl border border-indigo-100">
        <p className="text-xs font-semibold text-indigo-800 mb-0.5">
          Need help?
        </p>
        <p className="text-xs text-indigo-500 leading-relaxed">
          Contact your admin or visit the Ethera AI help center.
        </p>
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                        bg-gray-50 border border-gray-100 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600
                          flex items-center justify-center
                          text-sm font-bold text-white shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium
                     text-gray-500 hover:text-red-600 hover:bg-red-50
                     rounded-xl transition-all duration-200"
        >
          <i className="ti ti-logout text-base" />
          Sign out
        </button>
      </div>
    </aside>
  );
}