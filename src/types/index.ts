import { Timestamp } from "firebase/firestore";

export interface Assessment {
  id: string;
  styleId: string;
  styleName: string;
  operationId: string;
  operationName: string;
  smv: number;
  machineType: string;
  shift: "A" | "B";
  teamMember: string;
  epf: string;
  date: Timestamp;
  responsibleIE: string;
  moduleNumber: number;
  timerValues: number[];
  numberOfGoodGarments: number;
  ssv: number;
  averageTime: number;
  efficiency: number;
  ftt: number;
  skillLevel: number;
  createdBy: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Style {
  id: string;
  name: string;
}

export interface Operation {
  id: string;
  name: string;
  description: string;
  smv: number;
  machineType: string;
}

export interface KPIData {
  totalAssessments: number;
  averageEfficiency: number;
  averageFTT: number;
  totalWorkers: number;
  activeStyles: number;
  activeOperations: number;
}

export interface WorkerPerformance {
  epf: string;
  name: string;
  totalAssessments: number;
  avgEfficiency: number;
  avgFTT: number;
  currentSkillLevel: number;
  assessments: Assessment[];
}

export interface OperationPerformance {
  operationId: string;
  operationName: string;
  machineType: string;
  smv: number;
  avgEfficiency: number;
  totalAssessments: number;
  avgCompletionTime: number;
}

export interface StylePerformance {
  styleId: string;
  styleName: string;
  totalAssessments: number;
  operationsCount: number;
  avgEfficiency: number;
  avgFTT: number;
}

export interface MachineTypePerformance {
  machineType: string;
  operationsCount: number;
  totalAssessments: number;
  avgEfficiency: number;
  avgFTT: number;
}
