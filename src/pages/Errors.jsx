import { useMemo, useState } from "react";
import data from "../data/errors.json";
import { SearchIcon, Arrow } from "../assets/icons.jsx";

export default function Errors() {
  const all = data.errors ?? [];
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");

  // Build tag list (unique) for the filter
  const tags = useMemo(() => {
    const s = new Set();
    all.forEach(e => (e.tags || []).forEach(t => s.add(t)));
    return ["all", ...Array.from(s).sort()];
  }, [all]);

  // Filter by search + tag
  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all.filter(e => {
      const matchesText =
        !term ||
        e.title.toLowerCase().includes(term) ||
        (e.notes || "").toLowerCase().includes(term) ||
        (e.symptoms || []).some(s => s.toLowerCase().includes(term)) ||
        (e.causes || []).some(c => c.toLowerCase().includes(term)) ||
        (e.steps || []).some(s => s.toLowerCase().includes(term));
      const matchesTag = tag === "all" || (e.tags || []).includes(tag);
      return matchesText && matchesTag;
    });
  }, [all, q, tag]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Troubleshooting</h1>
        <p className="text-gray-600">
          Common errors with symptoms, likely causes, and clean fixes.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: locked, yellow items, invoice…"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
          </div>

          {/* Tag filter */}
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {tags.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Topics" : t}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Cards */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6">
        {items.map((e) => (
          <ErrorCard key={e.id} item={e} />
        ))}
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
            No matches.
          </div>
        )}
      </section>
    </div>
  );
}

/* --------- Local card component (minimal) --------- */
function ErrorCard({ item }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between text-left px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 transition"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-gray-900">{item.title}</h3>
          {item.tags?.length ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-lg bg-blue-50 text-blue-700 px-2.5 py-0.5 text-[11px]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
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

      {/* Body */}
      {open && (
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {item.symptoms?.length ? (
            <Section title="Symptoms">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                {item.symptoms.map((s, i) => (
                  <li key={i} className="leading-relaxed">{s}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {item.causes?.length ? (
            <Section title="Likely causes">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                {item.causes.map((c, i) => (
                  <li key={i} className="leading-relaxed">{c}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {item.steps?.length ? (
            <Section title="Fix steps">
              <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-800">
                {item.steps.map((s, i) => (
                  <li key={i} className="leading-relaxed">{s}</li>
                ))}
              </ol>
            </Section>
          ) : null}

          {item.notes ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {item.notes}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
      <div className="mt-2">{children}</div>
    </div>
  );
}
