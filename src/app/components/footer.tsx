// app/components/footer/Footer.tsx
export default function Footer() {
  return (
    <footer className=" text-primary py-12 max-w-screen">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Haile Resorts</h3>
          <p>
            Multi-branch resort brand offering unforgettable stays in Ethiopia’s
            top destinations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li>
              <a href="#branches" className="hover:underline">
                Branches
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#booking" className="hover:underline">
                Book Now
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Email: info@haileresorts.com</p>
          <p>Phone: +251-123-456-789</p>
          <p>Address: Addis Ababa, Ethiopia</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-primary">
              Fb
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-primary">
              IG
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-primary">
              YT
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} Haile Resorts. All rights reserved.
      </div>
    </footer>
  );
}
