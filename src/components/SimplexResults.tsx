import React, { useState } from "react";
import { SimplexResult } from "@/lib/simplexAlgorithm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

interface SimplexResultsProps {
  results: SimplexResult | null;
  error: string | null;
}

export const SimplexResults: React.FC<SimplexResultsProps> = ({ results, error }) => {
  const [currentIterationIndex, setCurrentIterationIndex] = useState(0);

  if (error) {
    return (
      <Card className="border-red-400 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Erro na Resolução</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  const currentIteration = results.iterations[currentIterationIndex];

  const handleNextIteration = () => {
    if (currentIterationIndex < results.iterations.length - 1) {
      setCurrentIterationIndex(prev => prev + 1);
    }
  };

  const handlePrevIteration = () => {
    if (currentIterationIndex > 0) {
      setCurrentIterationIndex(prev => prev - 1);
    }
  };

  const formatNumber = (num: number) => {
    return num.toFixed(4).replace(/\.?0+$/, "");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            {results.status === "optimal" && "✅ Solução Ótima Encontrada"}
            {results.status === "unbounded" && "⚠️ Problema Ilimitado"}
            {results.status === "infeasible" && "❌ Problema Inviável"}
          </CardTitle>
          <p className="text-gray-600">{results.message}</p>
        </CardHeader>
        <CardContent>
          {results.status === "optimal" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Valores das Variáveis:</h3>
              <ul className="list-disc pl-5">
                {Object.entries(results.solution.variables).map(([key, value]) => (
                  <li key={key}>
                    {key}: {formatNumber(value)}
                  </li>
                ))}
              </ul>
              <h3 className="text-xl font-semibold">Valor Ótimo da Função Objetivo (Z):</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(results.solution.objectiveValue)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            Passo a Passo do Método Simplex
          </CardTitle>
          <p className="text-gray-600">
            Iteração {currentIterationIndex + 1} de {results.iterations.length}
          </p>
        </CardHeader>
        <CardContent>
          {currentIteration && (
            <div className="space-y-4">
              <p className="text-lg font-semibold">
                {currentIteration.explanation}
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Base</th>
                      {currentIteration.tableau[0].map((_, colIndex) => (
                        <th key={colIndex} className="border border-gray-300 px-4 py-2 text-left">
                          {colIndex < currentIteration.tableau[0].length - 1
                            ? `x${colIndex + 1}`
                            : "RHS"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentIteration.tableau.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex === 0 ? "bg-blue-50 font-bold" : ""}>
                        <td className="border border-gray-300 px-4 py-2">
                          {currentIteration.basicVariables[rowIndex]}
                        </td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                            {formatNumber(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4">
                <Button onClick={handlePrevIteration} disabled={currentIterationIndex === 0}>
                  Anterior
                </Button>
                <Button onClick={handleNextIteration} disabled={currentIterationIndex === results.iterations.length - 1}>
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

