import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 border-t border-charcoal-700 mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <p className="font-display text-xl mb-3">
            DriveLux<span className="text-accent">Imports</span>
          </p>
          <p className="text-sm text-ivory/60 max-w-sm">
            Premium car sales and import specialists concept for the Kenyan
            market.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-ivory mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li>
              <Link to="/cars" className="hover:text-accent">
                Browse Cars
              </Link>
            </li>
            <li>
              <Link to="/import" className="hover:text-accent">
                Import a Car
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-accent">
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-accent">
                News & Guides
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-ivory mb-3">Company</p>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li>
              <Link to="/about" className="hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/consultation" className="hover:text-accent">
                Request Consultation
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-charcoal-700 py-5 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} DriveLux Imports. All rights reserved.
      </div>
    </footer>
  );
}
