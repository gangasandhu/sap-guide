import data from "../data/returns.json";

export default function Returns() {
  const {
    title = "Processing Credits",
    intro = "",
    menuPath = "",
    fields = [],
    steps = [],
    notes = [],
    example = ""
  } = data;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">{title}</h1>
        {intro && <p className="text-gray-600">{intro}</p>}
        {menuPath && (
          <div className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs">
            Menu: {menuPath}
          </div>
        )}
      </header>

      {/* Required header fields */}
      {fields.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Header details to enter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-900">{f.label}</p>
                <p className="mt-1 text-sm text-gray-700">{f.help}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            SAP steps
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-800">
            {steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                {s}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Notes
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {notes.map((n, i) => (
              <li key={i} className="leading-relaxed">
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Example */}
      {example && (
        <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-700">
          <span className="font-medium text-gray-900">Example: </span>
          {example}
        </div>
      )}
    </div>
  );
}
