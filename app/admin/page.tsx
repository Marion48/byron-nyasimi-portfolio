import Link from "next/link";

export default function AdminDashboard() {
  const sections = [
    {
      title: "Homepage",
      description: "Edit hero image, title, subtitle",
      href: "/admin/homepage",
      icon: "🏠"
    },
    {
      title: "Artist Information",
      description: "Edit artist biography, portrait, CV",
      href: "/admin/artist",
      icon: "👤"
    },
    {
      title: "Artworks",
      description: "Upload, edit, reorder artworks",
      href: "/admin/artworks",
      icon: "🖼️"
    },
    {
      title: "Contact Info",
      description: "Edit studio, gallery, social links",
      href: "/admin/contact",
      icon: "📞"
    },
    {
      title: "Messages",
      description: "View and respond to contact form submissions",
      href: "/admin/messages",
      icon: "✉️"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-light text-gray-900 mb-12">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group border border-gray-100 p-8 hover:border-gray-300 transition"
          >
            <span className="text-3xl mb-4 block">{section.icon}</span>
            <h3 className="text-sm tracking-[0.3em] uppercase text-gray-900 mb-2">
              {section.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}