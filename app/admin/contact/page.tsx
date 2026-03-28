"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ContactInfo {
  id: number;
  studio_address: string;
  studio_email: string;
  gallery_name: string;
  gallery_email: string;
  instagram_url: string;
  artsy_url: string;
}

export default function AdminContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await fetch('/api/contact-info');
      const data = await response.json();
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const contactData = {
      studio_address: formData.get('studio_address'),
      studio_email: formData.get('studio_email'),
      gallery_name: formData.get('gallery_name'),
      gallery_email: formData.get('gallery_email'),
      instagram_url: formData.get('instagram_url'),
      artsy_url: formData.get('artsy_url'),
    };

    try {
      const response = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        await fetchContact();
        await fetch('/api/revalidate?path=/contact');
        alert('Contact information updated!');
      }
    } catch (error) {
      console.error("Error saving contact info:", error);
      alert('Error saving contact information');
    } finally {
      setSaving(false);
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
        <h2 className="text-2xl font-light text-gray-900">Edit Contact Information</h2>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Studio Address (use \n for line breaks)
          </label>
          <textarea
            name="studio_address"
            defaultValue={contact?.studio_address || "Byron Nyasimi Studio\nNairobi, Kenya"}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Studio Email
          </label>
          <input
            name="studio_email"
            defaultValue={contact?.studio_email || "studio@byronnyasimi.com"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Gallery Name
          </label>
          <input
            name="gallery_name"
            defaultValue={contact?.gallery_name || "Circle Art Gallery"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Gallery Email
          </label>
          <input
            name="gallery_email"
            defaultValue={contact?.gallery_email || "info@circleartgallery.com"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Instagram URL
          </label>
          <input
            name="instagram_url"
            defaultValue={contact?.instagram_url || "https://instagram.com/byronnyasimi"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Artsy URL
          </label>
          <input
            name="artsy_url"
            defaultValue={contact?.artsy_url || "https://artsy.net/artist/byron-nyasimi"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}