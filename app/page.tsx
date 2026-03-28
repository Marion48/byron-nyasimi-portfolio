"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HomepageSettings {
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string;
}

export default function Home() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/homepage');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching homepage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="relative h-screen w-full home-page">
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        <header className="absolute top-0 left-0 w-full z-50 text-white">
          <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <div className="text-lg tracking-widest uppercase"></div>
            <ul className="flex space-x-10 text-sm uppercase tracking-widest">
              <li><a href="/">Home</a></li>
              <li><a href="/artist">Artist Information</a></li>
              <li><a href="/artworks">Artworks</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
      </main>
    );
  }

  return (
    <main className="relative h-screen w-full home-page">
      <Image
        src={settings?.hero_image_url || "/archive/hero.jpg"}
        alt="Featured Artwork"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Hero text - WHITE */}
      <div className="absolute bottom-16 left-16 text-white">
        <h1 className="text-5xl tracking-widest uppercase">
          {settings?.hero_title || "Byron Nyasimi"}
        </h1>
        <p className="mt-4 text-sm tracking-widest uppercase">
          {settings?.hero_subtitle || "Contemporary Abstract Artist"}
        </p>
      </div>

      {/* Navbar - WHITE like the hero text */}
      <header className="absolute top-0 left-0 w-full z-50 text-white">
        <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="text-lg tracking-widest uppercase">
            {/* Empty for logo */}
          </div>
          <ul className="flex space-x-10 text-sm uppercase tracking-widest">
            <li><a href="/">Home</a></li>
            <li><a href="/artist">Artist Information</a></li>
            <li><a href="/artworks">Artworks</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
    </main>
  );
}