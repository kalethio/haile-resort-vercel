// app/components/footer/Footer.tsx
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

// Footer data - easily modifiable
const footerData = {
  company: {
    name: "Haile Resorts",
    description:
      "Multi-branch resort brand offering unforgettable stays in Ethiopia's top destinations.",
    services: [
      "Hospitality",
      "Coffee Export",
      "Event Planning",
      "Tour Packages",
    ],
  },
  contact: {
    email: "info@haileresorts.com",
    phone: "+251-123-456-789",
    address: "Addis Ababa, Ethiopia",
  },
  socialLinks: [
    {
      name: "Facebook",
      icon: FaFacebook,
      href: "#",
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "#",
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "#",
      color: "hover:text-red-500",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      href: "#",
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "#",
      color: "hover:text-blue-600",
    },
  ],
  quickLinks: [
    { name: "Branches", href: "#branches" },
    { name: "About Us", href: "#about" },
    { name: "Book Now", href: "#booking" },
    { name: "Contact", href: "#contact" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-primary py-12 max-w-screen">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-5 gap-8 text-sm">
        {/* About Section */}
        <div className="md:col-span-2 text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">
            {footerData.company.name}
          </h3>
          <p className="max-w-md mx-auto md:mx-0 leading-relaxed">
            {footerData.company.description}
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            {footerData.quickLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:underline transition-all duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-4">Our Services</h4>
          <ul className="space-y-3">
            {footerData.company.services.map((service) => (
              <li
                key={service}
                className="transition-all duration-200 hover:text-primary/80"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="text-center md:text-left">
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="space-y-2 mb-6">
            <p className="leading-relaxed">{footerData.contact.email}</p>
            <p className="leading-relaxed">{footerData.contact.phone}</p>
            <p className="leading-relaxed">{footerData.contact.address}</p>
          </div>

          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4 justify-center md:justify-start mb-6">
            {footerData.socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className={`text-xl transition-all duration-300 transform hover:scale-110 ${social.color}`}
                  title={social.name}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>

          <div className="mt-8 bg-accent/20 text-white py-3 px-6 rounded-lg max-w-fit mx-auto md:mx-0 transition-all duration-200 hover:bg-accent/30">
            <Link href="/admin" className="hover:underline font-medium">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-12 pt-6 border-t border-gray-700/30">
        © {currentYear} {footerData.company.name}. All rights reserved.
      </div>
    </footer>
  );
}
