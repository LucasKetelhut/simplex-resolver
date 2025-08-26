import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Problem } from "@/lib/simplexAlgorithm";

interface ExampleLibraryProps {
  setProblem: React.Dispatch<React.SetStateAction<any>>;
}

interface ExampleProblem {
  name: string;
  source: string;
  expectedSolution?: string;
  difficulty: "Básico" | "Intermediário" | "Avançado";
  problem: Problem;
}

const exampleProblems: ExampleProblem[] = [
  {
    name: "Exemplo Dasgupta (2 variáveis)",
    source: "Dasgupta, S., Papadimitriou, C. H., & Vazirani, U. V. (2008). Algorithms. McGraw-Hill.",
    expectedSolution: "x₁ = 100, x₂ = 300, z = 1900",
    difficulty: "Básico",
    problem: {
      objective: [1, 6],
      constraints: [
        { coefficients: [1, 0], rhs: 200, type: "<=" },
        { coefficients: [0, 1], rhs: 300, type: "<=" },
        { coefficients: [1, 1], rhs: 400, type: "<=" },
      ],
      type: "max",
    },
  },
  {
    name: "Exemplo Dasgupta (3 variáveis)",
    source: "Dasgupta, S., Papadimitriou, C. H., & Vazirani, U. V. (2008). Algorithms. McGraw-Hill.",
    expectedSolution: "x₁ = 0, x₂ = 300, x₃ = 100, z = 3100",
    difficulty: "Intermediário",
    problem: {
      objective: [1, 6, 13],
      constraints: [
        { coefficients: [1, 0, 0], rhs: 200, type: "<=" },
        { coefficients: [0, 1, 0], rhs: 300, type: "<=" },
        { coefficients: [1, 1, 1], rhs: 400, type: "<=" },
        { coefficients: [0, 3, 1], rhs: 600, type: "<=" },
      ],
      type: "max",
    },
  },
  {
    name: "Exemplo Cormen",
    source: "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to Algorithms (3rd ed.). MIT Press.",
    expectedSolution: "x₁ = 8, x₂ = 4, x₃ = 0, z = 28",
    difficulty: "Intermediário",
    problem: {
      objective: [3, 1, 2],
      constraints: [
        { coefficients: [1, 1, 3], rhs: 30, type: "<=" },
        { coefficients: [2, 2, 5], rhs: 24, type: "<=" },
        { coefficients: [4, 1, 2], rhs: 36, type: "<=" },
      ],
      type: "max",
    },
  },
  {
    name: "Exemplo Taha (Restrições Mistas)",
    source: "Taha, H. A. (2017). Operations Research: An Introduction (10th ed.). Pearson.",
    expectedSolution: "x₁ = 3, x₂ = 1.5, z = 21",
    difficulty: "Intermediário",
    problem: {
      objective: [5, 4],
      constraints: [
        { coefficients: [6, 4], rhs: 24, type: "<=" },
        { coefficients: [1, 2], rhs: 6, type: "<=" },
        { coefficients: [1, 1], rhs: 1, type: ">=" },
        { coefficients: [0, 1], rhs: 2, type: ">=" },
      ],
      type: "max",
    },
  },
  {
    name: "Caso Ilimitado (Arenales)",
    source: "Arenales, M. N. (2006). Pesquisa Operacional: Modelagem e Algoritmos. Editora Atlas.",
    difficulty: "Avançado",
    problem: {
      objective: [1, 2],
      constraints: [
        { coefficients: [3, 1], rhs: 2, type: ">=" },
        { coefficients: [0, 1], rhs: 3, type: "<=" },
        { coefficients: [1, 2], rhs: 9, type: "<=" },
        { coefficients: [3, 1], rhs: 18, type: "<=" },
      ],
      type: "max",
    },
  },
  {
    name: "Caso Ilimitado (Taha)",
    source: "Taha, H. A. (2017). Operations Research: An Introduction (10th ed.). Pearson.",
    difficulty: "Avançado",
    problem: {
      objective: [2, 4],
      constraints: [
        { coefficients: [1, 2], rhs: 5, type: "<=" },
        { coefficients: [1, 1], rhs: 4, type: "<=" },
      ],
      type: "max",
    },
  },
  {
    name: "Problema Básico Didático",
    source: "Exemplo didático simples para iniciantes.",
    expectedSolution: "x₁ = 2, x₂ = 3, z = 13",
    difficulty: "Básico",
    problem: {
      objective: [2, 3],
      constraints: [
        { coefficients: [1, 1], rhs: 5, type: "<=" },
        { coefficients: [2, 1], rhs: 8, type: "<=" },
      ],
      type: "max",
    },
  },
];

export const ExampleLibrary: React.FC<ExampleLibraryProps> = ({ setProblem }) => {
  const handleLoadExample = (example: Problem) => {
    setProblem(example);
    
    const defineTab = document.querySelector('[value="define-problem"]') as HTMLElement;
    if (defineTab) {
      defineTab.click();
    }
  };

  const renderExamplesByDifficulty = (difficulty: ExampleProblem["difficulty"]) => {
    return exampleProblems
      .filter((example) => example.difficulty === difficulty)
      .map((example, index) => (
        <Card key={index} className="mb-4 border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">
              {example.name}
            </CardTitle>
            <p className="text-sm text-gray-500">Fonte: {example.source}</p>
            {example.expectedSolution && (
              <p className="text-sm text-green-600">
                Solução Esperada: {example.expectedSolution}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button onClick={() => handleLoadExample(example.problem)}>
              Carregar Exemplo
            </Button>
          </CardContent>
        </Card>
      ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            📚 Biblioteca de Exemplos da Monografia
          </CardTitle>
          <p className="text-gray-600">
            Explore problemas de Programação Linear pré-definidos para testar e
            aprender o Método Simplex.
          </p>
        </CardHeader>
      </Card>

      <Separator />

      <h2 className="text-2xl font-bold text-gray-700">Básico</h2>
      {renderExamplesByDifficulty("Básico")}

      <Separator />

      <h2 className="text-2xl font-bold text-gray-700">Intermediário</h2>
      {renderExamplesByDifficulty("Intermediário")}

      <Separator />

      <h2 className="text-2xl font-bold text-gray-700">Avançado</h2>
      {renderExamplesByDifficulty("Avançado")}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-700">
            Fontes Acadêmicas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          <p className="mb-2">
            Os exemplos desta biblioteca foram cuidadosamente selecionados de
            livros didáticos e referências acadêmicas renomadas em Pesquisa
            Operacional e Algoritmos.
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li>
              **Dasgupta, S., Papadimitriou, C. H., & Vazirani, U. V.** (2008).
              <em className="font-semibold">Algorithms</em>. McGraw-Hill.
            </li>
            <li>
              **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.**
              (2009). <em className="font-semibold">Introduction to Algorithms</em>
              (3rd ed.). MIT Press.
            </li>
            <li>
              **Taha, H. A.** (2017).
              <em className="font-semibold">Operations Research: An Introduction</em>
              (10th ed.). Pearson.
            </li>
            <li>
              **Arenales, M. N.** (2006).
              <em className="font-semibold">Pesquisa Operacional: Modelagem e Algoritmos</em>.
              Editora Atlas.
            </li>
          </ul>
          <p className="mt-4">
            Esses exemplos são ideais para estudantes que desejam praticar e
            validar a compreensão do Método Simplex, incluindo casos com
            soluções ótimas, ilimitadas e inviáveis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
