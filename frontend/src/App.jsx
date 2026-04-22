import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import DeveloperSelector from "./components/DeveloperSelector.jsx";
import InsightPanel from "./components/InsightPanel.jsx";
import ManagerView from "./components/ManagerView.jsx";
import MetricCard from "./components/MetricCard.jsx";
import MonthSelector from "./components/MonthSelector.jsx";

const monthOptions = [
  { value: "2026-03", label: "March 2026" },
  { value: "2026-04", label: "April 2026" },
];

function badgeClass(pattern) {
  if (pattern === "Healthy flow") return "bg-emerald-100 text-emerald-700";
  if (pattern === "Quality watch") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function ICView() {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/developers")
      .then((res) => res.json())
      .then((data) => setDevelopers(data))
      .catch(() => setError("Failed to load developers."));
  }, []);

  useEffect(() => {
    if (!selectedDeveloper || !selectedMonth) {
      setMetrics(null);
      return;
    }

    fetch(`/api/metrics/${selectedDeveloper}/${selectedMonth}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Failed to load metrics.");
        }
        return res.json();
      })
      .then((data) => {
        setError("");
        setMetrics(data);
      })
      .catch((err) => {
        setMetrics(null);
        setError(err.message);
      });
  }, [selectedDeveloper, selectedMonth]);

  const metricItems = useMemo(() => {
    if (!metrics) return [];
    return [
      {
        label: "Cycle Time",
        value: `${metrics.avg_cycle_time_days.toFixed(2)} days`,
        status:
          metrics.avg_cycle_time_days < 5
            ? "healthy"
            : metrics.avg_cycle_time_days <= 7
              ? "watch"
              : "concern",
      },
      {
        label: "Lead Time for Changes",
        value: `${metrics.avg_lead_time_days.toFixed(2)} days`,
        status:
          metrics.avg_lead_time_days < 3
            ? "healthy"
            : metrics.avg_lead_time_days <= 5
              ? "watch"
              : "concern",
      },
      {
        label: "Bug Rate",
        value: `${(metrics.bug_rate_pct * 100).toFixed(0)}%`,
        status:
          metrics.bug_rate_pct === 0 ? "healthy" : metrics.bug_rate_pct === 0.5 ? "watch" : "concern",
      },
      {
        label: "Deployment Frequency",
        value: `${metrics.prod_deployments} deployments`,
        status:
          metrics.prod_deployments >= 2 ? "healthy" : metrics.prod_deployments === 1 ? "watch" : "concern",
      },
      {
        label: "PR Throughput",
        value: `${metrics.merged_prs} PRs`,
        status: metrics.merged_prs >= 2 ? "healthy" : metrics.merged_prs === 1 ? "watch" : "concern",
      },
    ];
  }, [metrics]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8">
        <p className="text-sm font-medium text-slate-300">Developer Productivity Intelligence</p>
        <h1 className="text-4xl font-bold tracking-tight text-white">DevPulse</h1>
      </header>

      <div className="mb-6 flex flex-col gap-4 rounded-xl bg-slate-900/40 p-4 md:flex-row">
        <DeveloperSelector
          developers={developers}
          value={selectedDeveloper}
          onChange={(value) => setSelectedDeveloper(value)}
        />
        <MonthSelector value={selectedMonth} onChange={(value) => setSelectedMonth(value)} months={monthOptions} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        {metrics && (
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(metrics.pattern_hint)}`}>
            {metrics.pattern_hint}
          </span>
        )}
        <Link to="/manager" className="text-sm font-medium text-sky-300 hover:text-sky-200">
          Switch to Manager View
        </Link>
      </div>

      {error && <p className="mb-4 rounded-lg bg-rose-100 p-3 text-rose-700">{error}</p>}

      {metrics ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metricItems.map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} status={item.status} />
            ))}
          </section>
          <InsightPanel developerId={selectedDeveloper} month={selectedMonth} />
        </>
      ) : (
        <div className="rounded-xl bg-white p-8 text-slate-700 shadow-sm">
          Select a developer and month to see DevPulse metrics.
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans">
      <Routes>
        <Route path="/" element={<ICView />} />
        <Route path="/manager" element={<ManagerView />} />
      </Routes>
    </main>
  );
}
