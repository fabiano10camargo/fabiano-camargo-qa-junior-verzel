# Automação Verzel Store

Suíte de testes de API e interface da Verzel Store desenvolvida com Playwright Test e TypeScript. Este documento explica como preparar o ambiente, executar cada grupo de testes e localizar todas as entregas e evidências.

## Onde encontrar cada entrega

| Entrega | Local |
| --- | --- |
| Cenários levantados e rastreabilidade | [`docs/test-scenarios.md`](docs/test-scenarios.md) |
| Cenários de interface em Gherkin | [`docs/cenarios/store-ui.feature`](docs/cenarios/store-ui.feature) |
| Cenários de API em Gherkin | [`docs/cenarios/store-api.feature`](docs/cenarios/store-api.feature) |
| Resultado da execução automatizada, manual e exploratória | [`docs/test-execution.md`](docs/test-execution.md) |
| Relatório completo dos bugs | [`docs/bug-report.md`](docs/bug-report.md) |
| Documento e índice das evidências | [`docs/test-evidence.md`](docs/test-evidence.md) |
| Evidências preservadas da execução atual | [`docs/evidencias/2026-10-09/`](docs/evidencias/2026-10-09/) |
| Testes automatizados de API | [`tests/api/`](tests/api/) |
| Testes automatizados de interface (E2E) | [`tests/e2e/`](tests/e2e/) |
| Page Objects | [`tests/pages/`](tests/pages/) |
| Component Objects reutilizáveis | [`tests/components/`](tests/components/) |
| Cliente HTTP da aplicação | [`tests/clients/store-api.ts`](tests/clients/store-api.ts) |
| Fixtures e injeção de dependências | [`tests/fixtures/store.fixture.ts`](tests/fixtures/store.fixture.ts) |
| Builders de payloads | [`tests/builders/`](tests/builders/) |
| Massas de teste | [`tests/data/`](tests/data/) |
| Tipos e contratos TypeScript | [`tests/types/store.ts`](tests/types/store.ts) |
| Configuração do Playwright | [`playwright.config.ts`](playwright.config.ts) |
| Pipeline de integração contínua | [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) |
| Scripts e dependências | [`package.json`](package.json) |
| Coletor da sessão exploratória | [`scripts/exploratory-session.cjs`](scripts/exploratory-session.cjs) |
| Resumo inicial dos achados | [`docs/test-findings.md`](docs/test-findings.md) |
| Relatório HTML gerado | `playwright-report/index.html` |
| Screenshots, vídeos e traces de falhas | `test-results/` |

## Arquitetura

```text
tests/
├── api/          # Testes diretos dos endpoints
├── e2e/          # Jornadas pela interface
├── pages/        # Page Objects pequenos
├── components/   # Component Objects reutilizáveis
├── clients/      # Clientes HTTP da aplicação
├── fixtures/     # Injeção tipada das dependências
├── builders/     # Construção de payloads
├── data/         # Massa de teste estável
└── types/        # Contratos TypeScript
```

Princípios usados:

- Page Objects contêm apenas ações e seletores da página.
- Componentes compartilhados, como cupom e resumo, têm objetos próprios.
- A API é acessada por `StoreApi`, nunca por um Page Object.
- As asserções de negócio permanecem nas specs.
- Cada teste recebe contexto e dados isolados.

### Por que utilizar uma arquitetura em camadas

A separação em camadas evita que seletores, chamadas HTTP, dados e regras de verificação fiquem misturados dentro dos arquivos de teste. Cada camada possui uma responsabilidade bem definida, tornando a suíte mais simples de entender, manter e expandir.

Quando a interface ou um endpoint muda, a correção tende a ficar concentrada em um único objeto, sem exigir alterações em todas as specs que utilizam aquele recurso. As specs permanecem focadas no comportamento esperado do produto e funcionam como uma descrição legível dos cenários de negócio.

#### Page Object Model (POM) para a interface

Os Page Objects em `tests/pages/` representam páginas ou jornadas da aplicação, como catálogo, carrinho e checkout. Eles encapsulam os seletores e as ações executadas pelo usuário, por exemplo, abrir uma página, adicionar um produto ou preencher os dados do cliente.

Essa abordagem foi escolhida porque:

- centraliza os seletores da interface;
- evita repetir passos de navegação nas specs;
- reduz o impacto de mudanças no HTML;
- deixa os testes focados no cenário e no resultado esperado;
- cria uma linguagem de alto nível para representar as ações do usuário.

Os Page Objects não contêm asserções de negócio. As validações permanecem nas specs para que o resultado esperado de cada cenário continue explícito.

#### Component Objects para elementos reutilizáveis

Os Component Objects em `tests/components/` representam partes da interface que possuem comportamento próprio ou aparecem em mais de uma página, como o cabeçalho, o formulário de cupom, o controle de quantidade e o resumo do pedido.

Separar esses componentes impede que um Page Object se transforme em uma classe grande e com muitas responsabilidades. Também permite reutilizar a mesma implementação sempre que o componente aparecer em outra jornada. Se o seletor ou o comportamento de um componente mudar, a manutenção fica concentrada no respectivo Component Object.

#### API Clients para os endpoints

O cliente em `tests/clients/store-api.ts` centraliza o acesso aos endpoints da aplicação. Ele encapsula URLs, métodos HTTP, envio de payloads e tipagem das respostas, oferecendo operações de domínio para as specs de API.

Essa separação foi adotada porque:

- evita duplicar detalhes de requisição em cada teste;
- mantém contratos e chamadas HTTP consistentes;
- concentra mudanças de rota ou estrutura de requisição;
- facilita a reutilização da API para preparar ou limpar cenários E2E;
- mantém Page Objects independentes da camada de serviço.

