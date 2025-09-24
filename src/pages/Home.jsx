// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { Arrow, Sparkle, SearchIcon, Check, Dot, ReceivingIcon, VendorsIcon, OrdersIcon, ErrorsIcon, BarcodeIcon} from "../assets/icons"

export default function Home() {
  const [q, setQ] = useState("");

  const cards = [
    { to: "/receiving", title: "Receiving", desc: "DSD & DC workflows, POD checks.", icon: ReceivingIcon },
    { to: "/vendors", title: "Vendors", desc: "Vendor numbers & rush order flow.", icon: VendorsIcon },
    { to: "/orders", title: "Orders", desc: "Create & manage POs (with/without ref).", icon: OrdersIcon },
    { to: "/errors", title: "Troubleshooting", desc: "Fix common SAP & Zebra issues.", icon: ErrorsIcon },
    { to: "/barcodes", title: "Barcodes", desc: "Product → Article → Barcode map.", icon: BarcodeIcon },
  ];

  const filtered = cards.filter(
    c => c.title.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />

      <div className="relative mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs text-blue-500 shadow-sm backdrop-blur">
            Ganga Singh's
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            SAP <span className="text-blue-500">Receiving Guide</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 max-w-2xl mx-auto">
            Clear steps, quick lookups, and fixes—so receiving gets done right the first time.
          </p>

          {/* CTA row */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/receiving"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-white font-medium shadow hover:shadow-lg transition"
            >
            Receiving Docs<Arrow />
            </Link>
            <Link
              to="https://sapbarcodegen.netlify.app"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 hover:border-blue-200 hover:text-blue-500 transition"
            >
              Barcode Generator <Sparkle />
            </Link>
          </div>
        </header>

        {/* Search */}
        <section className="max-w-2xl mx-auto w-full">
          <label htmlFor="site-search" className="sr-only">Search</label>
          <div className="relative">
            <input
              id="site-search"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: receiving, vendors, errors, barcode…"
              className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-3 pr-10 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 shadow"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">Tip: try “rush order” or “POD”.</p>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(({ to, title, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-5 sm:p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-50 text-blue-500 p-2 shadow-sm">
                  <Icon />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-blue-500 text-sm font-medium">
                    Open <Arrow className="transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8 border border-dashed border-gray-200 rounded-2xl">
              No matches. Try a different keyword.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

/* ---------- tiny inline icons (no deps) ---------- */
// function Arrow(props) {
//   return (
//     <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
//     </svg>
//   );
// }
// function Sparkle() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3zM19 14l.8 1.8L22 17l-2.2 1.2L19 20l-.8-1.8L16 17l2.2-1.2L19 14zM5 14l.8 1.8L8 17l-2.2 1.2L5 20l-.8-1.8L2 17l2.2-1.2L5 14z"/>
//     </svg>
//   );
// }
// function SearchIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
//     </svg>
//   );
// }
// function Check() {
//   return (
//     <svg viewBox="0 0 24 24" className="mt-0.5 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//     </svg>
//   );
// }
// function Dot() {
//   return <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />;
// }
// function ReceivingIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
//     </svg>
//   );
// }
// function VendorsIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M6 7v10h12V7M8 11h8M8 15h6" />
//     </svg>
//   );
// }
// function OrdersIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10l2 3v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6l2-2zM8 9h8M8 13h6" />
//     </svg>
//   );
// }
// function ErrorsIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
//     </svg>
//   );
// }
// function BarcodeIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M4 6v12M7 6v12M10 6v12M12 6v12M15 6v12M18 6v12M20 6v12" strokeLinecap="round" />
//     </svg>
//   );
// }
