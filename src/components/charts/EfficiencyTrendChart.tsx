import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Assessment } from "../../types";
import { format, startOfDay } from "date-fns";
import { timestampToDate } from "../../utils/dateHelpers";

interface EfficiencyTrendChartProps {
  assessments: Assessment[];
}

const EfficiencyTrendChart: React.FC<EfficiencyTrendChartProps> = ({
  assessments,
}) => {
  const chartData = useMemo(() => {
    const groupedByDate: Record<
      string,
      { totalEfficiency: number; count: number }
    > = {};

    assessments.forEach((assessment) => {
      const date = format(
        startOfDay(timestampToDate(assessment.date)),
        "MMM dd"
      );
      if (!groupedByDate[date]) {
        groupedByDate[date] = { totalEfficiency: 0, count: 0 };
      }
      groupedByDate[date].totalEfficiency += assessment.efficiency;
      groupedByDate[date].count += 1;
    });

    return Object.entries(groupedByDate)
      .map(([date, data]) => ({
        date,
        efficiency: data.totalEfficiency / data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [assessments]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="efficiency"
          name="Efficiency %"
          stroke="#2196F3"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EfficiencyTrendChart;
