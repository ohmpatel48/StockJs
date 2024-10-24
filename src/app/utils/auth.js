"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to log in a user with email and password
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  // Function to log out the user
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  };

  // Save user's watchlist to Firestore
  const saveWatchlist = async (stocks) => {
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { watchlist: stocks });
    }
  };

  // Load user's watchlist from Firestore
  const loadWatchlist = async () => {
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return docSnap.data().watchlist;
      }
      return [];
    }
    return [];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, saveWatchlist, loadWatchlist, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
