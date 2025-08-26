import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export const Tutorial: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            O que é o Método Simplex?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            O Método Simplex é um algoritmo para resolver problemas de programação
            linear, encontrando a solução ótima através de iterações
            sistemáticas pelos vértices da região viável.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            Como Usar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Defina se quer maximizar ou minimizar a função objetivo.</li>
            <li>Configure os coeficientes da função objetivo (Z).</li>
            <li>Adicione as restrições do problema, especificando os coeficientes, o tipo de desigualdade (&lt;=, &gt;=, &#x3D;) e o valor do lado direito (RHS).</li>
            <li>Clique em "Resolver com Simplex" para ver o passo a passo da solução.</li>
          </ol>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-700">
            Recursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Visualização passo a passo das tabelas Simplex.</li>
            <li>Explicações detalhadas de cada operação de pivô.</li>
            <li>Detecção automática de problemas ilimitados e inviáveis.</li>
            <li>Interface intuitiva e didática, ideal para estudantes.</li>
            <li>Biblioteca de exemplos para testar e aprender.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

