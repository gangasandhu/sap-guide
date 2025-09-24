// src/pages/Orders.jsx
import { useMemo, useState } from "react";
import data from "../data/orders.json";
import { SearchIcon, Arrow } from "../assets/icons.jsx";

export default function Orders() {
  const items = data.orders ?? [];
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(term) ||
        (it.notes ?? "").toLowerCase().includes(term) ||
        (it.example ?? "").toLowerCase().includes(term) ||
        it.steps.some((s) => s.toLowerCase().includes(term))
    );
  }, [items, q]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Orders</h1>
        <p className="text-gray-600">
          Rush orders and Ad Match (promo) orders—kept simple. Numbered steps for fast reading.
        </p>

        {/* Search */}
        <div className="max-w-md">
          <label htmlFor="orders-search" className="sr-only">Search</label>
          <div className="relative">
            <input
              id="orders-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: rush, delivery date, F12…"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
          </div>
        </div>
      </header>

      {/* Cards */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6">
        {filtered.map((item) => (
          <OrderCard key={item.id} item={item} />
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
            No matches.
          </div>
        )}
      </section>
    </div>
  );
}

function OrderCard({ item }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <button
        className="w-full flex items-center justify-between text-left px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 transition"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">{item.title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{item.steps.length} steps</p>
        </div>
        <span
          className={`ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full border ${
            open ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-400"
          }`}
        >
          <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
            <Arrow />
          </span>
        </span>
      </button>

      {/* Card body */}
      {open && (
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Notes */}
          {item.notes && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {item.notes}
            </div>
          )}

          {/* Steps — simple ordered list */}
          <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-800">
            {item.steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>

          {/* Example */}
          {item.example && (
            <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Example: </span>
              {item.example}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
