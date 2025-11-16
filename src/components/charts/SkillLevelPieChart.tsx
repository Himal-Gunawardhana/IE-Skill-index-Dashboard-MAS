import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Assessment } from "../../types";
import { getSkillLevelDistribution } from "../../services/analyticsService";
import {
  getSkillLevelLabel,
  getSkillLevelColor,
} from "../../utils/calculations";

interface SkillLevelPieChartProps {
  assessments: Assessment[];
}

const SkillLevelPieChart: React.FC<SkillLevelPieChartProps> = ({
  assessments,
}) => {
  const chartData = useMemo(() => {
    const distribution = getSkillLevelDistribution(assessments);
    return Object.entries(distribution).map(([level, count]) => ({
      name: getSkillLevelLabel(Number(level)),
      value: count,
      color: getSkillLevelColor(Number(level)),
    }));
  }, [assessments]);

  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SkillLevelPieChart;
