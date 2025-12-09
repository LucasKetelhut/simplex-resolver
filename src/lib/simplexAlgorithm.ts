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

  // Etapa 1: converter para formulário padrão e inicializar o Tableau
  // Para problemas de minimização, converte a função objetivo em maximização
  const objectiveCoefficients =
    problem.type === "min"
      ? problem.objective.map((c) => -c)
      : problem.objective;

  // Inicializa as dimensões do tableau
  // Linhas: 1 (objetivo) + numConstraints
  // Colunas: numVariables (x) + numConstraints (folga/artificial) + 1 (RHS)

  // Conta a folga, o excedente e as variáveis ​​artificiais necessárias
  let numSlack = 0;
  let numSurplus = 0;
  let numArtificial = 0;

  problem.constraints.forEach((constraint) => {
    if (constraint.type === "<=") {
      numSlack++;
    } else if (constraint.type === ">=") {
      numSurplus++;
      numArtificial++;
    } else if (constraint.type === "=") {
      numArtificial++;
    }
  });

  let totalCols = numVariables + numSlack + numSurplus + numArtificial + 1; // +1 para RHS
  const totalRows = numConstraints + 1; // +1 para função objetivo

  tableau = Array(totalRows)
    .fill(0)
    .map(() => Array(totalCols).fill(0));

  // Preenche a linha da função objetivo (primeira linha do quadro)
  for (let j = 0; j < numVariables; j++) {
    tableau[0][j] = -objectiveCoefficients[j]; // Negativo para maximização
  }

  //preenche linhas de restrição
  let slackIndex = numVariables;
  let surplusIndex = numVariables + numSlack;
  let artificialIndex = numVariables + numSlack + numSurplus;

  // Inicializa variáveis ​​básicas para variáveis ​​de folga
  basicVariables = Array(totalRows).fill("");
  basicVariables[0] = "Z";

  problem.constraints.forEach((constraint, i) => {
    const currentRow = i + 1;
    for (let j = 0; j < numVariables; j++) {
      tableau[currentRow][j] = constraint.coefficients[j];
    }
    tableau[currentRow][totalCols - 1] = constraint.rhs;

    if (constraint.type === "<=") {
      tableau[currentRow][slackIndex] = 1; //variável de folga
      basicVariables[currentRow] = `s${slackIndex - numVariables + 1}`;
      slackIndex++;
    } else if (constraint.type === ">=") {
      tableau[currentRow][surplusIndex] = -1; // Variável excedente
      tableau[currentRow][artificialIndex] = 1; //Variável artificial
      // Variável básica para Fase I será variável artificial
      basicVariables[currentRow] = `a${
        artificialIndex - (numVariables + numSlack + numSurplus) + 1
      }`;
      surplusIndex++;
      artificialIndex++;
    } else if (constraint.type === "=") {
      tableau[currentRow][artificialIndex] = 1; //Variável artificial
      // Variável básica para Fase I será variável artificial
      basicVariables[currentRow] = `a${
        artificialIndex - (numVariables + numSlack + numSurplus) + 1
      }`;
      artificialIndex++;
    }
  });

  // Fase I: Lidar com Variáveis ​​Artificiais
  if (numArtificial > 0) {
    // Cria uma nova função objetivo para a Fase I (minimizar R = soma das variáveis ​​artificiais)
    const phase1Tableau = Array(totalRows)
      .fill(0)
      .map(() => Array(totalCols).fill(0));
    const phase1BasicVariables = [...basicVariables];

    // Copia o quadro original para phase1Tableau
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < totalCols; c++) {
        phase1Tableau[r][c] = tableau[r][c];
      }
    }

    // Inicializa a linha R (nova linha da função objetivo 0)
    for (let j = 0; j < totalCols - 1; j++) {
      phase1Tableau[0][j] = 0;
    }
    phase1Tableau[0][totalCols - 1] = 0;

    // Ajusta a linha R para variáveis ​​artificiais
    for (let i = 1; i < totalRows; i++) {
      if (phase1BasicVariables[i] && phase1BasicVariables[i].startsWith("a")) {
        for (let j = 0; j < totalCols; j++) {
          phase1Tableau[0][j] -= phase1Tableau[i][j];
        }
      }
    }

    // Realiza iterações simplex para a Fase I
    let phase1IterationCount = 0;
    while (true) {
      phase1IterationCount++;

      iterations.push({
        tableau: JSON.parse(JSON.stringify(phase1Tableau)),
        basicVariables: [...phase1BasicVariables],
        explanation: `Fase I - Iteração ${phase1IterationCount}`,
      });

      //Encontra a coluna pivô (mais negativa na linha R)
      let pivotCol = -1;
      let minVal = -1e-9; // tolerância pequena em vez de 0
      for (let j = 0; j < totalCols - 1; j++) {
        if (phase1Tableau[0][j] < minVal) {
          minVal = phase1Tableau[0][j];
          pivotCol = j;
        }
      }

      if (pivotCol === -1) {
        break;
      }

      // Encontra a linha pivô (teste de proporção mínima)
      let pivotRow = -1;
      let minRatio = Infinity;
      for (let i = 1; i < totalRows; i++) {
        if (phase1Tableau[i][pivotCol] > 1e-9) {
          const ratio =
            phase1Tableau[i][totalCols - 1] / phase1Tableau[i][pivotCol];
          if (ratio >= -1e-9 && ratio < minRatio) {
            minRatio = ratio;
            pivotRow = i;
          }
        }
      }

      if (pivotRow === -1) {
        // Na Fase I, se nenhuma linha pivô válida for encontrada, verifique se esta é realmente ilimitada
        // ou se deveríamos pular esta coluna
        let allNonPositive = true;
        for (let i = 1; i < totalRows; i++) {
          if (phase1Tableau[i][pivotCol] > 1e-9) {
            allNonPositive = false;
            break;
          }
        }

        if (allNonPositive) {
          // Todos os coeficientes na coluna pivô são não positivos
          // Na Fase I com variáveis ​​excedentes, isso pode ser normal
          //Tenta encontrar outra coluna dinâmica
          let foundAlternative = false;
          for (let altCol = 0; altCol < totalCols - 1; altCol++) {
            if (altCol !== pivotCol && phase1Tableau[0][altCol] < -1e-9) {
              // Verifica se esta coluna alternativa possui coeficientes positivos
              for (let i = 1; i < totalRows; i++) {
                if (phase1Tableau[i][altCol] > 1e-9) {
                  foundAlternative = true;
                  break;
                }
              }
              if (foundAlternative) break;
            }
          }

          if (!foundAlternative) {
            // Não foram encontradas colunas alternativas com coeficientes positivos
            // Isso pode indicar o fim da Fase I
            break;
          } else {
            //ignora esta coluna e continua com a próxima iteração
            continue;
          }
        }

        return {
          iterations,
          solution: { variables: {}, objectiveValue: NaN },
          status: "unbounded",
          message: "Problema ilimitado na Fase I.",
        };
      }

      const pivotElement = phase1Tableau[pivotRow][pivotCol];
      const enteringVariable = `x${pivotCol + 1}`;
      const leavingVariable = phase1BasicVariables[pivotRow];

      iterations[iterations.length - 1].enteringVariable = enteringVariable;
      iterations[iterations.length - 1].leavingVariable = leavingVariable;
      iterations[iterations.length - 1].pivotElement = pivotElement;
      iterations[iterations.length - 1].pivotRow = pivotRow;
      iterations[iterations.length - 1].pivotColumn = pivotCol;
      iterations[
        iterations.length - 1
      ].explanation = `Fase I - Iteração ${phase1IterationCount}: Variável de entrada ${enteringVariable}, Variável de saída ${leavingVariable}, Elemento pivô ${pivotElement}`;

      //Executa operação de pivô
      // Divide a linha pivô por elemento pivô
      for (let j = 0; j < totalCols; j++) {
        phase1Tableau[pivotRow][j] /= pivotElement;
      }

      // Torna as outras linhas zeradas na coluna pivô
      for (let i = 0; i < totalRows; i++) {
        if (i !== pivotRow) {
          const factor = phase1Tableau[i][pivotCol];
          for (let j = 0; j < totalCols; j++) {
            phase1Tableau[i][j] -= factor * phase1Tableau[pivotRow][j];
          }
        }
      }

      //atualiza variaveis ​​basicas
      phase1BasicVariables[pivotRow] = enteringVariable;
    }

    if (phase1Tableau[0][totalCols - 1] > 1e-9) {
      return {
        iterations,
        solution: { variables: {}, objectiveValue: NaN },
        status: "infeasible",
        message:
          "Problema inviável: A Fase I terminou com um valor objetivo positivo para as variáveis artificiais.",
      };
    }

    //Remove colunas de variáveis ​​artificiais e linha R (linha 0)
    const finalTableauPhase1 = Array(totalRows)
      .fill(0)
      .map(() => Array(totalCols - numArtificial).fill(0));
    const finalBasicVariablesPhase1 = [...phase1BasicVariables];

    let currentDestCol = 0;
    for (let j = 0; j < totalCols; j++) {
      // Ignora colunas de variáveis ​​artificiais
      if (
        j >= numVariables + numSlack + numSurplus &&
        j < numVariables + numSlack + numSurplus + numArtificial
      ) {
        continue;
      }

      for (let i = 0; i < totalRows; i++) {
        finalTableauPhase1[i][currentDestCol] = phase1Tableau[i][j];
      }
      currentDestCol++;
    }

    //Reconstruir a função objetivo original (linha 0)
    tableau = Array(totalRows)
      .fill(0)
      .map(() => Array(totalCols - numArtificial).fill(0));
    basicVariables = [...finalBasicVariablesPhase1];

    // Copia valores de phase1Tableau (excluindo colunas artificiais)
    for (let r = 1; r < totalRows; r++) {
      currentDestCol = 0;
      for (let c = 0; c < totalCols; c++) {
        if (
          c >= numVariables + numSlack + numSurplus &&
          c < numVariables + numSlack + numSurplus + numArtificial
        ) {
          continue; //Pular colunas artificiais
        }
        tableau[r][currentDestCol] = finalTableauPhase1[r][currentDestCol];
        currentDestCol++;
      }
    }

    // 🔧 CORREÇÃO DO BUG: Atualizar totalCols após remover colunas artificiais
    totalCols = totalCols - numArtificial;

    // Define os coeficientes originais da função objetivo
    for (let j = 0; j < numVariables; j++) {
      tableau[0][j] = -objectiveCoefficients[j];
    }

    // Ajusta a função objetivo (linha 0) para variáveis ​​básicas atuais
    for (let i = 1; i < totalRows; i++) {
      const basicVar = basicVariables[i];
      if (basicVar.startsWith("x")) {
        const varIndex = parseInt(basicVar.substring(1)) - 1;
        const factor = tableau[0][varIndex];
        if (factor !== 0) {
          for (let j = 0; j < totalCols; j++) {
            tableau[0][j] -= factor * tableau[i][j];
          }
        }
      }
    }
  }

  // Fase II: Iterações Simplex
  let iterationCount = 0;
  while (true) {
    iterationCount++;

    iterations.push({
      tableau: JSON.parse(JSON.stringify(tableau)),
      basicVariables: [...basicVariables],
      explanation: `Fase II - Iteração ${iterationCount}`,
    });

    //Encontra a coluna pivo (mais negativa na linha do objetivo)
    let pivotCol = -1;
    let minVal = -1e-9;
    for (let j = 0; j < totalCols - 1; j++) {
      if (tableau[0][j] < minVal) {
        minVal = tableau[0][j];
        pivotCol = j;
      }
    }

    if (pivotCol === -1) {
      // Solução ótima encontrada
      break;
    }

    // Encontra a linha pivo (teste de proporção mínima)
    let pivotRow = -1;
    let minRatio = Infinity;
    for (let i = 1; i < totalRows; i++) {
      if (tableau[i][pivotCol] > 1e-9) {
        const ratio = tableau[i][totalCols - 1] / tableau[i][pivotCol];
        if (ratio >= -1e-9 && ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }

    if (pivotRow === -1) {
      //Problema ilimitado

      return {
        iterations,
        solution: { variables: {}, objectiveValue: NaN },
        status: "unbounded",
        message:
          "Problema ilimitado: A função objetivo pode ser aumentada indefinidamente.",
      };
    }

    const pivotElement = tableau[pivotRow][pivotCol];
    const enteringVariable = `x${pivotCol + 1}`;
    const leavingVariable = basicVariables[pivotRow];

    iterations[iterations.length - 1].enteringVariable = enteringVariable;
    iterations[iterations.length - 1].leavingVariable = leavingVariable;
    iterations[iterations.length - 1].pivotElement = pivotElement;
    iterations[iterations.length - 1].pivotRow = pivotRow;
    iterations[iterations.length - 1].pivotColumn = pivotCol;
    iterations[
      iterations.length - 1
    ].explanation = `Fase II - Iteração ${iterationCount}: Variável de entrada ${enteringVariable}, Variável de saída ${leavingVariable}, Elemento pivô ${pivotElement}`;

    //Executa operacao de pivo
    // Divide a linha pivo por elemento pivo
    for (let j = 0; j < totalCols; j++) {
      tableau[pivotRow][j] /= pivotElement;
    }

    // Torna as outras linhas zeradas na coluna pivo
    for (let i = 0; i < totalRows; i++) {
      if (i !== pivotRow) {
        const factor = tableau[i][pivotCol];
        for (let j = 0; j < totalCols; j++) {
          tableau[i][j] -= factor * tableau[pivotRow][j];
        }
      }
    }

    //Atualiza variáveis ​​básicas
    basicVariables[pivotRow] = enteringVariable;
  }

  // Extrai a solução  (mostra apenas as variáveis ​​originais (x1, x2, etc))
  const solutionVariables: { [key: string]: number } = {};

  // Inicializa todas as variáveis ​​de decisão originais para 0
  for (let i = 0; i < numVariables; i++) {
    solutionVariables[`x${i + 1}`] = 0;
  }

  // Extrai valores para variáveis ​​básicas que são variáveis ​​de decisão originais
  for (let i = 1; i < totalRows; i++) {
    const basicVar = basicVariables[i];
    // Inclui apenas variáveis ​​de decisao originais (x1, x2, x3, etc), não variáveis ​​ociosas ou artificiais
    if (basicVar.startsWith("x")) {
      const varIndex = parseInt(basicVar.substring(1));
      if (varIndex <= numVariables) {
        solutionVariables[basicVar] = tableau[i][totalCols - 1];
      }
    }
  }

  let objectiveValue = tableau[0][totalCols - 1];
  if (problem.type === "min") {
    objectiveValue = -objectiveValue; // Reverte para problema de minimização
  }

  return {
    iterations,
    solution: { variables: solutionVariables, objectiveValue: objectiveValue },
    status: "optimal",
    message: "Solução ótima encontrada.",
  };
}
