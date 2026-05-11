// import { useState } from 'react';
// import { AuthContext } from './AuthContext';

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem('user') || 'null')
//   );

//   const login = (userData) => {
//     localStorage.setItem('user', JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         isAdmin: user?.role === 'admin',
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }