import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Download } from "@mui/icons-material";
import { useAssessments } from "../hooks/useAssessments";
import { formatDate } from "../utils/dateHelpers";
import {
  formatPercentage,
  getSkillLevelLabel,
  getSkillLevelColor,
  formatTime,
} from "../utils/calculations";
import { exportToExcel, exportToCSV } from "../utils/exportHelpers";
import { Assessment } from "../types";

const Assessments: React.FC = () => {
  const { assessments, loading } = useAssessments(true);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [skillLevelFilter, setSkillLevelFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesShift =
        shiftFilter === "all" || assessment.shift === shiftFilter;
      const matchesSkillLevel =
        skillLevelFilter === "all" ||
        assessment.skillLevel === Number(skillLevelFilter);
      const matchesSearch =
        searchTerm === "" ||
        assessment.epf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.teamMember.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesShift && matchesSkillLevel && matchesSearch;
    });
  }, [assessments, shiftFilter, skillLevelFilter, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueFormatter: (params) => formatDate(params.value),
    },
    { field: "epf", headerName: "EPF", width: 100 },
    { field: "teamMember", headerName: "Worker Name", width: 150 },
    { field: "styleName", headerName: "Style", width: 130 },
    { field: "operationName", headerName: "Operation", width: 180 },
    { field: "machineType", headerName: "Machine Type", width: 150 },
    { field: "smv", headerName: "SMV", width: 80, type: "number" },
    {
      field: "efficiency",
      headerName: "Efficiency",
      width: 110,
      valueFormatter: (params) => formatPercentage(params.value),
    },
    {
      field: "ftt",
      headerName: "FTT",
      width: 90,
      valueFormatter: (params) => formatPercentage(params.value),
    },
    {
      field: "skillLevel",
      headerName: "Skill Level",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={getSkillLevelLabel(params.value)}
          size="small"
          sx={{
            backgroundColor: getSkillLevelColor(params.value),
            color: "white",
          }}
        />
      ),
    },
    { field: "shift", headerName: "Shift", width: 70 },
    { field: "moduleNumber", headerName: "Module", width: 80, type: "number" },
    { field: "responsibleIE", headerName: "Responsible IE", width: 130 },
  ];

  const handleExport = (format: "excel" | "csv") => {
    if (format === "excel") {
      exportToExcel(filteredAssessments);
    } else {
      exportToCSV(filteredAssessments);
    }
  };

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Assessments
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleExport("csv")}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => handleExport("excel")}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search EPF or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Shift"
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Shifts</MenuItem>
              <MenuItem value="A">Shift A</MenuItem>
              <MenuItem value="B">Shift B</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Skill Level"
              value={skillLevelFilter}
              onChange={(e) => setSkillLevelFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="1">Beginner</MenuItem>
              <MenuItem value="2">Intermediate</MenuItem>
              <MenuItem value="3">Advanced</MenuItem>
              <MenuItem value="4">Expert</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredAssessments.length} assessments
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 650 }}>
        <DataGrid
          rows={filteredAssessments}
          columns={columns}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          onRowClick={(params) =>
            setSelectedAssessment(params.row as Assessment)
          }
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Paper>

      {/* Assessment Detail Modal */}
      <Dialog
        open={selectedAssessment !== null}
        onClose={() => setSelectedAssessment(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Assessment Details</DialogTitle>
        <DialogContent>
          {selectedAssessment && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date
                </Typography>
                <Typography>
                  {formatDate(selectedAssessment.date, "PPP")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Worker
                </Typography>
                <Typography>
                  {selectedAssessment.teamMember} ({selectedAssessment.epf})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Style
                </Typography>
                <Typography>{selectedAssessment.styleName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Operation
                </Typography>
                <Typography>{selectedAssessment.operationName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Machine Type
                </Typography>
                <Typography>{selectedAssessment.machineType}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  SMV / SSV
                </Typography>
                <Typography>
                  {selectedAssessment.smv} / {selectedAssessment.ssv}s
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Efficiency
                </Typography>
                <Typography fontWeight="bold" color="primary">
                  {formatPercentage(selectedAssessment.efficiency)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  FTT
                </Typography>
                <Typography fontWeight="bold" color="secondary">
                  {formatPercentage(selectedAssessment.ftt)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Skill Level
                </Typography>
                <Chip
                  label={getSkillLevelLabel(selectedAssessment.skillLevel)}
                  sx={{
                    backgroundColor: getSkillLevelColor(
                      selectedAssessment.skillLevel
                    ),
                    color: "white",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Time
                </Typography>
                <Typography>
                  {formatTime(selectedAssessment.averageTime)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Good Garments
                </Typography>
                <Typography>
                  {selectedAssessment.numberOfGoodGarments} /{" "}
                  {selectedAssessment.timerValues.length}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shift / Module
                </Typography>
                <Typography>
                  Shift {selectedAssessment.shift} / Module{" "}
                  {selectedAssessment.moduleNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Timer Values (seconds)
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedAssessment.timerValues.map((value, index) => (
                    <Chip
                      key={index}
                      label={`${index + 1}: ${value.toFixed(2)}s`}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Responsible IE
                </Typography>
                <Typography>{selectedAssessment.responsibleIE}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAssessment(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Assessments;
