import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { Fullscreen, Close } from "@mui/icons-material";
import { useAssessments } from "../hooks/useAssessments";
import { getSkillLevelColor, getSkillLevelLabel } from "../utils/calculations";

interface SkillMatrixData {
  epf: string;
  name: string;
  module: number;
  skills: Record<string, number>; // operationId -> skillLevel
}

const SkillsMatrix: React.FC = () => {
  const { assessments, loading } = useAssessments(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [machineTypeFilter, setMachineTypeFilter] = useState<string>("all");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Get unique machine types
  const machineTypes = useMemo(() => {
    const types = new Set(assessments.map((a) => a.machineType));
    return Array.from(types).sort();
  }, [assessments]);

  // Get unique modules
  const modules = useMemo(() => {
    const mods = new Set(assessments.map((a) => a.moduleNumber));
    return Array.from(mods).sort((a, b) => a - b);
  }, [assessments]);

  // Group operations by machine type
  const machineTypeGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    const operationDetails: Record<string, { id: string; name: string }> = {};

    assessments.forEach((assessment) => {
      if (!groups[assessment.machineType]) {
        groups[assessment.machineType] = new Set();
      }
      groups[assessment.machineType].add(assessment.operationId);
      operationDetails[assessment.operationId] = {
        id: assessment.operationId,
        name: assessment.operationName,
      };
    });

    return Object.entries(groups).map(([machineType, operationIds]) => ({
      machineType,
      operations: Array.from(operationIds)
        .map((opId) => ({
          operationId: opId,
          operationName: operationDetails[opId].name,
        }))
        .sort((a, b) => a.operationName.localeCompare(b.operationName)),
    }));
  }, [assessments]);

  // Build skills matrix data
  const skillsMatrixData = useMemo(() => {
    const workerMap = new Map<string, SkillMatrixData>();

    // Filter assessments based on selected filters
    let filteredAssessments = assessments;

    if (shiftFilter !== "all") {
      filteredAssessments = filteredAssessments.filter(
        (a) => a.shift === shiftFilter
      );
    }

    if (machineTypeFilter !== "all") {
      filteredAssessments = filteredAssessments.filter(
        (a) => a.machineType === machineTypeFilter
      );
    }

    filteredAssessments.forEach((assessment) => {
      const key = assessment.epf;

      if (!workerMap.has(key)) {
        workerMap.set(key, {
          epf: assessment.epf,
          name: assessment.teamMember,
          module: assessment.moduleNumber,
          skills: {},
        });
      }

      const worker = workerMap.get(key)!;

      // Keep the highest skill level for each operation
      if (
        !worker.skills[assessment.operationId] ||
        assessment.skillLevel > worker.skills[assessment.operationId]
      ) {
        worker.skills[assessment.operationId] = assessment.skillLevel;
      }
    });

    let result = Array.from(workerMap.values());

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (worker) =>
          worker.epf.toLowerCase().includes(searchLower) ||
          worker.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply module filter
    if (moduleFilter !== "all") {
      result = result.filter(
        (worker) => worker.module === Number(moduleFilter)
      );
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [assessments, searchTerm, moduleFilter, shiftFilter, machineTypeFilter]);

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

  const renderTable = () => (
    <>
      {/* Legend */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          Skill Level Legend:
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip
            label="1 - Beginner"
            size="small"
            sx={{ backgroundColor: getSkillLevelColor(1), color: "white" }}
          />
          <Chip
            label="2 - Intermediate"
            size="small"
            sx={{ backgroundColor: getSkillLevelColor(2), color: "white" }}
          />
          <Chip
            label="3 - Advanced"
            size="small"
            sx={{ backgroundColor: getSkillLevelColor(3), color: "white" }}
          />
          <Chip
            label="4 - Expert"
            size="small"
            sx={{ backgroundColor: getSkillLevelColor(4), color: "white" }}
          />
          <Chip label="- No Assessment" size="small" variant="outlined" />
        </Box>
      </Paper>

      {/* Skills Matrix Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: isFullscreen
            ? "calc(100vh - 200px)"
            : "calc(100vh - 350px)",
          overflow: "auto",
          "& .MuiTableCell-head": {
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
            position: "sticky",
            top: 0,
            zIndex: 3,
          },
          "& .MuiTableCell-body": {
            minWidth: 80,
          },
          "& .sticky-col": {
            position: "sticky",
            left: 0,
            backgroundColor: "#fff",
            zIndex: 2,
            borderRight: "2px solid #e0e0e0",
          },
          "& .sticky-col-2": {
            position: "sticky",
            left: 60,
            backgroundColor: "#fff",
            zIndex: 2,
            borderRight: "2px solid #e0e0e0",
          },
          "& .sticky-col-3": {
            position: "sticky",
            left: 220,
            backgroundColor: "#fff",
            zIndex: 2,
            borderRight: "2px solid #e0e0e0",
          },
          "& .MuiTableCell-head.sticky-col, & .MuiTableCell-head.sticky-col-2, & .MuiTableCell-head.sticky-col-3":
            {
              backgroundColor: "#f5f5f5",
              zIndex: 4,
            },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            {/* Main Header Row - Machine Types */}
            <TableRow>
              <TableCell className="sticky-col" rowSpan={2} align="center">
                Module
              </TableCell>
              <TableCell className="sticky-col-2" rowSpan={2} align="center">
                EPF
              </TableCell>
              <TableCell className="sticky-col-3" rowSpan={2} align="left">
                Team Member
              </TableCell>
              {machineTypeGroups.map((group) => (
                <TableCell
                  key={group.machineType}
                  colSpan={group.operations.length}
                  align="center"
                  sx={{
                    borderLeft: "2px solid #e0e0e0",
                    backgroundColor: "#e3f2fd",
                    fontWeight: "bold",
                  }}
                >
                  {group.machineType}
                </TableCell>
              ))}
            </TableRow>

            {/* Sub Header Row - Operations */}
            <TableRow>
              {machineTypeGroups.map((group) =>
                group.operations.map((operation, idx) => (
                  <TableCell
                    key={operation.operationId}
                    align="center"
                    sx={{
                      minWidth: 100,
                      maxWidth: 150,
                      borderLeft: idx === 0 ? "2px solid #e0e0e0" : "none",
                      backgroundColor: "#f5f5f5",
                      fontSize: "0.75rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Tooltip title={operation.operationName} arrow>
                      <span>{operation.operationName}</span>
                    </Tooltip>
                  </TableCell>
                ))
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {skillsMatrixData.map((worker) => (
              <TableRow key={worker.epf} hover>
                <TableCell className="sticky-col" align="center">
                  {worker.module}
                </TableCell>
                <TableCell className="sticky-col-2" align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {worker.epf}
                  </Typography>
                </TableCell>
                <TableCell className="sticky-col-3">
                  <Typography variant="body2">{worker.name}</Typography>
                </TableCell>

                {machineTypeGroups.map((group) =>
                  group.operations.map((operation, opIdx) => {
                    const skillLevel = worker.skills[operation.operationId];
                    return (
                      <TableCell
                        key={operation.operationId}
                        align="center"
                        sx={{
                          borderLeft:
                            opIdx === 0 ? "2px solid #e0e0e0" : "none",
                        }}
                      >
                        {skillLevel ? (
                          <Tooltip title={getSkillLevelLabel(skillLevel)} arrow>
                            <Chip
                              label={skillLevel}
                              size="small"
                              sx={{
                                backgroundColor: getSkillLevelColor(skillLevel),
                                color: "white",
                                fontWeight: "bold",
                                minWidth: 40,
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {skillsMatrixData.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No workers found matching the selected filters.
          </Typography>
        </Box>
      )}
    </>
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Skills Matrix
        </Typography>
        <IconButton
          color="primary"
          onClick={() => setIsFullscreen(true)}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <Fullscreen />
        </IconButton>
      </Box>

      {/* Filters */}
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
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Module"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Modules</MenuItem>
              {modules.map((module) => (
                <MenuItem key={module} value={module}>
                  Module {module}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
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
              label="Machine Type"
              value={machineTypeFilter}
              onChange={(e) => setMachineTypeFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Machine Types</MenuItem>
              {machineTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="body2" color="text.secondary">
              Total Workers: {skillsMatrixData.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {renderTable()}

      {/* Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="bold">
              Skills Matrix - Fullscreen View
            </Typography>
            <IconButton onClick={() => setIsFullscreen(false)} edge="end">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Filters in Fullscreen */}
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
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  select
                  label="Module"
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Modules</MenuItem>
                  {modules.map((module) => (
                    <MenuItem key={module} value={module}>
                      Module {module}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
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
                  label="Machine Type"
                  value={machineTypeFilter}
                  onChange={(e) => setMachineTypeFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Machine Types</MenuItem>
                  {machineTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="body2" color="text.secondary">
                  Total Workers: {skillsMatrixData.length}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {renderTable()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFullscreen(false)} variant="contained">
            Exit Fullscreen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillsMatrix;
