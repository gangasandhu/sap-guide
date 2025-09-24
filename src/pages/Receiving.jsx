import { useEffect, useMemo, useState } from "react";
import { SearchIcon, Check, Arrow } from "../assets/icons.jsx";
import data from "../data/receiving.json"; // vite supports json imports

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
        it.steps.some((s) => s.toLowerCase().includes(q))
    );
  }, [items, query]);

  function resetAll() {
    items.forEach((it) => localStorage.removeItem(keyFor(it.id)));
    setQuery((s) => s); // force re-render
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Receiving</h1>
        <p className="text-gray-600">
          DSD, DC, and POD workflows.
        </p>

        <div className="max-w-md">
          <label htmlFor="receiving-search" className="sr-only">Search steps</label>
          <div className="relative">
            <input
              id="receiving-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: invoice, ASN, pallet, POD…"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:gap-6">
        {filtered.map((item) => (
          <AccordionItem key={item.id} item={item} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
            No matches.
          </div>
        )}
      </section>

      <div className="pt-2">
        <button
          onClick={resetAll}
          className="text-xs text-gray-600 underline underline-offset-2 hover:text-blue-500"
        >
          Reset all checklists
        </button>
      </div>
    </div>
  );
}

/* ---------- tiny inner component ---------- */
function AccordionItem({ item }) {
  const [open, setOpen] = useState(item.id !== "pod");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
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

      {open && (
        <div className="mt-4 space-y-4">
          {item.notes && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {item.notes}
            </div>
          )}

          {item.steps.length > 0 ? (
            <ul className="space-y-2">
              {item.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <label className="inline-flex items-center gap-2 select-none cursor-pointer">
                    <span className="text-sm text-gray-800">
                      {i + 1}. {step}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-600">
              This section will show the exact steps to retrieve a POD for any received document.
            </div>
          )}

               {item.example && (
            <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Example: </span>
              {item.example}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
