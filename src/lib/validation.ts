import { Problem } from "./simplexAlgorithm";

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateProblemInput(problem: Problem): ValidationResult {
  // checa se a função objetivo possui coeficientes 
  if (!problem.objective || problem.objective.length === 0) {
    return {
      isValid: false,
      message: "A função objetivo deve ter pelo menos um coeficiente.",
    };
  }

  // checa se todos os coeficientes da função objetivo são números 
  if (problem.objective.some(coeff => isNaN(coeff))) {
    return {
      isValid: false,
      message: "Todos os coeficientes da função objetivo devem ser números válidos.",
    };
  }

  // checa se possui restrições 
  if (!problem.constraints || problem.constraints.length === 0) {
    return {
      isValid: false,
      message: "O problema deve ter pelo menos uma restrição.",
    };
  }

  // checa cada restrição
  for (let i = 0; i < problem.constraints.length; i++) {
    const constraint = problem.constraints[i];

    // checa se a restrição possui coeficientes
    if (!constraint.coefficients || constraint.coefficients.length === 0) {
      return {
        isValid: false,
        message: `A restrição ${i + 1} deve ter coeficientes.`,
      };
    }

    // checa se os coeficientes da restrição tem o mesmo número que a fuinção objetivo 
    if (constraint.coefficients.length !== problem.objective.length) {
      return {
        isValid: false,
        message: `A restrição ${i + 1} deve ter o mesmo número de coeficientes que a função objetivo.`,
      };
    }

    // checa se todos os coeficientes da restrição são números 
    if (constraint.coefficients.some(coeff => isNaN(coeff))) {
      return {
        isValid: false,
        message: `Todos os coeficientes da restrição ${i + 1} devem ser números válidos.`,
      };
    }

    // checa se o RHS é um número
    if (isNaN(constraint.rhs)) {
      return {
        isValid: false,
        message: `O lado direito da restrição ${i + 1} deve ser um número válido.`,
      };
    }

    // checa se o tipo de restrição é valido 
    if (!["<=", ">=", "="].includes(constraint.type)) {
      return {
        isValid: false,
        message: `O tipo da restrição ${i + 1} deve ser <=, >= ou =.`,
      };
    }
  }

  // checa se o tipo do problema é valido
  if (!["max", "min"].includes(problem.type)) {
    return {
      isValid: false,
      message: "O tipo do problema deve ser 'max' ou 'min'.",
    };
  }

  return {
    isValid: true,
    message: "Problema válido.",
  };
}

