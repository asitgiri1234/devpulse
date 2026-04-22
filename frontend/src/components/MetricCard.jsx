const accentByStatus = {
  healthy: "bg-emerald-500",
  watch: "bg-amber-500",
  concern: "bg-rose-500",
};

export default function MetricCard({ label, value, status }) {
  return (
    <article className="relative rounded-xl bg-white p-5 shadow-sm">
      <span className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${accentByStatus[status]}`} />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}
