export interface SimplexResult {
  iterations: SimplexIteration[];
  solution: Solution;
  status: "optimal" | "unbounded" | "infeasible";
  message: string;
}

export interface SimplexIteration {
  tableau: number[][];
  basicVariables: string[];
  enteringVariable?: string;
  leavingVariable?: string;
  pivotElement?: number;
  pivotRow?: number;
  pivotColumn?: number;
  explanation?: string;
}

export interface Solution {
  variables: { [key: string]: number };
  objectiveValue: number;
}

export interface Problem {
  objective: number[];
  constraints: {
    coefficients: number[];
    rhs: number;
    type: "<=" | ">=" | "=";
  }[];
  type: "max" | "min";
}

export function solveSimplexAlgorithm(problem: Problem): SimplexResult {


  let tableau: number[][] = [];
  let basicVariables: string[] = [];
  const iterations: SimplexIteration[] = [];
  let numVariables = problem.objective.length;
  let numConstraints = problem.constraints.length;

  // Step 1: Convert to Standard Form and Initialize Tableau
  // For minimization problems, convert objective function to maximization
  const objectiveCoefficients = problem.type === "min"
    ? problem.objective.map(c => -c)
    : problem.objective;

  // Initialize tableau dimensions
  // Rows: 1 (objective) + numConstraints
  // Columns: numVariables (x) + numConstraints (slack/artificial) + 1 (RHS)
  // We'll add artificial variables later if needed

  // Count slack, surplus, and artificial variables needed
  let numSlack = 0;
  let numSurplus = 0;
  let numArtificial = 0;

  problem.constraints.forEach(constraint => {
    if (constraint.type === "<=") {
      numSlack++;
    } else if (constraint.type === ">=") {
      numSurplus++;
      numArtificial++; // For >= constraints, we need both surplus and artificial
    } else if (constraint.type === "=") {
      numArtificial++; // For = constraints, we need artificial
    }
  });

  const totalCols = numVariables + numSlack + numSurplus + numArtificial + 1; // +1 for RHS
  const totalRows = numConstraints + 1; // +1 for objective function

  tableau = Array(totalRows).fill(0).map(() => Array(totalCols).fill(0));

  // Fill objective function row (first row of tableau)
  for (let j = 0; j < numVariables; j++) {
    tableau[0][j] = -objectiveCoefficients[j]; // Negative for maximization
  }

  // Fill constraint rows
  let slackIndex = numVariables;
  let surplusIndex = numVariables + numSlack;
  let artificialIndex = numVariables + numSlack + numSurplus;

  // Initialize basic variables for slack variables
  basicVariables = Array(totalRows).fill("");
  basicVariables[0] = "Z"; // Objective function row

  problem.constraints.forEach((constraint, i) => {
    const currentRow = i + 1; // Start from row 1 for constraints
    for (let j = 0; j < numVariables; j++) {
      tableau[currentRow][j] = constraint.coefficients[j];
    }
    tableau[currentRow][totalCols - 1] = constraint.rhs; // RHS

    if (constraint.type === "<=") {
      tableau[currentRow][slackIndex] = 1; // Slack variable
      basicVariables[currentRow] = `s${slackIndex - numVariables + 1}`;
      slackIndex++;
    } else if (constraint.type === ">=") {
      tableau[currentRow][surplusIndex] = -1; // Surplus variable
      tableau[currentRow][artificialIndex] = 1; // Artificial variable
      // Basic variable for Phase I will be artificial variable
      basicVariables[currentRow] = `a${artificialIndex - (numVariables + numSlack + numSurplus) + 1}`;
      surplusIndex++;
      artificialIndex++;
    } else if (constraint.type === "=") {
      tableau[currentRow][artificialIndex] = 1; // Artificial variable
      // Basic variable for Phase I will be artificial variable
      basicVariables[currentRow] = `a${artificialIndex - (numVariables + numSlack + numSurplus) + 1}`;
      artificialIndex++;
    }
  });

  // Phase I: Handle Artificial Variables
  if (numArtificial > 0) {
  
    // Create a new objective function for Phase I (minimize R = sum of artificial variables)
    const phase1Tableau = Array(totalRows).fill(0).map(() => Array(totalCols).fill(0));
    const phase1BasicVariables = [...basicVariables];

    // Copy original tableau to phase1Tableau
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        phase1Tableau[r][c] = tableau[r][c];
      }
    }

    // Initialize R row (new objective function row 0)
    for (let j = 0; j < totalCols - 1; j++) {
      phase1Tableau[0][j] = 0; // R coefficients initially 0
    }
    phase1Tableau[0][totalCols - 1] = 0; // RHS of R

    // Adjust R row for artificial variables
    for (let i = 1; i < totalRows; i++) {
      if (phase1BasicVariables[i] && phase1BasicVariables[i].startsWith("a")) {
        for (let j = 0; j < totalCols; j++) {
          phase1Tableau[0][j] -= phase1Tableau[i][j];
        }
      }
    }

    // Perform simplex iterations for Phase I
    let phase1IterationCount = 0;
    while (true) {
      phase1IterationCount++;

      iterations.push({
        tableau: JSON.parse(JSON.stringify(phase1Tableau)),
        basicVariables: [...phase1BasicVariables],
        explanation: `Fase I - Iteração ${phase1IterationCount}`,
      });

      // Find pivot column (most negative in R row)
      let pivotCol = -1;
      let minVal = 0;
      for (let j = 0; j < totalCols - 1; j++) {
        if (phase1Tableau[0][j] < minVal) {
          minVal = phase1Tableau[0][j];
          pivotCol = j;
        }
      }

      if (pivotCol === -1) {
        // Optimal for Phase I (R is 0 or no negative coefficients)
        break;
      }

      // Find pivot row (minimum ratio test)
      let pivotRow = -1;
      let minRatio = Infinity;
      for (let i = 1; i < totalRows; i++) {
        if (phase1Tableau[i][pivotCol] > 0) {
          const ratio = phase1Tableau[i][totalCols - 1] / phase1Tableau[i][pivotCol];
          if (ratio < minRatio) {
            minRatio = ratio;
            pivotRow = i;
          }
        }
      }

      if (pivotRow === -1) {
        // Unbounded in Phase I (should not happen if problem is feasible)

        return { iterations, solution: { variables: {}, objectiveValue: NaN }, status: "unbounded", message: "Problema ilimitado na Fase I." };
      }

      const pivotElement = phase1Tableau[pivotRow][pivotCol];
      const enteringVariable = `x${pivotCol + 1}`;
      const leavingVariable = phase1BasicVariables[pivotRow];

      iterations[iterations.length - 1].enteringVariable = enteringVariable;
      iterations[iterations.length - 1].leavingVariable = leavingVariable;
      iterations[iterations.length - 1].pivotElement = pivotElement;
      iterations[iterations.length - 1].pivotRow = pivotRow;
      iterations[iterations.length - 1].pivotColumn = pivotCol;
      iterations[iterations.length - 1].explanation = `Fase I - Iteração ${phase1IterationCount}: Variável de entrada ${enteringVariable}, Variável de saída ${leavingVariable}, Elemento pivô ${pivotElement}`;

      // Perform pivot operation
      // Divide pivot row by pivot element
      for (let j = 0; j < totalCols; j++) {
        phase1Tableau[pivotRow][j] /= pivotElement;
      }

      // Make other rows zero in pivot column
      for (let i = 0; i < totalRows; i++) {
        if (i !== pivotRow) {
          const factor = phase1Tableau[i][pivotCol];
          for (let j = 0; j < totalCols; j++) {
            phase1Tableau[i][j] -= factor * phase1Tableau[pivotRow][j];
          }
        }
      }

      // Update basic variables
      phase1BasicVariables[pivotRow] = enteringVariable;
    }

    if (Math.abs(phase1Tableau[0][totalCols - 1]) > 1e-9) {
      return { iterations, solution: { variables: {}, objectiveValue: NaN }, status: "infeasible", message: "Problema inviável: A Fase I terminou com um valor objetivo positivo para as variáveis artificiais." };
    }

    // Remove artificial variable columns and R row (row 0)
    const finalTableauPhase1 = Array(totalRows).fill(0).map(() => Array(totalCols - numArtificial).fill(0));
    const finalBasicVariablesPhase1 = [...phase1BasicVariables];


    let currentDestCol = 0;
    for (let j = 0; j < totalCols; j++) {
      // Skip artificial variable columns
      if (j >= numVariables + numSlack + numSurplus && j < numVariables + numSlack + numSurplus + numArtificial) {
        continue;
      }

      for (let i = 0; i < totalRows; i++) {
        finalTableauPhase1[i][currentDestCol] = phase1Tableau[i][j];
      }
      currentDestCol++;
    }

    // Reconstruct original objective function (row 0)
    tableau = Array(totalRows).fill(0).map(() => Array(totalCols - numArtificial).fill(0));
    basicVariables = [...finalBasicVariablesPhase1];

    // Copy values from phase1Tableau (excluding artificial columns)
    for (let r = 1; r < totalRows; r++) {
      currentDestCol = 0;
      for (let c = 0; c < totalCols; c++) {
        if (c >= numVariables + numSlack + numSurplus && c < numVariables + numSlack + numSurplus + numArtificial) {
          continue; // Skip artificial columns
        }
        tableau[r][currentDestCol] = finalTableauPhase1[r][currentDestCol];
        currentDestCol++;
      }
    }

    // Set original objective function coefficients
    for (let j = 0; j < numVariables; j++) {
      tableau[0][j] = -objectiveCoefficients[j];
    }

    // Adjust objective function (row 0) for current basic variables
    for (let i = 1; i < totalRows; i++) {
      const basicVar = basicVariables[i];
      if (basicVar.startsWith("x")) {
        const varIndex = parseInt(basicVar.substring(1)) - 1;
        const factor = tableau[0][varIndex];
        if (factor !== 0) {
          for (let j = 0; j < totalCols - numArtificial; j++) {
            tableau[0][j] -= factor * tableau[i][j];
          }
        }
      } else if (basicVar.startsWith("s")) {
        // Slack variables have 0 coefficient in objective, no adjustment needed
      }
    }
  }

  // Phase II: Simplex Iterations
  let iterationCount = 0;
  while (true) {
    iterationCount++;

    iterations.push({
      tableau: JSON.parse(JSON.stringify(tableau)),
      basicVariables: [...basicVariables],
      explanation: `Fase II - Iteração ${iterationCount}`,
    });

    // Find pivot column (most negative in objective row)
    let pivotCol = -1;
    let minVal = 0;
    for (let j = 0; j < totalCols - numArtificial - 1; j++) {
      if (tableau[0][j] < minVal) {
        minVal = tableau[0][j];
        pivotCol = j;
      }
    }

    if (pivotCol === -1) {
      // Optimal solution found

      break;
    }

    // Find pivot row (minimum ratio test)
    let pivotRow = -1;
    let minRatio = Infinity;
    for (let i = 1; i < totalRows; i++) {
      if (tableau[i][pivotCol] > 0) {
        const ratio = tableau[i][totalCols - numArtificial - 1] / tableau[i][pivotCol];
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }

    if (pivotRow === -1) {
      // Unbounded problem

      return { iterations, solution: { variables: {}, objectiveValue: NaN }, status: "unbounded", message: "Problema ilimitado: A função objetivo pode ser aumentada indefinidamente." };
    }

    const pivotElement = tableau[pivotRow][pivotCol];
    const enteringVariable = `x${pivotCol + 1}`;
    const leavingVariable = basicVariables[pivotRow];

    iterations[iterations.length - 1].enteringVariable = enteringVariable;
    iterations[iterations.length - 1].leavingVariable = leavingVariable;
    iterations[iterations.length - 1].pivotElement = pivotElement;
    iterations[iterations.length - 1].pivotRow = pivotRow;
    iterations[iterations.length - 1].pivotColumn = pivotCol;
    iterations[iterations.length - 1].explanation = `Fase II - Iteração ${iterationCount}: Variável de entrada ${enteringVariable}, Variável de saída ${leavingVariable}, Elemento pivô ${pivotElement}`;

    // Perform pivot operation
    // Divide pivot row by pivot element
    for (let j = 0; j < totalCols - numArtificial; j++) {
      tableau[pivotRow][j] /= pivotElement;
    }

    // Make other rows zero in pivot column
    for (let i = 0; i < totalRows; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j < totalCols - numArtificial; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }

    // Update basic variables
    basicVariables[pivotRow] = enteringVariable;
  }

  // Extract solution - only show original variables (x1, x2, etc.)
  const solutionVariables: { [key: string]: number } = {};
  
  // Initialize all original decision variables to 0
  for (let i = 0; i < numVariables; i++) {
    solutionVariables[`x${i + 1}`] = 0;
  }

  // Extract values for basic variables that are original decision variables
  for (let i = 1; i < totalRows; i++) {
    const basicVar = basicVariables[i];
    // Only include original decision variables (x1, x2, x3, etc.), not slack or artificial variables
    if (basicVar.startsWith("x") && !basicVar.startsWith("s") && !basicVar.startsWith("a")) {
      const varIndex = parseInt(basicVar.substring(1));
      if (varIndex <= numVariables) {
        solutionVariables[basicVar] = tableau[i][totalCols - numArtificial - 1];
      }
    }
  }

  let objectiveValue = tableau[0][totalCols - numArtificial - 1];
  if (problem.type === "min") {
    objectiveValue = -objectiveValue; // Revert for minimization problem
  }



  return {
    iterations,
    solution: { variables: solutionVariables, objectiveValue: objectiveValue },
    status: "optimal",
    message: "Solução ótima encontrada.",
  };
}