Em resumo, as specs descrevem **o que** deve acontecer, enquanto Page Objects, Component Objects e API Clients implementam **como** interagir com cada camada do sistema.

## Pré-requisitos

- Node.js 20 ou superior.
- npm 10 ou superior recomendado.
- Google Chrome instalado para executar o projeto `e2e-chrome`.

O projeto usa uma versão atual do Playwright e, por isso, requer uma versão do Node.js ainda suportada pelo framework.

## Instalação

Abra um terminal na raiz do projeto e execute:

```bash
npm ci
npx playwright install chromium
```

O Chromium é instalado e gerenciado pelo Playwright. O projeto `e2e-chrome` usa o canal estável do Google Chrome já instalado no sistema. Caso queira executar apenas o navegador fornecido pelo Playwright, use `npm run test:e2e`.

No PowerShell, caso a execução de `npm.ps1` ou `npx.ps1` esteja bloqueada pela política do Windows, use os executáveis `.cmd` sem alterar a política de segurança:

```powershell
cd C:\Users\fabia\Desktop\Automacao
npm.cmd ci
npx.cmd playwright install chromium
```

## Execução

```powershell
# Toda a suíte
npm.cmd test

# Toda a suíte com uma janela/processo de teste por vez
npm.cmd test -- --workers=1

# Somente API
npm.cmd run test:api

# Somente interface
npm.cmd run test:e2e

# Somente interface no Google Chrome instalado
npm.cmd run test:chrome

# Smoke de API e interface
npm.cmd run test:smoke

# Regressão sem os cenários de bugs conhecidos
npm.cmd run test:regression

# Somente cenários que monitoram bugs conhecidos
npm.cmd run test:bugs

# Sessão exploratória assistida e coleta de evidências
npm.cmd run test:exploratory

# Interface com Chromium visível
npm.cmd run test:headed

# Interface com Google Chrome visível
npm.cmd run test:chrome:headed

# Modo interativo do Playwright
npm.cmd run test -- --ui

# Modo de depuração
npm.cmd run test:debug

# TypeScript, ESLint, formatação e links da documentação
npm.cmd run check
```

O comando `test:e2e` usa o Chromium fornecido pelo Playwright. O comando `test:chrome` usa o Google Chrome instalado na máquina por meio do canal `chrome`. Os dois navegadores estão configurados explicitamente no `playwright.config.ts`. A opção `--workers=1` evita a abertura simultânea de várias janelas durante a execução visível.

Para apontar para outro ambiente no PowerShell:

```powershell
$env:BASE_URL = 'https://outro-ambiente.exemplo'
npm.cmd test
```

No Bash:

```bash
BASE_URL=https://outro-ambiente.exemplo npm test
```

## Relatório

```powershell
npm.cmd run report
```

O comando abre o relatório HTML gerado em `playwright-report/index.html`.

Em caso de falha inesperada, o Playwright grava as evidências em `test-results/`:

- `test-failed-*.png`: screenshot no momento da falha;
- `video.webm`: gravação da execução;
- `trace.zip`: trace retido para a falha;
- `error-context.md`: contexto da página no momento do erro.

## Uso do Codex

O Codex foi utilizado como ferramenta de apoio durante a preparação desta entrega. Seu uso envolveu a leitura dos requisitos disponíveis, a organização dos cenários de teste, a implementação da automação e a consolidação dos resultados encontrados.

As principais contribuições foram:

- transformar regras de negócio e critérios de aceite em cenários rastreáveis de UI e API;
- estruturar os cenários em Gherkin e relacioná-los aos respectivos critérios;
- implementar os testes com Playwright e TypeScript;
- organizar a suíte em Page Objects, Component Objects, API Client, fixtures, builders, massas e tipos;
- executar verificações automatizadas e auxiliar na comparação entre resultados esperados e obtidos;
- coletar e organizar screenshots, vídeos, respostas da API e contextos de falha;
- documentar os resultados das execuções e os bugs reproduzidos;
- revisar comandos, caminhos, links, contagens e consistência entre código, relatórios e evidências.

O uso do Codex não foi considerado evidência suficiente por si só. As conclusões registradas neste projeto foram sustentadas pela execução dos testes, pelos retornos reais da aplicação e pelos arquivos preservados em `docs/evidencias/`. Os cenários marcados com `test.fail()` continuam executando as asserções dos comportamentos divergentes e permanecem documentados como bugs do produto.

O código e os documentos gerados também foram submetidos a verificações técnicas, incluindo compilação TypeScript, descoberta dos testes pelo Playwright, validação dos links Markdown e revisão das quantidades apresentadas nos relatórios.

## Resultado da revisão

A execução revisada confirmou dois comportamentos divergentes dos critérios de aceite. Eles estão identificados pelas tags `@bug-BUG-001` e `@bug-BUG-002` e configurados como falhas esperadas. Assim, o pipeline permanece útil enquanto os defeitos estão abertos: uma falha esperada confirma o estado conhecido, e uma aprovação inesperada sinaliza que o comportamento mudou e que o teste e a documentação devem ser revisados.

Na execução de 09/10/2026, o runner concluiu as 42 execuções: 36 passaram normalmente e 6 confirmaram falhas esperadas, sem falhas inesperadas.

Consulte:

- [`docs/test-execution.md`](docs/test-execution.md) para o resultado de cada cenário;
- [`docs/bug-report.md`](docs/bug-report.md) para os passos, impactos e respostas obtidas;
- [`docs/test-evidence.md`](docs/test-evidence.md) para screenshots, vídeos e contextos das falhas.
