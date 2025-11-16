import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Assessment } from "../../types";
import { getShiftComparison } from "../../services/analyticsService";

interface ShiftComparisonChartProps {
  assessments: Assessment[];
}

const ShiftComparisonChart: React.FC<ShiftComparisonChartProps> = ({
  assessments,
}) => {
  const chartData = useMemo(() => {
    const comparison = getShiftComparison(assessments);
    return [
      {
        metric: "Count",
        "Shift A": comparison.shiftA.count,
        "Shift B": comparison.shiftB.count,
      },
      {
        metric: "Avg Efficiency",
        "Shift A": comparison.shiftA.avgEfficiency,
        "Shift B": comparison.shiftB.avgEfficiency,
      },
      {
        metric: "Avg FTT",
        "Shift A": comparison.shiftA.avgFTT,
        "Shift B": comparison.shiftB.avgFTT,
      },
    ];
  }, [assessments]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="metric" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Shift A" fill="#2196F3" />
        <Bar dataKey="Shift B" fill="#FF9800" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ShiftComparisonChart;
