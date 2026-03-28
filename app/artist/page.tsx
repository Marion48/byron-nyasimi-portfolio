"use client";

import { useState, useEffect, useCallback } from "react";

interface ArtistData {
  name: string;
  portrait_url: string;
  bio: string;
  born: string;
  education: string;
  represented_by: string;
  cv: any[] | null;
}

export default function ArtistPage() {
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArtist = useCallback(async () => {
    try {
      const response = await fetch('/api/artist');
      const data = await response.json();
      setArtistData(data);
    } catch (error) {
      console.error("Error fetching artist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtist();
    
    const interval = setInterval(fetchArtist, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchArtist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading artist information...</p>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Artist information not available.</p>
      </div>
    );
  }

  const cvItems = Array.isArray(artistData.cv) ? artistData.cv : [];

  // Rest of your JSX remains IDENTICAL
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 pt-40 pb-32">
        <div className="mb-24 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.4em] uppercase text-gray-900">
            ARTIST
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-6">
            <div className="relative w-full aspect-[3/4] bg-gray-50">
              <img
                src={artistData.portrait_url}
                alt={artistData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Portrait failed to load:", artistData.portrait_url);
                }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs tracking-[0.2em] uppercase text-gray-500">
                Portrait of the artist
              </p>
              <p className="text-xs text-gray-400">
                {artistData.born}, {artistData.education}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-3">
                  {artistData.name}
                </h2>
                <div className="w-12 h-px bg-gray-300"></div>
              </div>
              
              <div className="space-y-6 text-gray-600">
                {artistData.bio.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-sm md:text-base leading-relaxed font-light">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-6">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-3">
                  Represented by
                </p>
                <p className="text-sm text-gray-800">{artistData.represented_by}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12">
            Selected Exhibitions
          </h3>
          
          <div className="space-y-8">
            {cvItems.length > 0 ? (
              cvItems.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-[120px_1fr] gap-6 text-sm border-b border-gray-100 pb-6">
                  <span className="text-gray-500 font-light">{item.year}</span>
                  <div>
                    <span className="text-gray-900 font-light">{item.title}</span>
                    <span className="text-gray-500 mx-2">·</span>
                    <span className="text-gray-500 font-light">{item.venue}</span>
                    <span className="text-gray-400 ml-2 text-xs">({item.type})</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No exhibition history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}