import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function signalClass(signal) {
  return signal === "Healthy flow"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";
}

export default function ManagerView() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/manager")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch(() => setError("Failed to load manager view data."));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manager View</h1>
        <Link to="/" className="text-sm font-medium text-sky-300 hover:text-sky-200">
          Back to IC View
        </Link>
      </div>

      {error && <p className="mb-4 rounded-md bg-rose-100 p-3 text-rose-700">{error}</p>}

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Team Size</th>
              <th className="px-4 py-3">Avg Lead Time</th>
              <th className="px-4 py-3">Avg Cycle Time</th>
              <th className="px-4 py-3">Bug Rate</th>
              <th className="px-4 py-3">Signal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.manager_id}-${row.month}`} className="border-t border-slate-100">
                <td className="px-4 py-3">{row.manager_name}</td>
                <td className="px-4 py-3">{row.month}</td>
                <td className="px-4 py-3">{row.team_size}</td>
                <td className="px-4 py-3">{row.avg_lead_time_days.toFixed(2)} days</td>
                <td className="px-4 py-3">{row.avg_cycle_time_days.toFixed(2)} days</td>
                <td className="px-4 py-3">{(row.avg_bug_rate_pct * 100).toFixed(0)}%</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${signalClass(row.signal)}`}>
                    {row.signal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
