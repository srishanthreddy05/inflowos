'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { ref, set } from 'firebase/database';
import { useRouter } from 'next/navigation';

export const AuthContext = React.createContext<{
  user: User | null;
  loading: boolean;
}>(null!);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        // Store user profile in DB
        const profileRef = ref(db, `/users/${firebaseUser.uid}/profile`);
        await set(profileRef, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
        router.replace('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

