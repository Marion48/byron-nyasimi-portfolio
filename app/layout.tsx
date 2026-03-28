import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Byron Nyasimi",
  description: "Contemporary Abstract Artist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-serif">
        <header className="absolute top-0 left-0 w-full z-50">
          <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <div className="text-lg tracking-widest uppercase">
              {/* Empty for logo/monogram */}
            </div>
            <ul className="flex space-x-10 text-sm uppercase tracking-widest">
              <li><a href="/">Home</a></li>
              <li><a href="/artist">Artist Information</a></li>
              <li><a href="/artworks">Artworks</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}