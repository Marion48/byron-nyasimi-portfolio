"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
      });
      fetchMessages();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (confirm('Delete this message?')) {
      try {
        await fetch(`/api/messages?id=${id}`, { method: 'DELETE' });
        fetchMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  // Rest of your JSX remains IDENTICAL
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-gray-900">Contact Messages</h2>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`border p-4 hover:border-gray-300 transition cursor-pointer ${
              message.status === 'unread' ? 'bg-gray-50' : 'bg-white'
            }`}
            onClick={() => setSelected(message)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-light text-gray-900">
                  {message.name}
                </h4>
                <p className="text-xs text-gray-500">{message.email}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(message.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {message.message}
            </p>
            {message.status === 'unread' && (
              <span className="inline-block mt-2 text-xs bg-black text-white px-2 py-1">
                Unread
              </span>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 border border-gray-100">
            <p className="text-sm text-gray-500">No messages yet.</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg tracking-[0.3em] uppercase text-gray-900">
                Message from {selected.name}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="text-2xl text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-800">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Date</p>
                <p className="text-sm text-gray-800">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Message</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                {selected.status === 'unread' && (
                  <button
                    onClick={() => {
                      markAsRead(selected.id);
                      setSelected(null);
                    }}
                    className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteMessage(selected.id);
                    setSelected(null);
                  }}
                  className="px-4 py-2 text-xs tracking-[0.2em] uppercase text-red-500 border border-red-200 hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}