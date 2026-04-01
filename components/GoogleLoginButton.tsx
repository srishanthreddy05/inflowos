// components/GoogleLoginButton.tsx
'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Use NextAuth to sign in with Google
    // This will redirect to Google OAuth, then back to /api/auth/callback/google
    await signIn('google', { callbackUrl: '/dashboard' });
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:bg-gray-400"
    >
      {isLoading ? 'Signing in...' : 'Sign in with Google'}
    </button>
  );
}
