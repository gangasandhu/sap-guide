import data from "../data/damages.json";

export default function Damages() {
  const reasonCodes = data.reasonCodes ?? [];
  const steps = data.steps ?? [];
  const placement = data.placement ?? [];
  const intro = data.intro ?? "";
  const tip = data.tip ?? "";
  const candy = data.candyCredits ?? null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Damage Scanning (SAP)</h1>
        {intro && <p className="text-gray-600">{intro}</p>}
      </header>

      {/* Reason codes */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Reason codes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reasonCodes.map((r) => (
            <div
              key={r.code}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded-lg bg-blue-50 px-2 text-sm font-semibold text-blue-700">
                    {r.code}
                  </span>
                  <span className="font-semibold text-gray-900">{r.title}</span>
                </span>
                <span className="text-xs text-gray-500">{r.dept}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">SAP steps</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-800">
          {steps.map((s, i) => (
            <li key={i} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      {/* Placement after scanning */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Where to stage items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {placement.map((p) => (
            <div key={p.title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="font-semibold text-gray-900">{p.title}</p>
              <p className="mt-1 text-sm text-gray-700">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tip */}
      {tip && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {tip}
        </div>
      )}

      {/* Candy / Chocolate Credits */}
      {candy && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-blue-500">{candy.title}</h2>
            {candy.handheldMenu && (
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-[11px]">
                Handheld: {candy.handheldMenu}
              </span>
            )}
          </div>
          {candy.intro && <p className="text-gray-700">{candy.intro}</p>}

          {Array.isArray(candy.brands) && candy.brands.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {candy.brands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-lg bg-gray-50 text-gray-700 px-2.5 py-0.5 text-xs border border-gray-200"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(candy.steps) && candy.steps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Steps</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-800">
                {candy.steps.map((s, i) => (
                  <li key={i} className="leading-relaxed">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {candy.report && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{candy.report.title}</h3>
              {candy.report.path && (
                <div className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-[11px]">
                  Menu: {candy.report.path}
                </div>
              )}
              <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm text-gray-800">
                {candy.report.steps.map((s, i) => (
                  <li key={i} className="leading-relaxed">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {candy.example && (
            <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Example: </span>
              {candy.example}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
