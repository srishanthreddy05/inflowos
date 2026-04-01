// components/TaskList.tsx
'use client';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, loading, user }: { tasks: any[]; loading: boolean; user: any }) {
  const priorities = [
    { label: 'High Priority', value: 'high', color: 'red' },
    { label: 'Medium Priority', value: 'medium', color: 'yellow' },
    { label: 'Low Priority', value: 'low', color: 'green' },
  ];

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;
  if (!tasks.length) return <div className="text-center py-8 text-gray-400">No tasks yet</div>;

  return (
    <div className="flex flex-col gap-6">
      {priorities.map(({ label, value, color }) => {
        const group = tasks.filter(t => t.priority === value);
        if (!group.length) return null;
        return (
          <div key={value}>
            <h2 className={`font-semibold mb-2 text-${color}-600`}>{label}</h2>
            <div className="flex flex-col gap-3">
              {group.map(task => (
                <TaskCard key={task.id} task={task} user={user} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
