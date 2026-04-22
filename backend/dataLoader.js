import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workbookPath = path.resolve(
  __dirname,
  "../data/intern_assignment_support_pack_dev_only_v3.xlsx",
);

let cachedData = null;

function readSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Missing required sheet: ${sheetName}`);
  }
  return xlsx.utils.sheet_to_json(sheet, { defval: null, raw: true });
}

function readSheetWithHeader(workbook, sheetName, requiredHeaders) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Missing required sheet: ${sheetName}`);
  }

  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true });
  const headerIndex = rows.findIndex((row) =>
    requiredHeaders.every((header) => row.includes(header)),
  );

  if (headerIndex === -1) {
    throw new Error(`Unable to locate headers for sheet: ${sheetName}`);
  }

  return xlsx.utils.sheet_to_json(sheet, {
    defval: null,
    raw: true,
    range: headerIndex,
  });
}

export function loadData() {
  if (cachedData) {
    return cachedData;
  }

  const workbook = xlsx.readFile(workbookPath);

  cachedData = {
    developers: readSheet(workbook, "Dim_Developers"),
    jiraIssues: readSheet(workbook, "Fact_Jira_Issues"),
    pullRequests: readSheet(workbook, "Fact_Pull_Requests"),
    ciDeployments: readSheet(workbook, "Fact_CI_Deployments"),
    bugReports: readSheet(workbook, "Fact_Bug_Reports"),
    metricExamples: readSheetWithHeader(workbook, "Metric_Examples", [
      "developer_id",
      "month",
      "developer_name",
      "pattern_hint",
    ]),
    managerView: readSheetWithHeader(workbook, "Manager_Sample_View", [
      "manager_id",
      "manager_name",
      "month",
      "signal",
    ]),
  };

  return cachedData;
}
