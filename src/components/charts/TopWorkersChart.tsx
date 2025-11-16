import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Assessment } from "../../types";
import { getWorkerPerformance } from "../../services/analyticsService";

interface TopWorkersChartProps {
  assessments: Assessment[];
}

const TopWorkersChart: React.FC<TopWorkersChartProps> = ({ assessments }) => {
  const chartData = useMemo(() => {
    const workerPerformance = getWorkerPerformance(assessments);
    return workerPerformance.slice(0, 10).map((worker) => ({
      name: `${worker.name} (${worker.epf})`,
      efficiency: worker.avgEfficiency,
    }));
  }, [assessments]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey="name" width={150} />
        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
        <Bar dataKey="efficiency" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopWorkersChart;
