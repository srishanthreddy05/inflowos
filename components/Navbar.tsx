// components/Navbar.tsx
'use client';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  return (
    <nav className="flex justify-between items-center py-4 mb-6">
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-lg">InflowOS</span>
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full" />
          <span className="text-sm">{user.displayName || user.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="ml-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
