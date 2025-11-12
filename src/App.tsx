import { useState, useEffect } from "react";
import { ProblemInput } from "./components/ProblemInput";
import { SimplexResults } from "./components/SimplexResults";
import { Tutorial } from "./components/Tutorial";
import { ExampleLibrary } from "./components/ExampleLibrary";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { useSimplexSolver } from "./hooks/useSimplexSolver";
import { Problem } from "./lib/simplexAlgorithm";

function App() {
  const [problem, setProblem] = useState<Problem>({
    objective: [],
    constraints: [],
    type: "max",
  });
  const [activeTab, setActiveTab] = useState("how-to-use");
  const [showResults, setShowResults] = useState(false);
  const { solveSimplex, results, error, loading } = useSimplexSolver();

  useEffect(() => {}, []);

  const handleSolve = () => {
    solveSimplex(problem);
    setShowResults(true);
  };

  const handleReset = () => {
    setProblem({
      objective: [],
      constraints: [],
      type: "max",
    });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans text-gray-800">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-5xl font-extrabold text-blue-800 drop-shadow-md">
          Simplex Resolver
        </h1>
        <p className="text-xl text-blue-600">
          Ferramenta educacional para resolver problemas de Programação Linear
          usando o Método Simplex
        </p>
      </header>

      <main className="mx-auto max-w-6xl rounded-lg bg-white p-8 shadow-xl">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="how-to-use">Como Usar</TabsTrigger>
            <TabsTrigger value="define-problem">Definir Problema</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
          </TabsList>

          <TabsContent value="how-to-use" className="mt-6">
            <Tutorial />
          </TabsContent>

          <TabsContent value="define-problem" className="mt-6">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-700">
                  📊 Definir Problema de Programação Linear
                </CardTitle>
                <p className="text-gray-600">
                  Configure sua função objetivo e restrições para resolver
                  usando o Método Simplex
                </p>
              </CardHeader>
              <CardContent>
                <ProblemInput problem={problem} setProblem={setProblem} />
                <div className="mt-6 flex justify-end space-x-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 py-3 text-lg"
                  >
                    Limpar
                  </Button>
                  <Button
                    onClick={handleSolve}
                    className="bg-blue-600 px-6 py-3 text-lg text-white hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Resolvendo..." : "Resolver com Simplex"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showResults && (
              <div className="mt-8">
                <Separator className="mb-8" />
                <SimplexResults results={results} error={error} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="examples" className="mt-6">
            <ExampleLibrary
              setProblem={setProblem}
              onExampleLoaded={() => setActiveTab("define-problem")}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="mt-8 text-center text-gray-600">
        <p>
          Desenvolvido para fins educacionais • Método Simplex • Programação
          Linear
        </p>
      </footer>
    </div>
  );
}

export default App;
