import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  TrendingUp,
  CheckCircle,
  People,
  Style,
  Build,
} from "@mui/icons-material";
import KPICard from "../components/cards/KPICard";
import EfficiencyTrendChart from "../components/charts/EfficiencyTrendChart";
import SkillLevelPieChart from "../components/charts/SkillLevelPieChart";
import ShiftComparisonChart from "../components/charts/ShiftComparisonChart";
import TopWorkersChart from "../components/charts/TopWorkersChart";
import { useAssessments } from "../hooks/useAssessments";
import { calculateKPIs } from "../services/analyticsService";
import { formatPercentage } from "../utils/calculations";
import { getDateRange, isDateInRange } from "../utils/dateHelpers";

const Dashboard: React.FC = () => {
  const { assessments, loading } = useAssessments(true);
  const [dateFilter, setDateFilter] = useState<number>(7);

  const filteredAssessments = useMemo(() => {
    if (dateFilter === 0) return assessments;
    const { start, end } = getDateRange(dateFilter);
    return assessments.filter((a) => isDateInRange(a.date, start, end));
  }, [assessments, dateFilter]);

  const kpiData = useMemo(
    () => calculateKPIs(filteredAssessments),
    [filteredAssessments]
  );

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
          Dashboard Overview
        </Typography>
        <ToggleButtonGroup
          value={dateFilter}
          exclusive
          onChange={(e, val) => val !== null && setDateFilter(val)}
          size="small"
        >
          <ToggleButton value={7}>7 Days</ToggleButton>
          <ToggleButton value={30}>30 Days</ToggleButton>
          <ToggleButton value={90}>90 Days</ToggleButton>
          <ToggleButton value={0}>All Time</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Total Assessments"
            value={kpiData.totalAssessments}
            icon={<AssessmentIcon />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Average Efficiency"
            value={formatPercentage(kpiData.averageEfficiency)}
            icon={<TrendingUp />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Average FTT"
            value={formatPercentage(kpiData.averageFTT)}
            icon={<CheckCircle />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Total Workers"
            value={kpiData.totalWorkers}
            icon={<People />}
            color="#9C27B0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Active Styles"
            value={kpiData.activeStyles}
            icon={<Style />}
            color="#00BCD4"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPICard
            title="Active Operations"
            value={kpiData.activeOperations}
            icon={<Build />}
            color="#FF5722"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Efficiency Trend
            </Typography>
            <EfficiencyTrendChart assessments={filteredAssessments} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Skill Level Distribution
            </Typography>
            <SkillLevelPieChart assessments={filteredAssessments} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Shift Comparison
            </Typography>
            <ShiftComparisonChart assessments={filteredAssessments} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Top 10 Performing Workers
            </Typography>
            <TopWorkersChart assessments={filteredAssessments} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
