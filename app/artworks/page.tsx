"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function Artworks() {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtworks = useCallback(async () => {
    try {
      const response = await fetch('/api/artworks');
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
    
    // Poll for updates every 5 seconds (simple replacement for realtime)
    const interval = setInterval(fetchArtworks, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchArtworks]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white artworks-nav">
        <div className="pt-32 pb-32 px-8 md:px-12 lg:px-16">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-16">
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.4em] uppercase text-gray-900">
                ARCHIVE
              </h1>
            </div>
            <div className="text-center py-20">
              <p className="text-sm text-gray-500">Loading artworks...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Rest of your JSX remains IDENTICAL
  return (
    <main className="min-h-screen bg-white artworks-nav">
      <div className="pt-32 pb-32 px-8 md:px-12 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <h1 className="text-2xl md:text-3xl font-light tracking-[0.4em] uppercase text-gray-900">
              ARCHIVE
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-2">
              Selected works · {artworks.length} pieces
            </p>
          </div>

          {artworks.length === 0 ? (
            <div className="text-center py-20 border border-gray-100">
              <p className="text-sm text-gray-500">No artworks yet. Add some in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {artworks.map((art) => (
                <div
                  key={art.id}
                  className="group cursor-pointer"
                  onClick={() => setSelected(art)}
                >
                  <div className="relative w-full bg-gray-50">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={art.image_url}
                        alt={art.title}
                        className="w-full h-full object-contain bg-gray-50 transition duration-700 group-hover:scale-[1.02]"
                        loading="lazy"
                        onError={(e) => {
                          console.log("Image failed to load:", art.image_url);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-6 space-y-1.5">
                    <h2 className="text-sm font-light tracking-[0.2em] uppercase text-gray-800">
                      {art.title}
                    </h2>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{art.year}</span>
                      <span className="w-px h-3 bg-gray-300"></span>
                      <span className="font-light">{art.medium}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 md:p-12"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-6xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl font-light"
            >
              ×
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gray-50 p-8 md:p-12 flex items-center justify-center">
                <div className="relative w-full">
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    className="w-full h-auto object-contain max-h-[70vh]"
                    onError={(e) => {
                      console.log("Modal image failed to load:", selected.image_url);
                    }}
                  />
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
                      {selected.title}
                    </h2>
                    <div className="w-12 h-px bg-gray-300 my-4"></div>
                  </div>
                  
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Year</dt>
                      <dd className="text-sm text-gray-800">{selected.year}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Medium</dt>
                      <dd className="text-sm text-gray-800">{selected.medium}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-1">Dimensions</dt>
                      <dd className="text-sm text-gray-800">{selected.dimensions}</dd>
                    </div>
                  </dl>
                  
                  <p className="text-sm text-gray-600 leading-relaxed pt-4 border-t border-gray-100">
                    {selected.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}