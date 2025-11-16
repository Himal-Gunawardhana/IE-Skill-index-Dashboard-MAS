import { useState, useEffect } from "react";
import { Assessment } from "../types";
import {
  getAllAssessments,
  subscribeToAssessments,
} from "../services/assessmentService";

export const useAssessments = (realTime: boolean = false) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (realTime) {
      // Real-time subscription
      const unsubscribe = subscribeToAssessments((data) => {
        setAssessments(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // One-time fetch
      const fetchAssessments = async () => {
        try {
          const data = await getAllAssessments();
          setAssessments(data);
          setLoading(false);
        } catch (err) {
          setError(err as Error);
          setLoading(false);
        }
      };

      fetchAssessments();
    }
  }, [realTime]);

  return { assessments, loading, error };
};
