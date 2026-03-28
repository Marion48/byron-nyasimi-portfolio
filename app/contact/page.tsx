"use client";

import { useState, useEffect } from "react";

interface ContactInfo {
  studio_address: string;
  studio_email: string;
  gallery_name: string;
  gallery_email: string;
  instagram_url: string;
  artsy_url: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      const data = await response.json();
      setContactInfo(data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        setStatus("error");
        console.error('Error:', data.error);
      }
    } catch (error) {
      setStatus("error");
      console.error('Error:', error);
    }
  };

  // Rest of your JSX remains IDENTICAL
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 pt-40 pb-32">
        <div className="mb-24 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.4em] uppercase text-gray-900">
            CONTACT
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-3">
            Gallery inquiries · Studio visits
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                Studio
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {contactInfo?.studio_address || "Byron Nyasimi Studio\nNairobi, Kenya"}
                </p>
                <p className="text-sm">
                  <a 
                    href={`mailto:${contactInfo?.studio_email || 'studio@byronnyasimi.com'}`} 
                    className="hover:text-gray-900 transition"
                  >
                    {contactInfo?.studio_email || 'studio@byronnyasimi.com'}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                Representation
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-sm leading-relaxed">
                  {contactInfo?.gallery_name || "Circle Art Gallery"}
                </p>
                <p className="text-sm">
                  <a 
                    href={`mailto:${contactInfo?.gallery_email || 'info@circleartgallery.com'}`} 
                    className="hover:text-gray-900 transition"
                  >
                    {contactInfo?.gallery_email || 'info@circleartgallery.com'}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                Social
              </h2>
              <div className="space-y-2">
                <a 
                  href={contactInfo?.instagram_url || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Instagram
                </a>
                <a 
                  href={contactInfo?.artsy_url || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Artsy
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-3">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 focus:border-gray-400 outline-none text-sm transition"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-3">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 focus:border-gray-400 outline-none text-sm transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-gray-500 block mb-3">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 focus:border-gray-400 outline-none text-sm transition resize-none"
                  placeholder="Your message..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-8 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-gray-900 transition disabled:bg-gray-400"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </div>

              {status === "success" && (
                <p className="text-sm text-green-600 pt-4">
                  Message sent successfully. We'll respond within 48 hours.
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-red-600 pt-4">
                  Error sending message. Please try again or email directly.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-32 pt-32 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            For all inquiries, please use the contact form or email directly.
          </p>
        </div>
      </div>
    </div>
  );
}