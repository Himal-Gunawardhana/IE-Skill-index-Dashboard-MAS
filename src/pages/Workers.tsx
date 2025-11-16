import React, { useMemo } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAssessments } from "../hooks/useAssessments";
import { getWorkerPerformance } from "../services/analyticsService";
import { formatPercentage, getSkillLevelLabel } from "../utils/calculations";

const Workers: React.FC = () => {
  const { assessments, loading } = useAssessments(true);

  const workerData = useMemo(
    () => getWorkerPerformance(assessments),
    [assessments]
  );

  const columns: GridColDef[] = [
    { field: "epf", headerName: "EPF", width: 120 },
    { field: "name", headerName: "Worker Name", width: 200 },
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
    {
      field: "currentSkillLevel",
      headerName: "Skill Level",
      width: 150,
      valueFormatter: (params) => getSkillLevelLabel(params.value),
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
        Worker Performance Analytics
      </Typography>

      <Paper sx={{ height: 650 }}>
        <DataGrid
          rows={workerData}
          columns={columns}
          getRowId={(row) => row.epf}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Workers;
