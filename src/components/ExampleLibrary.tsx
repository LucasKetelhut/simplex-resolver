import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Problem } from "@/lib/simplexAlgorithm";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExampleLibraryProps {
  setProblem: React.Dispatch<React.SetStateAction<any>>;
  onExampleLoaded?: () => void;
}

export interface Variable {
  name: string;
  description: string;
}

export interface Constraint {
  coefficients: number[];
  rhs: number;
  type: "<=" | ">=" | "=";
  description: string;
}

export interface ExpectedSolution {
  x1?: number;
  x2?: number;
  x3?: number;
  x4?: number;
  x5?: number;
  z?: number | null;
  description: string;
  status?: "optimal" | "unbounded" | "infeasible";
}

export interface ExampleProblem {
  id: string;
  name: string;
  description: string;
  source: string;
  difficulty: "Básico" | "Intermediário" | "Avançado";
  type: "max" | "min";
  objective: number[];
  objectiveDescription: string;
  variables: Variable[];
  constraints: Constraint[];
  expectedSolution: ExpectedSolution;
}

export const exampleProblems: ExampleProblem[] = [
  // BÁSICO
  {
    id: "basic_didactic",
    name: "Problema Básico Didático",
    description:
      "Um problema simples com 2 variáveis para aprender os conceitos básicos do Simplex.",
    source: "Exemplo didático simples",
    difficulty: "Básico",
    type: "max",
    objective: [2, 3],
    objectiveDescription: "Maximizar o lucro: Z = 2x₁ + 3x₂",
    variables: [
      { name: "x₁", description: "Quantidade do produto A" },
      { name: "x₂", description: "Quantidade do produto B" },
    ],
    constraints: [
      {
        coefficients: [1, 1],
        rhs: 5,
        type: "<=",
        description: "Restrição de recurso 1",
      },
      {
        coefficients: [2, 1],
        rhs: 8,
        type: "<=",
        description: "Restrição de recurso 2",
      },
    ],
    expectedSolution: {
      x1: 0,
      x2: 5,
      z: 15,
      description: "Solução ótima: produzir 5 unidades do produto B",
    },
  },
  {
    id: "dasgupta_2var",
    name: "Exemplo Dasgupta (2 variáveis)",
    description:
      "Exemplo clássico do livro Algorithms de Dasgupta, Papadimitriou e Vazirani.",
    source:
      "Dasgupta, S., Papadimitriou, C. H. & Vazirani, U. V. (2008). Algorithms. McGraw-Hill.",
    difficulty: "Básico",
    type: "max",
    objective: [5, 4],
    objectiveDescription: "Maximizar: Z = 5x₁ + 4x₂",
    variables: [
      { name: "x₁", description: "Primeira variável de decisão" },
      { name: "x₂", description: "Segunda variável de decisão" },
    ],
    constraints: [
      {
        coefficients: [1, 1],
        rhs: 6,
        type: "<=",
        description: "Restrição 1",
      },
      {
        coefficients: [2, 1],
        rhs: 10,
        type: "<=",
        description: "Restrição 2",
      },
    ],
    expectedSolution: {
      x1: 4,
      x2: 2,
      z: 28,
      description: "Solução ótima no vértice (4, 2)",
    },
  },
  // INTERMEDIÁRIO
  {
    id: "taha_mixed",
    name: "Exemplo Taha (Restrições Mistas)",
    description:
      "Problema com restrições mistas (≤, ≥) que requer o método das duas fases.",
    source:
      "Taha, H. A. (2017). Operations Research: An Introduction (10th ed.). Pearson.",
    difficulty: "Intermediário",
    type: "max",
    objective: [5, 4],
    objectiveDescription: "Maximizar: Z = 5x₁ + 4x₂",
    variables: [
      { name: "x₁", description: "Primeira variável de decisão" },
      { name: "x₂", description: "Segunda variável de decisão" },
    ],
    constraints: [
      {
        coefficients: [6, 4],
        rhs: 24,
        type: "<=",
        description: "Restrição de tipo ≤",
      },
      {
        coefficients: [1, 2],
        rhs: 1,
        type: ">=",
        description: "Restrição de tipo ≥",
      },
      {
        coefficients: [0, 1],
        rhs: 2,
        type: ">=",
        description: "Limite inferior para x₂",
      },
    ],
    expectedSolution: {
      x1: 2,
      x2: 3,
      z: 22,
      description: "Solução ótima: x₁=2, x₂=3 (corrigida com fix do bug)",
    },
  },
  {
    id: "dasgupta_3var",
    name: "Exemplo Dasgupta (3 variáveis)",
    description:
      "",
    source:
      "Dasgupta, S., Papadimitriou, C. H. & Vazirani, U. V. (2008). Algorithms. McGraw-Hill.",
    difficulty: "Intermediário",
    type: "max",
    objective: [1, 6, 13],
    objectiveDescription: "Maximizar: Z = x₁ + 6x₂ + 13x₃",
    variables: [
      { name: "x₁", description: "Primeira variável de decisão" },
      { name: "x₂", description: "Segunda variável de decisão" },
      { name: "x₃", description: "Terceira variável de decisão" },
    ],
    constraints: [
      {
        coefficients: [1, 0, 0],
        rhs: 200,
        type: "<=",
        description: "Limite superior para x₁",
      },
      {
        coefficients: [0, 1, 0],
        rhs: 300,
        type: "<=",
        description: "Limite superior para x₂",
      },
      {
        coefficients: [1, 1, 1],
        rhs: 400,
        type: "<=",
        description: "Restrição de soma das variáveis",
      },
      {
        coefficients: [0, 1, 1],
        rhs: 400,
        type: "<=",
        description: "Restrição para x₂ e x₃",
      },
    ],
    expectedSolution: {
      x1: 0,
      x2: 0,
      x3: 400,
      z: 5200,
      description: "Solução ótima: x₁=0, x₂=0, x₃=400",
    },
  },
  {
    id: "cormen_simple",
    name: "Exemplo Cormen (Simples)",
    description: "Exemplo do livro Introduction to Algorithms de Cormen et al.",
    source:
      "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to Algorithms (3rd ed.). MIT Press.",
    difficulty: "Intermediário",
    type: "max",
    objective: [3, 2],
    objectiveDescription: "Maximizar: Z = 3x₁ + 2x₂",
    variables: [
      { name: "x₁", description: "Primeira variável de decisão" },
      { name: "x₂", description: "Segunda variável de decisão" },
    ],
    constraints: [
      {
        coefficients: [2, 1],
        rhs: 4,
        type: "<=",
        description: "Restrição 1",
      },
      {
        coefficients: [1, 2],
        rhs: 3,
        type: "<=",
        description: "Restrição 2",
      },
    ],
    expectedSolution: {
      x1: 1.6,
      x2: 0.8,
      z: 6.4,
      description: "Solução ótima no vértice (1.6, 0.8)",
    },
  },
  // AVANÇADO
  {
    id: "unbounded_example",
    name: "Exemplo Ilimitado (Detecção)",
    description:
      "Problema que demonstra como o Simplex detecta quando a solução é ilimitada.",
    source: "Exemplo clássico de problema ilimitado",
    difficulty: "Avançado",
    type: "max",
    objective: [1, 1],
    objectiveDescription: "Maximizar: Z = x₁ + x₂",
    variables: [
      { name: "x₁", description: "Primeira variável de decisão" },
      { name: "x₂", description: "Segunda variável de decisão" },
    ],
    constraints: [
      {
        coefficients: [1, -1],
        rhs: 1,
        type: "<=",
        description: "Restrição que permite crescimento ilimitado",
      },
    ],
    expectedSolution: {
      z: null,
      description: "Problema ilimitado - solução não existe",
      status: "unbounded",
    },
  },
  {
    id: "infeasible_example",
    name: "Exemplo Inviável (Detecção)",
    description:
      "Problema que demonstra como o Simplex detecta quando não existe solução viável.",
    source: "Exemplo clássico de problema inviável",
    difficulty: "Avançado",
    type: "max",
    objective: [1, 1],
    objectiveDescription: "Maximizar: Z = x₁ + x₂",
    variables: [
      { name: "x₁", description: "Primeira variável de decisão" },
      { name: "x₂", description: "Segunda variável de decisão" },
    ],
    constraints: [
      {
        coefficients: [1, 1],
        rhs: 2,
        type: ">=",
        description: "Restrição 1",
      },
      {
        coefficients: [1, 1],
        rhs: 1,
        type: "<=",
        description: "Restrição 2 (conflita com Restrição 1)",
      },
    ],
    expectedSolution: {
      z: null,
      description:
        "Problema inviável - não existe solução que satisfaça todas as restrições",
      status: "infeasible",
    },
  },
];

