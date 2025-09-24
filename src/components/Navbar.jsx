import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/receiving", label: "Receiving" },
    { to: "/vendors", label: "Vendors" },
    { to: "/orders", label: "Orders" },
    { to: "/errors", label: "Errors" },
    { to: "/barcodes", label: "Barcodes" },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-blue-500 font-bold tracking-tight">
          SAP Guide
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-2 py-1 text-gray-700 hover:text-blue-500"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-50"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="py-2 text-gray-700 hover:text-blue-500"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
