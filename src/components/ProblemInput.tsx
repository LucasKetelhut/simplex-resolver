import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface ProblemInputProps {
  problem: {
    objective: number[];
    constraints: {
      coefficients: number[];
      rhs: number;
      type: "<=" | ">=" | "=";
    }[];
    type: "max" | "min";
  };
  setProblem: React.Dispatch<React.SetStateAction<any>>;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ problem, setProblem }) => {
  const [numVariables, setNumVariables] = useState(problem.objective.length || 2);
  const [numConstraints, setNumConstraints] = useState(problem.constraints.length || 2);

  useEffect(() => {
    setNumVariables(problem.objective.length || 2);
    setNumConstraints(problem.constraints.length || 2);
  }, [problem]);

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjective = [...problem.objective];
    newObjective[index] = parseFloat(value) || 0;
    setProblem(prev => ({ ...prev, objective: newObjective }));

  };

  const handleConstraintCoeffChange = (cIndex: number, vIndex: number, value: string) => {
    const newConstraints = [...problem.constraints];
    newConstraints[cIndex].coefficients[vIndex] = parseFloat(value) || 0;
    setProblem(prev => ({ ...prev, constraints: newConstraints }));

  };

  const handleConstraintRHSChange = (cIndex: number, value: string) => {
    const newConstraints = [...problem.constraints];
    newConstraints[cIndex].rhs = parseFloat(value) || 0;
    setProblem(prev => ({ ...prev, constraints: newConstraints }));

  };

  const handleConstraintTypeChange = (cIndex: number, type: "<=" | ">=" | "=") => {
    const newConstraints = [...problem.constraints];
    newConstraints[cIndex].type = type;
    setProblem(prev => ({ ...prev, constraints: newConstraints }));

  };

  const handleProblemTypeChange = (type: "max" | "min") => {
    setProblem(prev => ({ ...prev, type }));

  };

  return (
    <div className="space-y-6">
      {/* tipo do problema */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-xl font-semibold">Tipo de Problema</h3>
        <RadioGroup
          defaultValue={problem.type}
          onValueChange={handleProblemTypeChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="max" id="max" />
            <Label htmlFor="max">Maximizar</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="min" id="min" />
            <Label htmlFor="min">Minimizar</Label>
          </div>
        </RadioGroup>
      </div>

      {/* número de variáveis e restrições */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-xl font-semibold">Dimensões do Problema</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="numVariables" className="mb-1 block">Número de Variáveis (x)</Label>
            <Input
              id="numVariables"
              type="number"
              min="1"
              value={numVariables}
              onChange={(e) => {
                const newNumVariables = parseInt(e.target.value) || 1;
                setNumVariables(newNumVariables);
                setProblem(prev => ({
                  ...prev,
                  objective: Array.from({ length: newNumVariables }, (_, i) => prev.objective[i] || 0),
                  constraints: prev.constraints.map(c => ({
                    ...c,
                    coefficients: Array.from({ length: newNumVariables }, (_, i) => c.coefficients[i] || 0)
                  }))
                }));
              }}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="numConstraints" className="mb-1 block">Número de Restrições</Label>
            <Input
              id="numConstraints"
              type="number"
              min="1"
              value={numConstraints}
              onChange={(e) => {
                const newNumConstraints = parseInt(e.target.value) || 1;
                setNumConstraints(newNumConstraints);
                setProblem(prev => ({
                  ...prev,
                  constraints: Array.from({ length: newNumConstraints }, (_, i) => ({
                    coefficients: Array.from({ length: prev.objective.length }, () => 0),
                    rhs: 0,
                    type: "<=",
                    ...(prev.constraints[i] || {})
                  }))
                }));
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* função objetivo */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-xl font-semibold">Função Objetivo (Z)</h3>
        <div className="flex items-center">
          <span className="mr-2 text-lg font-bold">Z =</span>
          {Array.from({ length: numVariables }).map((_, vIndex) => (
            <React.Fragment key={vIndex}>
              <Input
                type="number"
                value={problem.objective[vIndex] || 0}
                onChange={(e) => handleObjectiveChange(vIndex, e.target.value)}
                className="w-20 text-center"
              />
              <span className="mx-1">x{vIndex + 1}</span>
              {vIndex < numVariables - 1 && <span className="mr-2 text-lg">+</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* restrições */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-xl font-semibold">Restrições</h3>
        {Array.from({ length: numConstraints }).map((_, cIndex) => (
          <div key={cIndex} className="mb-4 flex items-center space-x-2">
            {Array.from({ length: numVariables }).map((_, vIndex) => (
              <React.Fragment key={vIndex}>
                <Input
                  type="number"
                  value={problem.constraints[cIndex]?.coefficients[vIndex] || 0}
                  onChange={(e) =>
                    handleConstraintCoeffChange(cIndex, vIndex, e.target.value)
                  }
                  className="w-20 text-center"
                />
                <span className="mx-1">x{vIndex + 1}</span>
                {vIndex < numVariables - 1 && <span className="mr-2 text-lg">+</span>}
              </React.Fragment>
            ))}
            <select
              value={problem.constraints[cIndex]?.type || "<="}
              onChange={(e) =>
                handleConstraintTypeChange(cIndex, e.target.value as "<=" | ">=" | "=")
              }
              className="rounded-md border p-2"
            >
              <option value="<=">{'<='}</option>
              <option value=">=">{'>='}</option>
              <option value="=">{'='}</option>
            </select>
            <Input
              type="number"
              value={problem.constraints[cIndex]?.rhs || 0}
              onChange={(e) => handleConstraintRHSChange(cIndex, e.target.value)}
              className="w-20 text-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
