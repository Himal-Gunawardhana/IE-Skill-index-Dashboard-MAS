import {
  collection,
  query,
  getDocs,
  onSnapshot,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { Assessment, Style, Operation } from "../types";

const ASSESSMENTS_COLLECTION = "assessments";
const STYLES_COLLECTION = "styles";
const OPERATIONS_COLLECTION = "operations";

/**
 * Get all assessments
 */
export const getAllAssessments = async (): Promise<Assessment[]> => {
  const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
  const q = query(assessmentsRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assessment[];
};

/**
 * Get assessments with filters
 */
export const getFilteredAssessments = async (filters: {
  startDate?: Date;
  endDate?: Date;
  shift?: string;
  skillLevel?: number;
  moduleNumber?: number;
  machineType?: string;
  searchTerm?: string;
}): Promise<Assessment[]> => {
  const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
  const constraints: QueryConstraint[] = [orderBy("date", "desc")];

  if (filters.startDate) {
    constraints.push(
      where("date", ">=", Timestamp.fromDate(filters.startDate))
    );
  }

  if (filters.endDate) {
    constraints.push(where("date", "<=", Timestamp.fromDate(filters.endDate)));
  }

  if (filters.shift) {
    constraints.push(where("shift", "==", filters.shift));
  }

  if (filters.skillLevel) {
    constraints.push(where("skillLevel", "==", filters.skillLevel));
  }

  if (filters.moduleNumber) {
    constraints.push(where("moduleNumber", "==", filters.moduleNumber));
  }

  if (filters.machineType) {
    constraints.push(where("machineType", "==", filters.machineType));
  }

  const q = query(assessmentsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  let results = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assessment[];

  // Client-side filtering for search term (EPF or name)
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    results = results.filter(
      (assessment) =>
        assessment.epf.toLowerCase().includes(searchLower) ||
        assessment.teamMember.toLowerCase().includes(searchLower)
    );
  }

  return results;
};

/**
 * Subscribe to real-time assessments updates
 */
export const subscribeToAssessments = (
  callback: (assessments: Assessment[]) => void
): (() => void) => {
  const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
  const q = query(assessmentsRef, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const assessments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Assessment[];
    callback(assessments);
  });
};

/**
 * Get all styles
 */
export const getAllStyles = async (): Promise<Style[]> => {
  const stylesRef = collection(db, STYLES_COLLECTION);
  const querySnapshot = await getDocs(stylesRef);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Style[];
};

/**
 * Get all operations
 */
export const getAllOperations = async (): Promise<Operation[]> => {
  const operationsRef = collection(db, OPERATIONS_COLLECTION);
  const querySnapshot = await getDocs(operationsRef);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Operation[];
};

/**
 * Get assessments by worker (EPF)
 */
export const getAssessmentsByWorker = async (
  epf: string
): Promise<Assessment[]> => {
  const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
  const q = query(
    assessmentsRef,
    where("epf", "==", epf),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assessment[];
};

/**
 * Get assessments by operation
 */
export const getAssessmentsByOperation = async (
  operationId: string
): Promise<Assessment[]> => {
  const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
  const q = query(
    assessmentsRef,
    where("operationId", "==", operationId),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assessment[];
};

/**
 * Get assessments by style
 */
export const getAssessmentsByStyle = async (
  styleId: string
): Promise<Assessment[]> => {
  const assessmentsRef = collection(db, ASSESSMENTS_COLLECTION);
  const q = query(
    assessmentsRef,
    where("styleId", "==", styleId),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Assessment[];
};
