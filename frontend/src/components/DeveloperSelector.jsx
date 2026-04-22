export default function DeveloperSelector({ developers, value, onChange }) {
  return (
    <label className="flex-1 text-sm text-slate-200">
      Developer
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-sky-500 focus:outline-none"
      >
        <option value="">Select developer</option>
        {developers.map((developer) => (
          <option key={developer.developer_id} value={developer.developer_id}>
            {developer.developer_name} | {developer.team_name} | {developer.level}
          </option>
        ))}
      </select>
    </label>
  );
}
