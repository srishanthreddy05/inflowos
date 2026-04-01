// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { db } from '@/utils/firebase';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import NotificationBanner from '@/components/NotificationBanner';
import GmailIntegration from '@/components/GmailIntegration';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Fetch tasks from Firebase when session is available
  useEffect(() => {
    if (session?.user?.email) {
      const safeEmailKey = session.user.email.replace(/[.#$[\]]/g, '_');
      const tasksRef = ref(db, `/users/${safeEmailKey}/tasks`);
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const taskList = Object.entries(data).map(([id, task]: [string, any]) => ({
            id,
            ...task,
          }));
          setTasks(taskList);
        } else {
          setTasks([]);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [session?.user?.email]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return null; // Will redirect due to useEffect
  }

  const safeEmailKey = session.user?.email ? session.user.email.replace(/[.#$[\]]/g, '_') : 'unknown';
  const user = {
    uid: safeEmailKey,
    email: session.user?.email,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">InflowOS Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <TaskForm user={user} />
        <TaskList tasks={tasks} loading={loading} user={user} />
        
        {/* Gmail Integration Section */}
        <div className="mt-8 p-6 bg-white rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Gmail Integration</h3>
          <GmailIntegration />
        </div>
      </div>
    </div>
  );
}
