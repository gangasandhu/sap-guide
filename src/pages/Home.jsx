// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { Arrow, Sparkle, SearchIcon, ReceivingIcon, VendorsIcon, OrdersIcon, ErrorsIcon, BarcodeIcon } from "../assets/icons";

export default function Home() {
  const [q, setQ] = useState("");

  const sections = [
    {
      heading: "Core Workflows",
      items: [
        { to: "/receiving", title: "Receiving", desc: "DSD & DC workflows, POD checks.", icon: ReceivingIcon },
        { to: "/orders", title: "Orders", desc: "Create & manage POs (with/without ref).", icon: OrdersIcon },
        { to: "/returns", title: "Processing Returns", desc: "Credits are processed for returned items", icon: ErrorsIcon },
      ],
    },
    {
      heading: "Support & Fixes",
      items: [
        { to: "/damages", title: "Handling Damages", desc: "Processing damages and candy credits in SAP", icon: ErrorsIcon },
        { to: "/errors", title: "Troubleshooting", desc: "Fix common SAP & Zebra issues.", icon: ErrorsIcon },
      ],
    },
    {
      heading: "Lookups & Tools",
      items: [
        { to: "/vendors", title: "Vendors", desc: "Vendor numbers & rush order flow.", icon: VendorsIcon },
        { to: "/barcodes", title: "Barcodes", desc: "Product → Article → Barcode map.", icon: BarcodeIcon },
      ],
    },
  ];

  const matches = (c) =>
    c.title.toLowerCase().includes(q.toLowerCase()) ||
    c.desc.toLowerCase().includes(q.toLowerCase());

  const filteredSections = sections.map((sec) => ({ ...sec, items: sec.items.filter(matches) }));
  const hasAny = filteredSections.some((s) => s.items.length > 0);

  return (
    <div className="relative overflow-hidden">
      {/* --- Multicolor Background Layers --- */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft base vertical gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-indigo-50" />
        {/* radial color blooms */}
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),rgba(99,102,241,0)_60%)] blur-2xl" />
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),rgba(59,130,246,0)_60%)] blur-2xl" />
        <div className="absolute bottom-[-6rem] left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.16),rgba(14,165,233,0)_60%)] blur-2xl" />
        {/* conic highlight band */}
        <div className="absolute inset-x-0 top-32 mx-auto h-64 w-[120%] -rotate-2 bg-[conic-gradient(from_160deg,rgba(16,185,129,0.12),rgba(59,130,246,0.12),rgba(99,102,241,0.12),rgba(16,185,129,0.12))] blur-3xl" />
        {/* subtle grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:28px_28px]"
        />
      </div>

      {/* Page container */}
      <div className="relative mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* Hero */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/70 px-3 py-1 text-xs text-blue-600 shadow-sm backdrop-blur">
            Ganga Singh's
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            SAP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">Receiving Guide</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 max-w-2xl mx-auto">
            Clear steps, quick lookups, and fixes—so receiving gets done right the first time.
          </p>

        {/* CTA row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-white font-medium shadow hover:shadow-lg transition"
            >
              Task Manager <Arrow />
            </Link>
            <Link
              to="https://sapbarcodegen.netlify.app"
              className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/80 px-4 py-2.5 text-gray-700 hover:border-blue-200 hover:text-blue-600 transition backdrop-blur"
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
              className="w-full rounded-2xl border border-white/70 bg-white/80 backdrop-blur px-4 py-3 pr-10 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 shadow"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">Tip: try “rush order” or “POD”.</p>
        </section>

        {/* Grouped sections */}
        <div className="space-y-10">
          {filteredSections.map(({ heading, items }) =>
            items.length > 0 ? (
              <section key={heading} className="space-y-4">
                {/* section header with accent */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    <span className="relative">
                      {heading}
                      <span className="absolute -bottom-1 left-0 h-1 w-9 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500/80" />
                    </span>
                  </h2>
                  <span className="text-xs text-gray-500">{items.length} link{items.length > 1 ? "s" : ""}</span>
                </div>

                {/* cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {items.map(({ to, title, desc, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="group relative rounded-2xl border border-white/60 bg-white/70 p-5 sm:p-6 shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-lg backdrop-blur"
                    >
                      {/* corner gradient shimmer */}
                      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-400/10 via-transparent to-emerald-400/10 opacity-0 group-hover:opacity-100 transition" />
                      <div className="relative flex items-start gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 p-2 shadow-sm">
                          <Icon />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
                          <p className="mt-1 text-sm text-gray-600">{desc}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-blue-600 text-sm font-medium">
                            Open <Arrow className="transition group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>

        {!hasAny && (
          <div className="text-center text-gray-500 py-8 border border-dashed border-gray-200/80 rounded-2xl bg-white/70 backdrop-blur">
            No matches. Try a different keyword.
          </div>
        )}

        {/* tiny motion hint for users who like a bit of life; respects reduced motion */}
        <div className="pointer-events-none select-none text-center text-[10px] text-gray-400">
          <span className="sr-only">decorative</span>
        </div>
      </div>
    </div>
  );
}
