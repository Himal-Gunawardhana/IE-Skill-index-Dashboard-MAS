import React, { useMemo } from "react";
import { Box, Paper, Typography, Grid, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAssessments } from "../hooks/useAssessments";
import { getMachineTypePerformance } from "../services/analyticsService";
import { formatPercentage } from "../utils/calculations";

const COLORS = [
  "#2196F3",
  "#4CAF50",
  "#FF9800",
  "#F44336",
  "#9C27B0",
  "#00BCD4",
];

const MachineTypes: React.FC = () => {
  const { assessments, loading } = useAssessments(true);

  const machineData = useMemo(
    () => getMachineTypePerformance(assessments),
    [assessments]
  );

  const usageData = useMemo(() => {
    return machineData.map((machine) => ({
      name: machine.machineType,
      value: machine.totalAssessments,
    }));
  }, [machineData]);

  const performanceData = useMemo(() => {
    return machineData.map((machine) => ({
      name: machine.machineType.substring(0, 20) + "...",
      efficiency: machine.avgEfficiency,
    }));
  }, [machineData]);

  const columns: GridColDef[] = [
    { field: "machineType", headerName: "Machine Type", width: 300 },
    {
      field: "operationsCount",
      headerName: "Operations",
      width: 120,
      type: "number",
    },
    {
      field: "totalAssessments",
      headerName: "Total Assessments",
      width: 150,
      type: "number",
    },
    {
      field: "avgEfficiency",
      headerName: "Avg Efficiency",
      width: 150,
      valueFormatter: (params) => formatPercentage(params.value),
    },
    {
      field: "avgFTT",
      headerName: "Avg FTT",
      width: 120,
      valueFormatter: (params) => formatPercentage(params.value),
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Machine Type Analytics
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Machine Type Usage
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={usageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name.substring(0, 15)} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {usageData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Performance by Machine Type
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
                <Bar dataKey="efficiency" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={machineData}
          columns={columns}
          getRowId={(row) => row.machineType}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Paper>
    </Box>
  );
};

export default MachineTypes;
