"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function GmailIntegration() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGmailMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/gmail/messages");
      if (!response.ok) {
        throw new Error("Failed to fetch messages.");
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-gray-500">Loading Google Auth...</div>;
  }

  if (session) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
        <h2 className="text-xl font-semibold mb-4">Google Integration</h2>
        <p className="mb-4 text-gray-700">Connected as: <strong>{session.user?.email}</strong></p>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={fetchGmailMessages}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Fetch Recent Emails"}
          </button>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect Google
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {messages.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-4">Recent Gmail Messages:</h3>      
            <ul className="space-y-4">
              {messages.map((msg, index) => (
                <li key={msg.id || index} className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h4 className="font-bold text-gray-900 line-clamp-1">{msg.subject || "No Subject"}</h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap pt-1 flex-shrink-0">{msg.date || "No Date"}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    From: <span className="font-medium text-gray-800">{msg.from || "Unknown Sender"}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3 leading-relaxed">
                    {msg.snippet || "No preview available..."}
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                    ID: {msg.id}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-4">Ready for AI processing.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold mb-4">Google Integration</h2>
      <p className="mb-4 text-gray-600">Connect your Google account to fetch emails for AI processing.</p>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Connect Gmail
      </button>
    </div>
  );
}
