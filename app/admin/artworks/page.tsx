"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artwork {
  id: number;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  image_url: string;
  display_order: number;
}

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await fetch('/api/artworks');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
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
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editing?.image_url || '';
    
    if (selectedFile) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const { url } = await uploadResponse.json();
      imageUrl = url;
      setUploading(false);
    } else if (!editing?.image_url && !selectedFile) {
      alert('Please select an image');
      return;
    }

    const artworkData = {
      title: formData.get('title'),
      year: formData.get('year'),
      medium: formData.get('medium'),
      dimensions: formData.get('dimensions'),
      description: formData.get('description'),
      image_url: imageUrl,
      display_order: artworks.length,
    };

    try {
      const response = await fetch('/api/artworks', {
        method: editing?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing?.id ? { id: editing.id, ...artworkData } : artworkData),
      });

      if (response.ok) {
        setEditing(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        await fetchArtworks();
        
        // Revalidate pages
        await fetch('/api/revalidate?path=/artworks');
        alert(editing?.id ? 'Artwork updated!' : 'Artwork added!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error saving artwork');
      }
    } catch (error) {
      console.error("Error saving artwork:", error);
      alert('Error saving artwork');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this artwork?')) {
      try {
        const response = await fetch(`/api/artworks?id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          await fetchArtworks();
          await fetch('/api/revalidate?path=/artworks');
          alert('Artwork deleted');
        }
      } catch (error) {
        console.error("Error deleting artwork:", error);
        alert('Error deleting artwork');
      }
    }
  };

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const index = artworks.findIndex(a => a.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === artworks.length - 1)) return;

    const newOrder = [...artworks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];

    try {
      const response = await fetch('/api/artworks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworks: newOrder }),
      });
      
      if (response.ok) {
        setArtworks(newOrder);
        await fetch('/api/revalidate?path=/artworks');
      } else {
        throw new Error('Reorder failed');
      }
    } catch (error) {
      console.error("Error reordering:", error);
      alert('Error reordering artworks');
      await fetchArtworks();
    }
  };

  const openEditModal = (artwork: Artwork) => {
    setEditing(artwork);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  // Rest of the JSX remains IDENTICAL to your original - keeping all design
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-light text-gray-900">Manage Artworks</h2>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              setEditing({} as Artwork);
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className="bg-black text-white px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-gray-900"
          >
            + New Artwork
          </button>
        </div>
      </div>

      {/* Edit Form Modal - Keep your exact JSX */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full my-8 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg tracking-[0.3em] uppercase text-gray-900">
                {editing.id ? 'Edit Artwork' : 'New Artwork'}
              </h3>
              <button
                onClick={() => {
                  setEditing(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-2xl text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={editing.title || ''}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
                  required
                />
              </div>

              {/* Year & Medium */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
                    Year
                  </label>
                  <input
                    name="year"
                    defaultValue={editing.year || ''}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
                    Medium
                  </label>
                  <input
                    name="medium"
                    defaultValue={editing.medium || ''}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
                    required
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
                  Dimensions
                </label>
                <input
                  name="dimensions"
                  defaultValue={editing.dimensions || ''}
                  placeholder="e.g. 100×100 cm"
                  className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editing.description || ''}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-gray-400 outline-none text-sm"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-2">
                  Artwork Image {editing.image_url && '(Upload new to replace)'}
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full text-sm"
                />
                
                {/* Image Preview */}
                {(previewUrl || editing.image_url) && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      {previewUrl ? 'New Image:' : 'Current Image:'}
                    </p>
                    <img 
                      src={previewUrl || editing.image_url || ''} 
                      alt="Preview" 
                      className="h-32 w-auto object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/200x200?text=Invalid+Image";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="px-6 py-3 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
                >
                  Cancel
                </button>
                {editing.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editing.id)}
                    className="px-6 py-3 text-xs tracking-[0.2em] uppercase text-red-500 border border-red-200 hover:border-red-400"
                  >
                    Delete Artwork
                  </button>
                )}
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-black text-white px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-gray-900 disabled:bg-gray-400"
                >
                  {uploading ? 'Uploading...' : 'Save Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Artworks List */}
      <div className="space-y-4">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className="flex items-center border border-gray-100 p-4 hover:border-gray-300 transition"
          >
            <div className="w-16 h-16 bg-gray-50 mr-6 shrink-0">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/64x64?text=Error";
                }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-light text-gray-900 mb-1">
                {artwork.title}
              </h4>
              <p className="text-xs text-gray-500">
                {artwork.year} · {artwork.medium} · {artwork.dimensions}
              </p>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleReorder(artwork.id, 'up')}
                disabled={index === 0}
                className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 text-lg"
                title="Move Up"
              >
                ↑
              </button>
              <button
                onClick={() => handleReorder(artwork.id, 'down')}
                disabled={index === artworks.length - 1}
                className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 text-lg"
                title="Move Down"
              >
                ↓
              </button>
              <button
                onClick={() => openEditModal(artwork)}
                className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-gray-200 hover:border-gray-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(artwork.id)}
                className="px-4 py-2 text-xs tracking-[0.2em] uppercase text-red-500 border border-red-200 hover:border-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {artworks.length === 0 && (
          <div className="text-center py-12 border border-gray-100">
            <p className="text-sm text-gray-500">No artworks yet. Click "New Artwork" to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
}