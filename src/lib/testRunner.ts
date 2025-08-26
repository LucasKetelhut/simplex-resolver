import { Problem, SimplexResult } from "./simplexAlgorithm";
import { solveSimplexAlgorithm } from "./simplexAlgorithm";

interface TestCase {
  name: string;
  problem: Problem;
  expectedSolution: {
    variables: { [key: string]: number };
    objectiveValue: number;
  };
  expectedStatus: "optimal" | "unbounded" | "infeasible";
  tolerance?: number;
}

const testCases: TestCase[] = [
  {
    name: "Monografia - Caso 1: Problema Básico",
    problem: {
      objective: [1, 6],
      constraints: [
        { coefficients: [1, 0], rhs: 200, type: "<=" },
        { coefficients: [0, 1], rhs: 300, type: "<=" },
        { coefficients: [1, 1], rhs: 400, type: "<=" },
      ],
      type: "max",
    },
    expectedSolution: { variables: { x1: 100, x2: 300 }, objectiveValue: 1900 },
    expectedStatus: "optimal",
    tolerance: 1e-9,
  },
  {
    name: "Monografia - Caso 2: Problema com 3 Variáveis",
    problem: {
      objective: [1, 6, 13],
      constraints: [
        { coefficients: [1, 0, 0], rhs: 200, type: "<=" },
        { coefficients: [0, 1, 0], rhs: 300, type: "<=" },
        { coefficients: [1, 1, 1], rhs: 400, type: "<=" },
        { coefficients: [0, 1, 3], rhs: 600, type: "<=" },
      ],
      type: "max",
    },
    expectedSolution: { variables: { x1: 0, x2: 300, x3: 100 }, objectiveValue: 3100 },
    expectedStatus: "optimal",
    tolerance: 1e-9,
  },
  {
    name: "Monografia - Caso 3: Problema com Múltiplas Restrições",
    problem: {
      objective: [3, 1, 2],
      constraints: [
        { coefficients: [1, 1, 3], rhs: 30, type: "<=" },
        { coefficients: [2, 2, 5], rhs: 24, type: "<=" },
        { coefficients: [4, 1, 2], rhs: 36, type: "<=" },
      ],
      type: "max",
    },
    expectedSolution: { variables: { x1: 8, x2: 4, x3: 0 }, objectiveValue: 28 },
    expectedStatus: "optimal",
    tolerance: 1e-9,
  },
  {
    name: "Monografia - Caso 4: Problema com Restrição de Maior ou Igual e Igualdade",
    problem: {
      objective: [5, 4],
      constraints: [
        { coefficients: [6, 4], rhs: 24, type: "<=" },
        { coefficients: [1, 2], rhs: 6, type: "<=" },
        { coefficients: [1, 1], rhs: 1, type: ">=" },
        { coefficients: [0, 1], rhs: 2, type: "<=" },
      ],
      type: "max",
    },
    expectedSolution: { variables: { x1: 3, x2: 1.5 }, objectiveValue: 21 },
    expectedStatus: "optimal",
    tolerance: 1e-9,
  },
  {
    name: "Monografia - Caso 5: Problema Ilimitado (Modificado)",
    problem: {
      objective: [1, 2],
      constraints: [
        { coefficients: [-1, 1], rhs: 1, type: "<=" },
        { coefficients: [1, -1], rhs: 1, type: "<=" },
      ],
      type: "max",
    },
    expectedSolution: { variables: {}, objectiveValue: NaN },
    expectedStatus: "unbounded",
  },
  {
    name: "Monografia - Caso 6: Problema Ilimitado (Modificado)",
    problem: {
      objective: [2, 4],
      constraints: [
        { coefficients: [1, -2], rhs: 5, type: "<=" },
        { coefficients: [-1, 1], rhs: 4, type: "<=" },
      ],
      type: "max",
    },
    expectedSolution: { variables: {}, objectiveValue: NaN },
    expectedStatus: "unbounded",
  },
];

export const runSimplexTests = (solveSimplex: (problem: Problem) => SimplexResult) => {

  const testResults: any[] = [];

  testCases.forEach((testCase, index) => {

    let result: SimplexResult | null = null;
    let testPassed = false;
    let message = "";

    try {
      result = solveSimplex(testCase.problem);

      if (result.status !== testCase.expectedStatus) {
        message = `Status esperado ${testCase.expectedStatus}, obtido ${result.status}.`;
        testPassed = false;
      } else if (result.status === "optimal") {
        const objectiveValueDiff = Math.abs(result.solution.objectiveValue - testCase.expectedSolution.objectiveValue);
        const variablesMatch = Object.keys(testCase.expectedSolution.variables).every(key => {
          const expected = testCase.expectedSolution.variables[key];
          const actual = result!.solution.variables[key];
          return Math.abs(expected - actual) < (testCase.tolerance || 1e-9);
        });

        if (objectiveValueDiff < (testCase.tolerance || 1e-9) && variablesMatch) {
          testPassed = true;
          message = "Solução ótima encontrada e corresponde ao esperado.";
        } else {
          message = `Solução ótima não corresponde ao esperado. Z esperado: ${testCase.expectedSolution.objectiveValue}, Z obtido: ${result.solution.objectiveValue}. Variáveis esperadas: ${JSON.stringify(testCase.expectedSolution.variables)}, Variáveis obtidas: ${JSON.stringify(result.solution.variables)}.`;
          testPassed = false;
        }
      } else {
        testPassed = true;
        message = `Status ${testCase.expectedStatus} detectado corretamente.`;
      }
    } catch (e: any) {
      message = `Erro durante a execução do teste: ${e.message}`;
      testPassed = false;

    }

    testResults.push({
      name: testCase.name,
      passed: testPassed,
      message: message,
      result: result,
      expected: testCase.expectedSolution,
      status: result?.status,
      expectedStatus: testCase.expectedStatus,
    });

    if (testPassed) {
      console.log(`Teste ${index + 1} PASSED: ${testCase.name}`);
    } else {
      console.error(`Teste ${index + 1} FAILED: ${testCase.name}`, { message, result, expected: testCase.expectedSolution });
    }
  });

  console.log("Testes automatizados concluídos.", { testResults });
  return testResults;
};

runSimplexTests(solveSimplexAlgorithm);