"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface HomepageSettings {
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string;
}

export default function AdminHomepagePage() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/homepage');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'homepage');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.url) {
        console.log('✅ Hero image uploaded:', data.url);
        return data.url;
      }
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    let heroImageUrl = settings?.hero_image_url || '';
    
    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl) {
        heroImageUrl = uploadedUrl;
      } else {
        alert('Image upload failed');
        setSaving(false);
        return;
      }
    }

    const settingsData = {
      hero_image_url: heroImageUrl,
      hero_title: formData.get('hero_title'),
      hero_subtitle: formData.get('hero_subtitle'),
    };

    try {
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        setSelectedFile(null);
        setPreviewUrl(null);
        await fetchSettings();
        alert('Homepage updated successfully!');
      } else {
        alert('Error saving homepage settings');
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert('Error saving homepage settings');
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-gray-900">Edit Homepage</h2>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Current Preview */}
      <div className="mb-8 p-6 bg-gray-50 border border-gray-100">
        <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">Current Preview</h3>
        <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
          {settings?.hero_image_url && (
            <img 
              src={settings.hero_image_url} 
              alt="Hero preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/1200x600?text=Hero+Image";
              }}
            />
          )}
        </div>
        <div className="mt-4">
          <p className="text-lg font-light text-gray-900">{settings?.hero_title}</p>
          <p className="text-sm text-gray-600">{settings?.hero_subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Hero Image */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Hero Image {settings?.hero_image_url && '(Upload new to replace)'}
          </label>
          <input
            type="file"
            name="hero_image"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full text-sm"
          />
          {previewUrl && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">New Image Preview:</p>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-32 w-auto object-cover border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Hero Title */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Hero Title
          </label>
          <input
            name="hero_title"
            defaultValue={settings?.hero_title || "Byron Nyasimi"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
            required
          />
        </div>

        {/* Hero Subtitle */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Hero Subtitle
          </label>
          <input
            name="hero_subtitle"
            defaultValue={settings?.hero_subtitle || "Contemporary Abstract Artist"}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
            required
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-black text-white px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 disabled:bg-gray-400"
          >
            {saving || uploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}