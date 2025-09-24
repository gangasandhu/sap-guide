import { useMemo, useState } from "react";
import data from "../data/vendors.json";
import { SearchIcon } from "../assets/icons.jsx";

export default function Vendors() {
  const [q, setQ] = useState("");
  const [proc, setProc] = useState("all");

  const allVendors = data.vendors ?? [];
  const allProcedures = useMemo(() => {
    const set = new Set();
    allVendors.forEach((v) => v.procedures?.forEach((p) => set.add(p)));
    return ["all", ...Array.from(set)];
  }, [allVendors]);

  const vendors = useMemo(() => {
    const term = q.trim().toLowerCase();
    return allVendors.filter((v) => {
      const matchText =
        !term ||
        v.name.toLowerCase().includes(term) ||
        v.numbers.join(" ").toLowerCase().includes(term) ||
        (v.notes ?? "").toLowerCase().includes(term) ||
        v.procedures.join(" ").toLowerCase().includes(term);
      const matchProc = proc === "all" || v.procedures.includes(proc);
      return matchText && matchProc;
    });
  }, [allVendors, q, proc]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Vendors</h1>
        <p className="text-gray-600">
          Tap a vendor number to copy. Filter by procedure or search by name/number.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: Pepsi, 1028…, With Ref…"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
          </div>

          {/* Procedure filter */}
          <select
            value={proc}
            onChange={(e) => setProc(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {allProcedures.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Procedures" : p}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Minimal, clean table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Head (desktop only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 border-b">
          <div className="col-span-4">Vendor</div>
          <div className="col-span-4">Vendor Number(s)</div>
          <div className="col-span-4">Receiving Procedure</div>
        </div>

        <ul className="divide-y">
          {vendors.map((v) => (
            <li
              key={v.name}
              className="px-4 py-3 md:grid md:grid-cols-12 md:gap-4 hover:bg-gray-50/60 transition"
            >
              {/* Vendor */}
              <div className="md:col-span-4">
                <p className="font-semibold text-gray-900">{v.name}</p>
                {v.notes && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px]">
                    {v.notes}
                  </span>
                )}

                {/* Mobile labels */}
                <div className="md:hidden mt-3 text-xs text-gray-500">Vendor Number(s)</div>
                <div className="mt-1 flex flex-wrap gap-2 md:hidden">
                  {v.numbers.length ? v.numbers.map((n) => <NumberChip key={n} text={n} />) : <Dash />}
                </div>

                <div className="md:hidden mt-3 text-xs text-gray-500">Procedure</div>
                <div className="mt-1 md:hidden">
                  <ProcList procedures={v.procedures} />
                </div>
              </div>

              {/* Numbers (desktop) */}
              <div className="hidden md:flex md:col-span-4 flex-wrap gap-2">
                {v.numbers.length ? v.numbers.map((n) => <NumberChip key={n} text={n} />) : <Dash />}
              </div>

              {/* Procedures (desktop) */}
              <div className="hidden md:block md:col-span-4">
                <ProcList procedures={v.procedures} />
              </div>
            </li>
          ))}

          {vendors.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">No vendors match your filters.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

/* ---------- minimal helpers ---------- */

function NumberChip({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied");
      setTimeout(() => setCopied(false), 900);
    } catch {
      toast("Copy failed");
    }
  }

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs select-none
        border transition ${
          copied
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-blue-600"
        }`}
      aria-label={`Copy vendor number ${text}`}
      title="Tap to copy"
    >
      {text}
    </button>
  );
}

function ProcList({ procedures }) {
  return (
    <div className="flex flex-wrap gap-2">
      {procedures.map((p) => (
        <span
          key={p}
          className="inline-flex items-center rounded-lg bg-blue-50 text-blue-700 px-2.5 py-1 text-xs"
        >
          {p}
        </span>
      ))}
    </div>
  );
}

function Dash() {
  return <span className="text-xs text-gray-400">—</span>;
}

function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.className =
    "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-gray-900/90 text-white text-xs px-3 py-2 shadow";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
