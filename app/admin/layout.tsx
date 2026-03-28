"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth');
        if (!response.ok) {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="border-b border-gray-100 pb-6 mb-6">
          <h1 className="text-lg tracking-[0.3em] uppercase text-gray-900">
            ADMIN PANEL
          </h1>
        </div>

        <div className="mb-12">
          <button
            onClick={handleLogout}
            className="text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition"
          >
            LOGOUT
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}