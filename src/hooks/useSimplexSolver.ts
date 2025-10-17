import { useState, useCallback } from "react";
import { Problem, SimplexResult, solveSimplexAlgorithm } from "@/lib/simplexAlgorithm";
import { validateProblemInput } from "@/lib/validation";

export const useSimplexSolver = () => {
  const [results, setResults] = useState<SimplexResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const solveSimplex = useCallback((problem: Problem) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const validationResult = validateProblemInput(problem);
      if (validationResult.isValid) {
        console.log(validationResult);
        const result = solveSimplexAlgorithm(problem);
        setResults(result);
      } else {
        console.log(validationResult);
        setError(validationResult.message)
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { solveSimplex, results, error, loading };
};

