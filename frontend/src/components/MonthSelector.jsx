export default function MonthSelector({ months, value, onChange }) {
  return (
    <label className="flex-1 text-sm text-slate-200">
      Month
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
      >
        <option value="">Select month</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </label>
  );
}
