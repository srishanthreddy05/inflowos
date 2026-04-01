// components/TaskCard.tsx
'use client';
import { ref, update, remove } from 'firebase/database';
import { db } from '../utils/firebase';

export default function TaskCard({ task, user }: { task: any; user: any }) {
  const handleComplete = async () => {
    const taskRef = ref(db, `/users/${user.uid}/tasks/${task.id}`);
    await update(taskRef, { completed: true });
  };
  const handleDelete = async () => {
    const taskRef = ref(db, `/users/${user.uid}/tasks/${task.id}`);
    await remove(taskRef);
  };
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h3 className="font-bold text-lg mb-1">{task.title}</h3>
        {task.description && <p className="text-gray-600 mb-1">{task.description}</p>}
        <div className="flex gap-2 items-center text-sm">
          <span className={`px-2 py-1 rounded text-white bg-${
            task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'
          }-600`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
          {task.deadline && <span className="ml-2">Due: {task.deadline}</span>}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {!task.completed && (
          <button
            onClick={handleComplete}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Mark Complete
          </button>
        )}
        <button
          onClick={handleDelete}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
