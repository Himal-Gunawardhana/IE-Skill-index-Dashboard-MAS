/**
 * Calculate Standard Second Value (SSV)
 * SSV = SMV * 60
 */
export const calculateSSV = (smv: number): number => {
  return smv * 60;
};

/**
 * Calculate Average Time from timer values
 */
export const calculateAverageTime = (timerValues: number[]): number => {
  if (timerValues.length === 0) return 0;
  const sum = timerValues.reduce((acc, val) => acc + val, 0);
  return sum / timerValues.length;
};

/**
 * Calculate Efficiency
 * Efficiency = (SSV / Average Time) * 100
 */
export const calculateEfficiency = (ssv: number, avgTime: number): number => {
  return avgTime > 0 ? (ssv / avgTime) * 100 : 0;
};

/**
 * Calculate First Time Through (FTT)
 * FTT = (Number of Good Garments / Timers Run) * 100
 */
export const calculateFTT = (
  goodGarments: number,
  timersRun: number
): number => {
  return timersRun > 0 ? (goodGarments / timersRun) * 100 : 0;
};

/**
 * Calculate Skill Level based on FTT and Efficiency
 * Level 1: Beginner (FTT 100%, Efficiency < 40%)
 * Level 2: Intermediate (FTT 100%, Efficiency 40-60%)
 * Level 3: Advanced (FTT 100%, Efficiency 60-80%)
 * Level 4: Expert (FTT 100%, Efficiency > 80%)
 */
export const calculateSkillLevel = (
  ftt: number,
  efficiency: number
): number => {
  if (ftt === 100) {
    if (efficiency < 40) return 1;
    if (efficiency < 60) return 2;
    if (efficiency < 80) return 3;
    return 4;
  }
  return 1;
};

/**
 * Get skill level label
 */
export const getSkillLevelLabel = (level: number): string => {
  switch (level) {
    case 1:
      return "Beginner";
    case 2:
      return "Intermediate";
    case 3:
      return "Advanced";
    case 4:
      return "Expert";
    default:
      return "Unknown";
  }
};

/**
 * Get skill level color
 */
export const getSkillLevelColor = (level: number): string => {
  switch (level) {
    case 1:
      return "#F44336"; // Red
    case 2:
      return "#FF9800"; // Orange
    case 3:
      return "#2196F3"; // Blue
    case 4:
      return "#4CAF50"; // Green
    default:
      return "#9E9E9E"; // Gray
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format time in seconds to readable format
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
};
