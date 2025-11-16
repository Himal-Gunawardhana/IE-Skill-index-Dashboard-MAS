import {
  Assessment,
  KPIData,
  WorkerPerformance,
  OperationPerformance,
  StylePerformance,
  MachineTypePerformance,
} from "../types";

/**
 * Calculate KPI data from assessments
 */
export const calculateKPIs = (assessments: Assessment[]): KPIData => {
  if (assessments.length === 0) {
    return {
      totalAssessments: 0,
      averageEfficiency: 0,
      averageFTT: 0,
      totalWorkers: 0,
      activeStyles: 0,
      activeOperations: 0,
    };
  }

  const totalEfficiency = assessments.reduce((sum, a) => sum + a.efficiency, 0);
  const totalFTT = assessments.reduce((sum, a) => sum + a.ftt, 0);
  const uniqueWorkers = new Set(assessments.map((a) => a.epf));
  const uniqueStyles = new Set(assessments.map((a) => a.styleId));
  const uniqueOperations = new Set(assessments.map((a) => a.operationId));

  return {
    totalAssessments: assessments.length,
    averageEfficiency: totalEfficiency / assessments.length,
    averageFTT: totalFTT / assessments.length,
    totalWorkers: uniqueWorkers.size,
    activeStyles: uniqueStyles.size,
    activeOperations: uniqueOperations.size,
  };
};

/**
 * Get worker performance data
 */
export const getWorkerPerformance = (
  assessments: Assessment[]
): WorkerPerformance[] => {
  const workerMap = new Map<string, Assessment[]>();

  assessments.forEach((assessment) => {
    const existing = workerMap.get(assessment.epf) || [];
    workerMap.set(assessment.epf, [...existing, assessment]);
  });

  const workerPerformances: WorkerPerformance[] = [];

  workerMap.forEach((workerAssessments, epf) => {
    const totalEfficiency = workerAssessments.reduce(
      (sum, a) => sum + a.efficiency,
      0
    );
    const totalFTT = workerAssessments.reduce((sum, a) => sum + a.ftt, 0);
    const latestAssessment = workerAssessments[0]; // Assuming sorted by date desc

    workerPerformances.push({
      epf,
      name: latestAssessment.teamMember,
      totalAssessments: workerAssessments.length,
      avgEfficiency: totalEfficiency / workerAssessments.length,
      avgFTT: totalFTT / workerAssessments.length,
      currentSkillLevel: latestAssessment.skillLevel,
      assessments: workerAssessments,
    });
  });

  return workerPerformances.sort((a, b) => b.avgEfficiency - a.avgEfficiency);
};

/**
 * Get operation performance data
 */
export const getOperationPerformance = (
  assessments: Assessment[]
): OperationPerformance[] => {
  const operationMap = new Map<string, Assessment[]>();

  assessments.forEach((assessment) => {
    const existing = operationMap.get(assessment.operationId) || [];
    operationMap.set(assessment.operationId, [...existing, assessment]);
  });

  const operationPerformances: OperationPerformance[] = [];

  operationMap.forEach((opAssessments, operationId) => {
    const totalEfficiency = opAssessments.reduce(
      (sum, a) => sum + a.efficiency,
      0
    );
    const totalCompletionTime = opAssessments.reduce(
      (sum, a) => sum + a.averageTime,
      0
    );
    const firstAssessment = opAssessments[0];

    operationPerformances.push({
      operationId,
      operationName: firstAssessment.operationName,
      machineType: firstAssessment.machineType,
      smv: firstAssessment.smv,
      avgEfficiency: totalEfficiency / opAssessments.length,
      totalAssessments: opAssessments.length,
      avgCompletionTime: totalCompletionTime / opAssessments.length,
    });
  });

  return operationPerformances.sort(
    (a, b) => b.avgEfficiency - a.avgEfficiency
  );
};

/**
 * Get style performance data
 */
export const getStylePerformance = (
  assessments: Assessment[]
): StylePerformance[] => {
  const styleMap = new Map<string, Assessment[]>();

  assessments.forEach((assessment) => {
    const existing = styleMap.get(assessment.styleId) || [];
    styleMap.set(assessment.styleId, [...existing, assessment]);
  });

  const stylePerformances: StylePerformance[] = [];

  styleMap.forEach((styleAssessments, styleId) => {
    const totalEfficiency = styleAssessments.reduce(
      (sum, a) => sum + a.efficiency,
      0
    );
    const totalFTT = styleAssessments.reduce((sum, a) => sum + a.ftt, 0);
    const uniqueOperations = new Set(
      styleAssessments.map((a) => a.operationId)
    );
    const firstAssessment = styleAssessments[0];

    stylePerformances.push({
      styleId,
      styleName: firstAssessment.styleName,
      totalAssessments: styleAssessments.length,
      operationsCount: uniqueOperations.size,
      avgEfficiency: totalEfficiency / styleAssessments.length,
      avgFTT: totalFTT / styleAssessments.length,
    });
  });

  return stylePerformances.sort((a, b) => b.avgEfficiency - a.avgEfficiency);
};

/**
 * Get machine type performance data
 */
export const getMachineTypePerformance = (
  assessments: Assessment[]
): MachineTypePerformance[] => {
  const machineMap = new Map<string, Assessment[]>();

  assessments.forEach((assessment) => {
    const existing = machineMap.get(assessment.machineType) || [];
    machineMap.set(assessment.machineType, [...existing, assessment]);
  });

  const machinePerformances: MachineTypePerformance[] = [];

  machineMap.forEach((machineAssessments, machineType) => {
    const totalEfficiency = machineAssessments.reduce(
      (sum, a) => sum + a.efficiency,
      0
    );
    const totalFTT = machineAssessments.reduce((sum, a) => sum + a.ftt, 0);
    const uniqueOperations = new Set(
      machineAssessments.map((a) => a.operationId)
    );

    machinePerformances.push({
      machineType,
      operationsCount: uniqueOperations.size,
      totalAssessments: machineAssessments.length,
      avgEfficiency: totalEfficiency / machineAssessments.length,
      avgFTT: totalFTT / machineAssessments.length,
    });
  });

  return machinePerformances.sort((a, b) => b.avgEfficiency - a.avgEfficiency);
};

/**
 * Get skill level distribution
 */
export const getSkillLevelDistribution = (
  assessments: Assessment[]
): Record<number, number> => {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

  assessments.forEach((assessment) => {
    distribution[assessment.skillLevel] =
      (distribution[assessment.skillLevel] || 0) + 1;
  });

  return distribution;
};

/**
 * Get shift comparison data
 */
export const getShiftComparison = (
  assessments: Assessment[]
): {
  shiftA: { count: number; avgEfficiency: number; avgFTT: number };
  shiftB: { count: number; avgEfficiency: number; avgFTT: number };
} => {
  const shiftA = assessments.filter((a) => a.shift === "A");
  const shiftB = assessments.filter((a) => a.shift === "B");

  const calcShiftData = (shiftAssessments: Assessment[]) => {
    if (shiftAssessments.length === 0) {
      return { count: 0, avgEfficiency: 0, avgFTT: 0 };
    }
    const totalEfficiency = shiftAssessments.reduce(
      (sum, a) => sum + a.efficiency,
      0
    );
    const totalFTT = shiftAssessments.reduce((sum, a) => sum + a.ftt, 0);
    return {
      count: shiftAssessments.length,
      avgEfficiency: totalEfficiency / shiftAssessments.length,
      avgFTT: totalFTT / shiftAssessments.length,
    };
  };

  return {
    shiftA: calcShiftData(shiftA),
    shiftB: calcShiftData(shiftB),
  };
};
