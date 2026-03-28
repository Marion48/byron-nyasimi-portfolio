"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ArtistData {
  id: number;
  name: string;
  portrait_url: string;
  bio: string;
  born: string;
  education: string;
  represented_by: string;
  cv: any[];
}

export default function AdminArtistPage() {
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchArtist();
  }, []);

  const fetchArtist = async () => {
    try {
      const response = await fetch('/api/artist');
      const data = await response.json();
      setArtist(data);
    } catch (error) {
      console.error("Error fetching artist:", error);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    let portraitUrl = artist?.portrait_url || '';
    
    if (selectedFile) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const { url } = await uploadResponse.json();
      portraitUrl = url;
      setUploading(false);
    }

    const artistData = {
      name: formData.get('name'),
      bio: formData.get('bio'),
      born: formData.get('born'),
      education: formData.get('education'),
      represented_by: formData.get('represented_by'),
      portrait_url: portraitUrl,
      cv: artist?.cv || [],
    };

    try {
      const response = await fetch('/api/artist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artistData),
      });

      if (response.ok) {
        setSelectedFile(null);
        setPreviewUrl(null);
        await fetchArtist();
        await fetch('/api/revalidate?path=/artist');
        alert('Artist information updated successfully!');
      } else {
        alert('Error saving artist information');
      }
    } catch (error) {
      console.error("Error saving artist:", error);
      alert('Error saving artist information');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete all artist information?')) {
      try {
        const response = await fetch('/api/artist', { method: 'DELETE' });
        if (response.ok) {
          setArtist(null);
          await fetch('/api/revalidate?path=/artist');
          alert('Artist information deleted.');
        }
      } catch (error) {
        console.error("Error deleting artist:", error);
        alert('Error deleting artist information');
      }
    }
  };

  const defaultData = {
    name: "Byron Nyasimi",
    portrait_url: "/archive/artist-portrait.jpg",
    bio: "Byron Nyasimi is a contemporary abstract painter based in Nairobi, Kenya.",
    born: "1990",
    education: "BFA, Creative Arts Centre, Nairobi",
    represented_by: "Circle Art Gallery",
    cv: []
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  // Rest of your JSX remains IDENTICAL (keeping all design)
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-gray-900">Edit Artist Information</h2>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      {(artist || defaultData) && (
        <div className="mb-8 p-6 bg-gray-50 border border-gray-100">
          <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">Current Preview</h3>
          <div className="flex items-center space-x-6">
            {(artist?.portrait_url || defaultData.portrait_url) && (
              <img 
                src={artist?.portrait_url || defaultData.portrait_url} 
                alt="Current portrait" 
                className="w-24 h-24 object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/200x200?text=Error";
                }}
              />
            )}
            <div>
              <p className="text-lg font-light text-gray-900 mb-1">{artist?.name || defaultData.name}</p>
              <p className="text-sm text-gray-600 mb-2">{artist?.born || defaultData.born} · {artist?.education || defaultData.education}</p>
              <p className="text-xs text-gray-500">Represented by: {artist?.represented_by || defaultData.represented_by}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Artist Name
          </label>
          <input
            name="name"
            defaultValue={artist?.name || defaultData.name}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
              Born
            </label>
            <input
              name="born"
              defaultValue={artist?.born || defaultData.born}
              className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
              Education
            </label>
            <input
              name="education"
              defaultValue={artist?.education || defaultData.education}
              className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Represented By
          </label>
          <input
            name="represented_by"
            defaultValue={artist?.represented_by || defaultData.represented_by}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Portrait Image {(artist?.portrait_url || defaultData.portrait_url) && '(Upload new to replace)'}
          </label>
          <input
            type="file"
            name="portrait"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full text-sm"
          />
          
          {(previewUrl || artist?.portrait_url || defaultData.portrait_url) && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">
                {previewUrl ? 'New Portrait:' : 'Current Portrait:'}
              </p>
              <img 
                src={previewUrl || artist?.portrait_url || defaultData.portrait_url} 
                alt="Portrait preview" 
                className="h-32 w-auto object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/200x200?text=Error";
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
            Biography
          </label>
          <textarea
            name="bio"
            defaultValue={artist?.bio || defaultData.bio}
            rows={10}
            className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm leading-relaxed"
            required
          />
          <p className="text-xs text-gray-400 mt-2">
            Use double line breaks (Enter twice) for new paragraphs
          </p>
        </div>

        {(artist?.cv || defaultData.cv) && artist?.cv?.length > 0 && (
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-4">Current CV/Exhibitions</h3>
            <div className="space-y-2">
              {(artist?.cv || defaultData.cv).map((item: any, i: number) => (
                <div key={i} className="text-sm text-gray-600">
                  {item.year} - {item.title}, {item.venue} ({item.type})
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-3 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
          >
            Cancel
          </button>
          {(artist || defaultData) && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 text-xs tracking-[0.2em] uppercase text-red-500 border border-red-200 hover:border-red-400"
            >
              Delete All Info
            </button>
          )}
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