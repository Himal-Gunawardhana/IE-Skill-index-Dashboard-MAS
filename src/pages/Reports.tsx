import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Download } from "@mui/icons-material";
import { useAssessments } from "../hooks/useAssessments";
import { formatDate, timestampToDate } from "../utils/dateHelpers";
import { formatPercentage } from "../utils/calculations";
import { exportToExcel } from "../utils/exportHelpers";

const Reports: React.FC = () => {
  const { assessments, loading } = useAssessments(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [reportType] = useState<string>("daily");

  const dailyData = useMemo(() => {
    if (!selectedDate) return [];
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    return assessments.filter((a) => {
      const assessmentDate = timestampToDate(a.date);
      return assessmentDate >= startOfDay && assessmentDate <= endOfDay;
    });
  }, [assessments, selectedDate]);

  const moduleData = useMemo(() => {
    const moduleMap = new Map<
      number,
      { count: number; totalEff: number; totalFTT: number }
    >();
    assessments.forEach((a) => {
      const existing = moduleMap.get(a.moduleNumber) || {
        count: 0,
        totalEff: 0,
        totalFTT: 0,
      };
      moduleMap.set(a.moduleNumber, {
        count: existing.count + 1,
        totalEff: existing.totalEff + a.efficiency,
        totalFTT: existing.totalFTT + a.ftt,
      });
    });
    return Array.from(moduleMap.entries())
      .map(([module, data]) => ({
        module,
        count: data.count,
        avgEfficiency: data.totalEff / data.count,
        avgFTT: data.totalFTT / data.count,
      }))
      .sort((a, b) => a.module - b.module);
  }, [assessments]);

  const shiftData = useMemo(() => {
    const shiftA = assessments.filter((a) => a.shift === "A");
    const shiftB = assessments.filter((a) => a.shift === "B");
    return {
      A: {
        count: shiftA.length,
        avgEff:
          shiftA.reduce((sum, a) => sum + a.efficiency, 0) / shiftA.length || 0,
        avgFTT: shiftA.reduce((sum, a) => sum + a.ftt, 0) / shiftA.length || 0,
      },
      B: {
        count: shiftB.length,
        avgEff:
          shiftB.reduce((sum, a) => sum + a.efficiency, 0) / shiftB.length || 0,
        avgFTT: shiftB.reduce((sum, a) => sum + a.ftt, 0) / shiftB.length || 0,
      },
    };
  }, [assessments]);

  const handleExport = () => {
    if (reportType === "daily" && dailyData.length > 0) {
      exportToExcel(
        dailyData,
        `daily_report_${formatDate(selectedDate!, "yyyy-MM-dd")}.xlsx`
      );
    } else {
      exportToExcel(assessments, "full_report.xlsx");
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
          Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Daily Production Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Daily Production Report
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { size: "small", sx: { mb: 2 } } }}
              />
            </LocalizationProvider>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Assessments
                    </Typography>
                    <Typography variant="h4">{dailyData.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Average Efficiency
                    </Typography>
                    <Typography variant="h4">
                      {dailyData.length > 0
                        ? formatPercentage(
                            dailyData.reduce(
                              (sum, a) => sum + a.efficiency,
                              0
                            ) / dailyData.length
                          )
                        : "0%"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Average FTT
                    </Typography>
                    <Typography variant="h4">
                      {dailyData.length > 0
                        ? formatPercentage(
                            dailyData.reduce((sum, a) => sum + a.ftt, 0) /
                              dailyData.length
                          )
                        : "0%"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Module Performance Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Module Performance Report (1-26)
            </Typography>
            <Grid container spacing={2}>
              {moduleData.slice(0, 8).map((module) => (
                <Grid item xs={12} sm={6} md={3} key={module.module}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Module {module.module}
                      </Typography>
                      <Typography variant="body2">
                        Assessments: {module.count}
                      </Typography>
                      <Typography variant="body2">
                        Efficiency: {formatPercentage(module.avgEfficiency)}
                      </Typography>
                      <Typography variant="body2">
                        FTT: {formatPercentage(module.avgFTT)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Shift Comparison Report */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Shift Comparison Report
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: "#E3F2FD" }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                      Shift A
                    </Typography>
                    <Typography variant="body1">
                      Total Assessments: {shiftData.A.count}
                    </Typography>
                    <Typography variant="body1">
                      Average Efficiency: {formatPercentage(shiftData.A.avgEff)}
                    </Typography>
                    <Typography variant="body1">
                      Average FTT: {formatPercentage(shiftData.A.avgFTT)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: "#FFF3E0" }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                      Shift B
                    </Typography>
                    <Typography variant="body1">
                      Total Assessments: {shiftData.B.count}
                    </Typography>
                    <Typography variant="body1">
                      Average Efficiency: {formatPercentage(shiftData.B.avgEff)}
                    </Typography>
                    <Typography variant="body1">
                      Average FTT: {formatPercentage(shiftData.B.avgFTT)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
