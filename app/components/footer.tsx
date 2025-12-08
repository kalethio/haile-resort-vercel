// app/components/footer/Footer.tsx
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";

const footerData = {
  company: {
    name: "Haile Resorts",
    description:
      "Multi-branch resort brand offering unforgettable stays in Ethiopia's top destinations.",
    services: [
      "Restaurant",
      "Spa - Beauty & Health",
      "Swimming Pool",
      "Health and Fitness",
      "Conference Room",
      "Multi-purpose Halls ",
    ],
  },
  sisterCompanies: [
    {
      name: "Ayelech Degefu Memorial School (ADMS)",
      href: "https://hailealem.com/",
    },
    { name: "Alem Cinema", href: "https://hailealem.com/" },
    { name: "Alem Fitness Center", href: "https://hailealem.com/" },
    { name: "Haile Agriculture", href: "https://hailealem.com/" },
    { name: "Haile Hospitality Group", href: "https://hailealem.com/" },
    { name: "Haile Real Estate", href: "https://hailealem.com/" },
  ],
  contact: {
    emails: ["book@haileresorts.com", "groupreservation@haileresorts.com"],
    phone: "+251 956 79 79 79",
    mobile: "+251 956 79 79 79",
    hotline: "8169",
    telephone: "+251 116 92 20 56/57/58",
    whatsapp: "+251956797979",
  },
  socialLinks: [
    {
      name: "Facebook",
      icon: FaFacebook,
      href: "https://www.facebook.com/share/19L8BofSDc/",
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/hailehotelsandresorts?igsh=ZjkxajZwZDMwcmIw",
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: "https://youtube.com/@hailehotelsandresorts4483?feature=shared",
      color: "hover:text-red-500",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/hailehotelsandresorts/",
      color: "hover:text-blue-600",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      href: "https://www.tiktok.com/@haile_resorts?_t=ZM-90ays9VSmWS&_r=1",
      color: "hover:text-black",
    },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-primary py-12 max-w-[80vw] mx-auto">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-6 gap-8 text-sm">
        {/* About Section */}
        <div className="md:col-span-2 text-center md:text-left mb-8 md:mb-0">
          <h3 className="mb-4">{footerData.company.name}</h3>
          <p className="max-w-md mx-auto md:mx-0 leading-relaxed">
            {footerData.company.description}
          </p>
        </div>

        {/* Services */}
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h4 className="mb-4">Our Services</h4>
          <ul className="space-y-2">
            {footerData.company.services.map((service) => (
              <li key={service} className="hover:text-primary/80">
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Sister Companies */}
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h4 className="mb-4">Sister Companies</h4>
          <ul className="space-y-2">
            {footerData.sisterCompanies.map((company) => (
              <li key={company.name}>
                <a
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary/80 hover:underline"
                >
                  {company.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="text-center md:text-left md:col-span-2">
          <h4 className="mb-4">Contact</h4>
          <div className="space-y-1 mb-4 text-xs">
            {footerData.contact.emails.map((email) => (
              <p key={email}>{email}</p>
            ))}
            <p>Mobile: {footerData.contact.mobile}</p>
            <p>Hotline: {footerData.contact.hotline}</p>
            <p>Telephone: {footerData.contact.telephone}</p>
            <p>WhatsApp: {footerData.contact.whatsapp}</p>
          </div>

          <h4 className="mb-4">Follow Us</h4>
          <div className="flex gap-4 justify-center md:justify-start mb-4">
            {footerData.socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xl hover:scale-110 transition-transform ${social.color}`}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>

          <div className="mt-4 bg-accent/20 text-white py-2 px-6 rounded-lg max-w-fit mx-auto md:mx-0">
            <Link href="/login">Admin Panel</Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-700/30">
        © {currentYear} {footerData.company.name}. All rights reserved.
      </div>
    </footer>
  );
}
