import React, { useMemo } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAssessments } from "../hooks/useAssessments";
import { getStylePerformance } from "../services/analyticsService";
import { formatPercentage } from "../utils/calculations";

const Styles: React.FC = () => {
  const { assessments, loading } = useAssessments(true);

  const styleData = useMemo(
    () => getStylePerformance(assessments),
    [assessments]
  );

  const columns: GridColDef[] = [
    { field: "styleName", headerName: "Style Name", width: 250 },
    {
      field: "totalAssessments",
      headerName: "Total Assessments",
      width: 150,
      type: "number",
    },
    {
      field: "operationsCount",
      headerName: "Operations",
      width: 120,
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
        Styles Performance Analytics
      </Typography>

      <Paper sx={{ height: 650 }}>
        <DataGrid
          rows={styleData}
          columns={columns}
          getRowId={(row) => row.styleId}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Styles;
