import React, { useMemo } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAssessments } from "../hooks/useAssessments";
import { getOperationPerformance } from "../services/analyticsService";
import { formatPercentage, formatTime } from "../utils/calculations";

const Operations: React.FC = () => {
  const { assessments, loading } = useAssessments(true);

  const operationData = useMemo(
    () => getOperationPerformance(assessments),
    [assessments]
  );

  const columns: GridColDef[] = [
    { field: "operationName", headerName: "Operation Name", width: 250 },
    { field: "machineType", headerName: "Machine Type", width: 200 },
    { field: "smv", headerName: "SMV", width: 100, type: "number" },
    {
      field: "avgEfficiency",
      headerName: "Avg Efficiency",
      width: 150,
      valueFormatter: (params) => formatPercentage(params.value),
    },
    {
      field: "totalAssessments",
      headerName: "Total Assessments",
      width: 150,
      type: "number",
    },
    {
      field: "avgCompletionTime",
      headerName: "Avg Time",
      width: 130,
      valueFormatter: (params) => formatTime(params.value),
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
        Operations Analytics
      </Typography>

      <Paper sx={{ height: 650 }}>
        <DataGrid
          rows={operationData}
          columns={columns}
          getRowId={(row) => row.operationId}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Operations;
