# Simplex Resolver

## 🚀 Visão Geral do Projeto

O **Simplex Resolver** é uma aplicação web interativa desenvolvida para auxiliar no estudo e na compreensão do **Método Simplex**, um algoritmo fundamental da Pesquisa Operacional para resolver problemas de Programação Linear (PL).

A aplicação permite que o usuário insira problemas de PL com diferentes tipos de restrições (menor ou igual, maior ou igual, e igualdade) e visualize o processo de solução passo a passo, incluindo a aplicação das Fases I e II do Simplex.

### Funcionalidades Principais

*   **Resolução de PL:** Soluciona problemas de maximização e minimização.
*   **Visualização Passo a Passo:** Apresenta cada iteração do tableau Simplex, facilitando o acompanhamento da lógica do algoritmo.
*   **Biblioteca de Exemplos:** Contém problemas validados de fontes acadêmicas renomadas, como Taha e Dasgupta, para testes e aprendizado.

## ⚙️ Como Funciona

A aplicação é dividida em duas partes principais: a interface do usuário (Frontend) e o algoritmo de resolução (Backend Lógico).

### 1. Interface do Usuário (Frontend)

Construída com **React** e **TypeScript**, a interface permite a fácil entrada dos dados do problema (função objetivo e restrições).

### 2. Algoritmo Simplex (Backend Lógico)

O coração da aplicação é o algoritmo Simplex, implementado em **TypeScript**. Ele é responsável por:

*   **Conversão para Forma Padrão:** Transforma o problema de PL na forma padrão exigida pelo Simplex.
*   **Fase I (Variáveis Artificiais):** Utiliza o método das duas fases para eliminar variáveis artificiais e encontrar uma solução básica viável inicial.
*   **Fase II (Otimização):** Aplica as iterações do Simplex para encontrar a solução ótima, se existir.
*   **Detecção de Casos Especiais:** Identifica e sinaliza problemas inviáveis (sem solução) e ilimitados (solução infinita).

## 📁 Estrutura de Arquivos Chave

Para quem deseja entender ou modificar o projeto, os seguintes arquivos são os mais importantes:

| Arquivo | Localização | Descrição |
| :--- | :--- | :--- |
| `simplexAlgorithm.ts` | `src/lib/` | Contém toda a lógica de negócio do algoritmo Simplex, incluindo as Fases I e II, o pivoteamento e a detecção de casos especiais. |
| `ExampleLibrary.tsx` | `src/components/` | Componente React que exibe a biblioteca de exemplos. Contém a estrutura de cards expandíveis e a lógica para carregar os problemas na interface. |
| `ProblemInput.tsx` | `src/components/` | Componente React responsável por capturar a entrada de dados do usuário (função objetivo e restrições). |

## 🛠️ Instalação e Execução

Para rodar o projeto localmente, siga os passos básicos de um projeto React/TypeScript:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd simplex-resolver
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou yarn install / pnpm install
    ```
3.  **Inicie a aplicação:**
    ```bash
    npm run dev # ou yarn dev / pnpm dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou porta similar, no console você conseguirá saber a porta correta).

## 📝 Contribuição

Sinta-se à vontade para abrir *issues* ou enviar *pull requests* para melhorias, correções de bugs ou adição de novos exemplos validados.
