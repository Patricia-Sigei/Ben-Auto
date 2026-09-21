import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Cars", to: "/cars" },
  { label: "Import", to: "/import" },
  { label: "Reviews", to: "/reviews" },
  { label: "News & Guides", to: "/news" },
  { label: "Lifestyle", to: "/lifestyle" },
  { label: "Travel", to: "/travel" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-charcoal-950/95 backdrop-blur-md shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 py-4">
        <Link
          to="/"
          className="font-display text-xl md:text-2xl tracking-wide text-ivory"
        >
          DriveLux<span className="text-accent">Imports</span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? "text-accent" : "text-ivory/80 hover:text-ivory"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/consultation"
            className="hidden md:inline-block bg-accent text-charcoal-950 text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-accent-light transition-colors"
          >
            Request Consultation
          </Link>
          <button
            aria-label="Toggle menu"
            className="lg:hidden text-ivory p-2"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-ivory mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ivory mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ivory"></span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden bg-charcoal-900 border-t border-charcoal-700 px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="text-ivory/85 text-sm py-1"
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/consultation"
            onClick={() => setMenuOpen(false)}
            className="bg-accent text-charcoal-950 text-sm font-medium px-5 py-3 rounded-sm text-center mt-2"
          >
            Request Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
