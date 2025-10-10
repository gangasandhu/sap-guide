// src/pages/Receiving.jsx
import { useMemo, useState } from "react";
import { SearchIcon, Arrow } from "../assets/icons.jsx";
import data from "../data/receiving.json";

export default function Receiving() {
  const items = data.receiving ?? [];
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        (it.notes ?? "").toLowerCase().includes(q) ||
        (it.example ?? "").toLowerCase().includes(q) ||
        (it.steps ?? []).some((s) => s.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Multicolor background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-indigo-50" />
        <div className="absolute -top-28 -left-20 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25),rgba(99,102,241,0)_60%)] blur-2xl" />
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),rgba(59,130,246,0)_60%)] blur-2xl" />
        <div className="absolute bottom-[-8rem] left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.16),rgba(16,185,129,0)_60%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto max-w-5xl px-3 sm:px-4 md:px-6 py-10 space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
              Receiving
            </span>
          </h1>
          <p className="text-gray-600 max-w-xl">
            DSD, DC, and POD workflows with clear steps and quick lookups.
          </p>

          <div className="mt-5 max-w-md relative">
            <input
              id="receiving-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: invoice, ASN, pallet, POD…"
              className="w-full rounded-2xl border border-gray-200 bg-white/80 backdrop-blur px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
          </div>
        </header>

        {/* Sections */}
        <section className="grid grid-cols-1 gap-4 sm:gap-6">
          {filtered.map((item) => (
            <AccordionItem key={item.id} item={item} />
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500 bg-white/70 backdrop-blur">
              No matches found.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- Accordion Section ---------- */
function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative rounded-2xl border border-white/70 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm transition hover:shadow-md">
      {/* subtle gradient sheen on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-400/10 via-transparent to-emerald-400/10 opacity-0 group-hover:opacity-100 transition" />

      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          {item.notes && (
            <p className={`${open && "hidden"} mt-1 text-sm text-gray-600 line-clamp-1`}>{item.notes}</p>
          )}
        </div>

        <span
          className={`ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white/70 ${
            open ? "border-blue-500 text-blue-600 rotate-90" : "border-gray-300 text-gray-400"
          } transition-transform`}
        >
          <Arrow />
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {item.notes && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm text-blue-800">
              {item.notes}
            </div>
          )}

          {Array.isArray(item.steps) && item.steps.length > 0 ? (
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-800">
              {item.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-600 bg-white/60">
              This section will show the exact steps to retrieve a POD for any received document.
            </div>
          )}

          {item.example && (
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Example: </span>
              {item.example}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
