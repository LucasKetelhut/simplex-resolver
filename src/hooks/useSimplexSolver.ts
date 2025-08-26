import { useState, useCallback } from "react";
import { Problem, SimplexResult, solveSimplexAlgorithm } from "@/lib/simplexAlgorithm";

export const useSimplexSolver = () => {
  const [results, setResults] = useState<SimplexResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const solveSimplex = useCallback((problem: Problem) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const result = solveSimplexAlgorithm(problem);
      setResults(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { solveSimplex, results, error, loading };
};

