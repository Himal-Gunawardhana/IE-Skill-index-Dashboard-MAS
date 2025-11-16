import * as XLSX from "xlsx";
import { Assessment } from "../types";
import { formatDate } from "./dateHelpers";
import { formatPercentage, getSkillLevelLabel } from "./calculations";

/**
 * Export assessments to Excel
 */
export const exportToExcel = (
  assessments: Assessment[],
  filename: string = "assessments.xlsx"
) => {
  const data = assessments.map((assessment) => ({
    Date: formatDate(assessment.date, "yyyy-MM-dd"),
    EPF: assessment.epf,
    "Worker Name": assessment.teamMember,
    Style: assessment.styleName,
    Operation: assessment.operationName,
    "Machine Type": assessment.machineType,
    SMV: assessment.smv,
    "Efficiency (%)": assessment.efficiency.toFixed(2),
    "FTT (%)": assessment.ftt.toFixed(2),
    "Skill Level": getSkillLevelLabel(assessment.skillLevel),
    Shift: assessment.shift,
    Module: assessment.moduleNumber,
    "Responsible IE": assessment.responsibleIE,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Assessments");
  XLSX.writeFile(wb, filename);
};

/**
 * Export to CSV
 */
export const exportToCSV = (
  assessments: Assessment[],
  filename: string = "assessments.csv"
) => {
  const data = assessments.map((assessment) => ({
    Date: formatDate(assessment.date, "yyyy-MM-dd"),
    EPF: assessment.epf,
    "Worker Name": assessment.teamMember,
    Style: assessment.styleName,
    Operation: assessment.operationName,
    "Machine Type": assessment.machineType,
    SMV: assessment.smv,
    "Efficiency (%)": assessment.efficiency.toFixed(2),
    "FTT (%)": assessment.ftt.toFixed(2),
    "Skill Level": getSkillLevelLabel(assessment.skillLevel),
    Shift: assessment.shift,
    Module: assessment.moduleNumber,
    "Responsible IE": assessment.responsibleIE,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