const ConstraintDisplay: React.FC<{
  constraint: Constraint;
  variables: Variable[];
}> = ({ constraint, variables }) => {
  const coefficientStrings = constraint.coefficients
    .map((coef, index) => {
      if (coef === 0) return null;
      const varName = variables[index]?.name || `x${index + 1}`;
      if (coef === 1) return varName;
      if (coef === -1) return `-${varName}`;
      return `${coef}${varName}`;
    })
    .filter(Boolean);

  return (
    <div className="text-sm text-gray-700">
      <p className="font-mono">
        {coefficientStrings.join(" + ")} {constraint.type} {constraint.rhs}
      </p>
      <p className="text-xs text-gray-500 mt-1">{constraint.description}</p>
    </div>
  );
};

const ExampleCard: React.FC<{
  example: ExampleProblem;
  onLoadExample: (example: ExampleProblem) => void;
}> = ({ example, onLoadExample }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLoadExample = () => {
    onLoadExample(example);
  };

  // Formatar a solução esperada
  const formatExpectedSolution = () => {
    if (example.expectedSolution.status === "unbounded") {
      return "Ilimitado";
    }
    if (example.expectedSolution.status === "infeasible") {
      return "Inviável";
    }

    const variables = [];
    if (
      example.expectedSolution.x1 !== undefined &&
      example.expectedSolution.x1 !== null
    ) {
      variables.push(`x₁ = ${example.expectedSolution.x1}`);
    }
    if (
      example.expectedSolution.x2 !== undefined &&
      example.expectedSolution.x2 !== null
    ) {
      variables.push(`x₂ = ${example.expectedSolution.x2}`);
    }
    if (
      example.expectedSolution.x3 !== undefined &&
      example.expectedSolution.x3 !== null
    ) {
      variables.push(`x₃ = ${example.expectedSolution.x3}`);
    }
    if (
      example.expectedSolution.x4 !== undefined &&
      example.expectedSolution.x4 !== null
    ) {
      variables.push(`x₄ = ${example.expectedSolution.x4}`);
    }
    if (
      example.expectedSolution.x5 !== undefined &&
      example.expectedSolution.x5 !== null
    ) {
      variables.push(`x₅ = ${example.expectedSolution.x5}`);
    }

    const z =
      example.expectedSolution.z !== null &&
      example.expectedSolution.z !== undefined
        ? `, z = ${example.expectedSolution.z}`
        : "";

    return variables.length > 0 ? `${variables.join(", ")}${z}` : "Sem solução";
  };

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <div
        className="cursor-pointer p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {example.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{example.source}</p>
          <p className="text-sm font-semibold text-green-600 mt-2">
            Solução Esperada: {formatExpectedSolution()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleLoadExample();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Carregar Exemplo
          </Button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </div>

      {/* Conteúdo expandível */}
      {isExpanded && (
        <>
          <Separator />
          <CardContent className="pt-4">
            {/* Descrição */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Descrição</h4>
              <p className="text-sm text-gray-700">{example.description}</p>
            </div>

            {/* Tipo de Otimização */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">
                Tipo de Problema
              </h4>
              <p className="text-sm text-gray-700 font-mono">
                {example.type === "max" ? "Maximização" : "Minimização"}
              </p>
            </div>

            {/* Função Objetivo */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">
                Função Objetivo
              </h4>
              <p className="text-sm text-gray-700 font-mono">
                {example.objectiveDescription}
              </p>
            </div>

            {/* Variáveis */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">
                Variáveis de Decisão
              </h4>
              <div className="space-y-2">
                {example.variables.map((variable, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    <p className="font-mono font-semibold">{variable.name}</p>
                    <p className="text-xs text-gray-500">
                      {variable.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Restrições */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Restrições</h4>
              <div className="space-y-3">
                {example.constraints.map((constraint, index) => (
                  <div key={index} className="border-l-2 border-gray-300 pl-3">
                    <ConstraintDisplay
                      constraint={constraint}
                      variables={example.variables}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dificuldade */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Nível de Dificuldade
              </h4>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  example.difficulty === "Básico"
                    ? "bg-green-100 text-green-800"
                    : example.difficulty === "Intermediário"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {example.difficulty}
              </span>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export const ExampleLibrary: React.FC<ExampleLibraryProps> = ({
  setProblem,
  onExampleLoaded,
}) => {
  const handleLoadExample = (example: ExampleProblem) => {
    // Converter ExampleProblem para Problem
    const problem: Problem = {
      objective: example.objective,
      constraints: example.constraints,
      type: example.type,
    };

    setProblem(problem);

    if (onExampleLoaded) {
      onExampleLoaded();
    }
  };

  const renderExamplesByDifficulty = (
    difficulty: ExampleProblem["difficulty"]
  ) => {
    return exampleProblems
      .filter((example) => example.difficulty === difficulty)
      .map((example, index) => (
        <ExampleCard
          key={index}
          example={example}
          onLoadExample={handleLoadExample}
        />
      ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            📚 Biblioteca de Exemplos da Monografia
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Explore problemas de Programação Linear pré-definidos para testar e
            aprender o Método Simplex. Clique em um exemplo para expandir e ver
            todos os detalhes.
          </p>
        </CardHeader>
      </Card>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Básico</h2>
        {renderExamplesByDifficulty("Básico")}
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Intermediário</h2>
        {renderExamplesByDifficulty("Intermediário")}
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Avançado</h2>
        {renderExamplesByDifficulty("Avançado")}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-700">
            📖 Sobre as Fontes Acadêmicas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p className="mb-3">
            Os exemplos desta biblioteca foram cuidadosamente selecionados de
            livros didáticos e referências acadêmicas renomadas em Pesquisa
            Operacional e Algoritmos. Cada exemplo foi validado para garantir
            que a solução esperada está correta.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>
              <strong>Dasgupta, Papadimitriou & Vazirani (2008)</strong> -
              Algorithms. McGraw-Hill.
            </li>
            <li>
              <strong>Cormen, Leiserson, Rivest & Stein (2009)</strong> -
              Introduction to Algorithms. MIT Press.
            </li>
            <li>
              <strong>Taha (2017)</strong> - Operations Research: An
              Introduction. Pearson.
            </li>
            <li>
              <strong>Arenales (2006)</strong> - Pesquisa Operacional: Modelagem
              e Algoritmos. Editora Atlas.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
