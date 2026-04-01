'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-2 text-center">InflowOS</h1>
        <p className="text-gray-600 text-center mb-6">Sign in with Google to get started</p>
        <GoogleLoginButton />
      </div>
    </main>
  );
}
