export function getDevelopers(data) {
  return data.developers.map((dev) => ({
    developer_id: String(dev.developer_id),
    developer_name: dev.developer_name,
    team_name: dev.team_name,
    level: dev.level,
    service_type: dev.service_type,
    manager_name: dev.manager_name,
  }));
}

export function getDeveloperMetrics(data, developerId, month) {
  const match = data.metricExamples.find(
    (row) => String(row.developer_id) === String(developerId) && row.month === month,
  );

  if (!match) {
    return null;
  }

  return {
    developer_id: String(match.developer_id),
    developer_name: match.developer_name,
    team_name: match.team_name,
    month: match.month,
    issues_done: Number(match.issues_done ?? 0),
    merged_prs: Number(match.merged_prs ?? 0),
    prod_deployments: Number(match.prod_deployments ?? 0),
    escaped_bugs: Number(match.escaped_bugs ?? 0),
    avg_cycle_time_days: Number(match.avg_cycle_time_days ?? 0),
    avg_lead_time_days: Number(match.avg_lead_time_days ?? 0),
    bug_rate_pct: Number(match.bug_rate_pct ?? 0),
    pattern_hint: match.pattern_hint,
  };
}

export function getManagerRows(data) {
  return data.managerView.map((row) => ({
    manager_id: String(row.manager_id),
    manager_name: row.manager_name,
    month: row.month,
    team_size: Number(row.team_size ?? 0),
    avg_lead_time_days: Number(row.avg_lead_time_days ?? 0),
    avg_cycle_time_days: Number(row.avg_cycle_time_days ?? 0),
    avg_bug_rate_pct: Number(row.avg_bug_rate_pct ?? 0),
    signal: row.signal,
  }));
}
