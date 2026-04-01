// components/TaskForm.tsx
'use client';
import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../utils/firebase';

export default function TaskForm({ user }: { user: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('high');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    const taskRef = ref(db, `/users/${user.uid}/tasks`);
    await push(taskRef, {
      title,
      description,
      priority,
      deadline,
      completed: false,
      createdAt: serverTimestamp(),
      source: 'manual',
    });
    setTitle('');
    setDescription('');
    setPriority('high');
    setDeadline('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow flex flex-col gap-3">
      <input
        className="border p-2 rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border p-2 rounded"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div className="flex gap-3">
        <select
          className="border p-2 rounded"
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          className="border p-2 rounded"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
