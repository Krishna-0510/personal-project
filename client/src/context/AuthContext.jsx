import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config'; // ✅ use centralized Firebase

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();

        localStorage.setItem('token', idToken);
        setToken(idToken);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);