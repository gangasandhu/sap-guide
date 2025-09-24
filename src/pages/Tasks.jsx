import { useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "../assets/icons.jsx";
import daily from "../data/daily_receiver_tasks.json"; // <-- NEW

/** ---------- storage + seeds ---------- */
const STORAGE_KEY = "sapguide:tasks:v3";
const LAST_DAILY_KEY = "sapguide:tasks:lastDaily";
const PRIORITIES = ["Low", "Med", "High"];
const PRIORITY_RANK = { High: 3, Med: 2, Low: 1 };

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function seed() {
  // start empty; daily tasks will populate automatically
  return [];
}
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch {
    return seed();
  }
}
function saveTasks(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {}
}

/** ---------- date helpers ---------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
function isToday(dateISO) { return !!dateISO && dateISO === todayISO(); }
function isOverdue(dateISO) { if (!dateISO) return false; return new Date(dateISO) < new Date(todayISO()); }
function isUpcoming(dateISO) {
  if (!dateISO) return false;
  const diff = (new Date(dateISO) - new Date(todayISO())) / (1000*60*60*24);
  return diff > 0 && diff <= 7;
}

/** ---------- page ---------- */
export default function Tasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Open");
  const titleRef = useRef(null);

  useEffect(() => saveTasks(tasks), [tasks]);

  // ⬇️ Inject today's receiver tasks once per day
  useEffect(() => {
    const today = todayISO();
    const last = localStorage.getItem(LAST_DAILY_KEY);
    if (last === today) return;

    setTasks(prev => {
      const titlesToday = new Set(
        prev.filter(t => t.due === today).map(t => t.title.toLowerCase())
      );
      const add = (daily.tasks || [])
        .filter(t => !titlesToday.has(t.title.toLowerCase()))
        .map(t => ({
          id: uid(),
          title: t.title,
          description: (t.description || "").trim(),
          priority: t.priority || "Med",
          due: today,
          done: false,
          createdAt: Date.now()
        }));
      const next = add.length ? [...add, ...prev] : prev;
      return next;
    });

    localStorage.setItem(LAST_DAILY_KEY, today);
  }, []);

  // progress bar
  const open = tasks.filter(t => !t.done);
  const doneCount = tasks.length - open.length;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // add form
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Med", due: "" });
  function addTask() {
    const title = newTask.title.trim();
    if (!title) return;
    setTasks(prev => [
      { id: uid(), title, description: newTask.description.trim(), priority: newTask.priority, due: newTask.due, done: false, createdAt: Date.now() },
      ...prev
    ]);
    setNewTask({ title: "", description: "", priority: "Med", due: "" });
    titleRef.current?.focus();
  }

  function toggleDone(id) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function updateTask(id, patch) { setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t)); }
  function removeTask(id) { setTasks(prev => prev.filter(t => t.id !== id)); }
  function clearCompleted() { setTasks(prev => prev.filter(t => !t.done)); }

  // filter + sort
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const byText = t => !term || t.title.toLowerCase().includes(term) || (t.description || "").toLowerCase().includes(term);
    const byStatus = t => status === "All" ? true : status === "Open" ? !t.done : t.done;

    return [...tasks]
      .filter(t => byText(t) && byStatus(t))
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.due && b.due && a.due !== b.due) return a.due.localeCompare(b.due);
        if (a.due && !b.due) return -1;
        if (!a.due && b.due) return 1;
        const p = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
        if (p) return p;
        return a.createdAt - b.createdAt;
      });
  }, [tasks, q, status]);

  // groups
  const groups = useMemo(() => {
    const g = { Overdue: [], Today: [], Upcoming: [], "No date": [] };
    list.forEach(t => {
      if (!t.due) g["No date"].push(t);
      else if (isOverdue(t.due)) g.Overdue.push(t);
      else if (isToday(t.due)) g.Today.push(t);
      else if (isUpcoming(t.due)) g.Upcoming.push(t);
      else g["No date"].push(t);
    });
    return g;
  }, [list]);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white pointer-events-none" />
      <div className="relative space-y-6 sm:space-y-8">
        {/* header */}
        <header className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">Tasks</h1>

          {/* progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-600">{pct}%</span>
          </div>

          {/* add */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2 md:items-start">
            <input
              ref={titleRef}
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder='Add a task (e.g., "Check open receipts")'
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <textarea
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Optional description"
              rows={1}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm md:min-w-[260px]"
            />
            <select
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm md:w-[110px]"
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                value={newTask.due}
                onChange={e => setNewTask({ ...newTask, due: e.target.value })}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button
                onClick={addTask}
                className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow hover:shadow-md transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search title or description…"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
            </div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {["Open", "All", "Done"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={clearCompleted}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 hover:text-blue-500 hover:border-blue-300 shadow-sm"
            >
              Archive done
            </button>
          </div>
        </header>

        {/* groups */}
        <main className="space-y-6">
          {Object.entries(groups).map(([title, items]) =>
            items.length ? (
              <section key={title} className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
                <ul className="space-y-2">
                  {items.map(t => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      onToggle={() => toggleDone(t.id)}
                      onUpdate={patch => updateTask(t.id, patch)}
                      onRemove={() => removeTask(t.id)}
                    />
                  ))}
                </ul>
              </section>
            ) : null
          )}
          {list.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
              No tasks match your filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/** ---------- row & chips (unchanged from last version) ---------- */
function TaskRow({ task, onToggle, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  function save() {
    const patch = {};
    const t = title.trim();
    if (t && t !== task.title) patch.title = t;
    if (description.trim() !== (task.description || "")) patch.description = description.trim();
    if (Object.keys(patch).length) onUpdate(patch);
    setEditing(false);
  }

  return (
    <li className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <input
              type="checkbox"
              checked={task.done}
              onChange={onToggle}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <div className="min-w-0">
              {editing ? (
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && save()}
                  className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className={`text-sm sm:text-base ${task.done ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {task.title}
                </p>
              )}
              {editing ? (
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Optional description"
                  className="mt-2 w-full rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : task.description ? (
                <p className="mt-1 text-xs text-gray-600">{task.description}</p>
              ) : null}

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <PriChip p={task.priority} />
                <DueChip due={task.due} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={task.priority}
              onChange={e => onUpdate({ priority: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              type="date"
              value={task.due || ""}
              onChange={e => onUpdate({ due: e.target.value })}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => (editing ? save() : setEditing(true))}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:text-blue-600 hover:border-blue-300"
            >
              {editing ? "Save" : "Edit"}
            </button>
            <button
              onClick={onRemove}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-red-600 hover:border-red-300"
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function PriChip({ p }) {
  const cls = p === "High" ? "bg-red-50 text-red-700"
            : p === "Med"  ? "bg-amber-50 text-amber-700"
            :               "bg-emerald-50 text-emerald-700";
  return <span className={`inline-flex items-center rounded-lg px-2 py-0.5 ${cls}`}>{p}</span>;
}
function DueChip({ due }) {
  const state = !due ? "none" : isOverdue(due) ? "overdue" : isToday(due) ? "today" : isUpcoming(due) ? "soon" : "later";
  const text = !due ? "No date" : state === "today" ? "Due today" : `Due ${due}`;
  const cls = state === "overdue" ? "bg-red-50 text-red-700"
            : state === "today"   ? "bg-blue-50 text-blue-700"
            : state === "soon"    ? "bg-amber-50 text-amber-700"
            :                        "bg-gray-50 text-gray-700";
  return <span className={`inline-flex items-center rounded-lg px-2 py-0.5 ${cls}`}>{text}</span>;
}
