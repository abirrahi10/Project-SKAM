// // src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebaseConfig';


// interface AuthContextType {
//   user: firebase.User | null;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// export const AuthProvider: React.FC = ({ children }) => {
//   const [user, setUser] = useState<firebase.User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
