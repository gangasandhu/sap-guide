// Always-on Portofino barcode list (compact + clean)
import { useEffect, useMemo, useRef, useState } from "react";
import data from "../data/portofino.json";
import { SearchIcon } from "../assets/icons.jsx";

export default function Barcodes() {
  const [q, setQ] = useState("");
  const [JsBarcodeLib, setJsBarcodeLib] = useState(null);

  // lazy-load jsbarcode on first view (keeps bundle small)
  useEffect(() => {
    let mounted = true;
    import("jsbarcode")
      .then((m) => mounted && setJsBarcodeLib(() => m.default || m))
      .catch(() => setJsBarcodeLib(null));
    return () => (mounted = false);
  }, []);

  const items = (data.items ?? []).map((it, idx) => ({ ...it, _id: idx }));
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(term) ||
        (it.article || "").toLowerCase().includes(term) ||
        (it.barcode || "").toLowerCase().includes(term)
    );
  }, [items, q]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Portofino Barcodes</h1>
        <div className="relative w-full sm:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: product, article, or barcode…"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
        </div>

        {/* Subtle hint if the lib isn't installed yet */}
        {!JsBarcodeLib && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            To render SVGs, install <span className="font-mono">jsbarcode</span>: <b>npm i jsbarcode</b>
          </p>
        )}
      </header>

      {/* Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {list.map((it) => (
          <BarcodeCard key={it._id} item={it} JsBarcodeLib={JsBarcodeLib} />
        ))}
        {list.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
            No matches.
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Card ---------- */
function BarcodeCard({ item, JsBarcodeLib }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const value = (item.barcode || "").replace(/\s+/g, "");
    if (!JsBarcodeLib || !svgRef.current || !value) return;

    try {
      JsBarcodeLib(svgRef.current, value, {
        format: "CODE128",     // safe default
        displayValue: true,
        fontSize: 13,
        margin: 10,
        height: 80            // slightly bigger, still compact
      });
    } catch {
      // ignore bad input
    }
  }, [JsBarcodeLib, item.barcode]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{item.name}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <Chip label="Article" value={item.article} />
          <Chip label="Barcode" value={item.barcode} />
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-5">
        {item.barcode ? (
          <svg ref={svgRef} className="w-full max-w-xs sm:max-w-sm" />
        ) : (
          <div className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-600">
            Barcode missing.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Tiny UI bits ---------- */
function Chip({ label, value }) {
  const [copied, setCopied] = useState(false);
  const canCopy = !!value;

  async function copy() {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {}
  }

  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 select-none border text-gray-700 text-[12px] 
        ${copied ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:text-blue-600"}`}
      title={canCopy ? `Copy ${label.toLowerCase()}` : ""}
      aria-label={`Copy ${label}`}
    >
      <span className="font-medium">{label}:</span> {value || "—"}
    </button>
  );
}
