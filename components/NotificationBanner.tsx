// components/NotificationBanner.tsx
'use client';
export default function NotificationBanner({ tasks }: { tasks: any[] }) {
  const highCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  if (!highCount) return null;
  return (
    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-center font-medium">
      You have {highCount} important task{highCount > 1 ? 's' : ''} today
    </div>
  );
}
