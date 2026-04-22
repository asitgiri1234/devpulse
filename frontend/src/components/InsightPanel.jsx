import { useState } from "react";

export default function InsightPanel({ developerId, month }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState("");

  async function fetchInsight() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/insight/${developerId}/${month}`);
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Failed to get insight.");
      }

      setInsight(body);
    } catch (err) {
      setInsight(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">AI Interpretation & Next Steps</h2>
        <button
          type="button"
          onClick={fetchInsight}
          disabled={loading}
          className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Analysing your metrics..." : "Get AI Insight"}
        </button>
      </div>

      {error && <p className="mb-3 rounded-md bg-rose-100 p-3 text-rose-700">{error}</p>}

      {insight ? (
        <div className="space-y-3">
          <p className="text-slate-700">{insight.interpretation}</p>
          <ol className="list-decimal space-y-2 pl-5 text-slate-800">
            {insight.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="pt-2 text-xs text-slate-500">Powered by Groq + Llama 3.3</p>
        </div>
      ) : (
        !loading && <p className="text-slate-500">Click the button to generate an interpretation.</p>
      )}
    </section>
  );
}
