# Execução dos testes

## Identificação

| Campo | Valor |
| --- | --- |
| Execução | EXE-2026-10-09-04 |
| Data | 09/10/2026 |
| Ambiente | `https://verzel-store.qa-test-verzel-store.workers.dev` |
| História validada | VZS-142, versão 2.3.0 |
| Node.js | 24.20.0 |
| Playwright | 1.64.0 |
| Navegadores | Chromium fornecido pelo Playwright e Google Chrome instalado |

## Resumo executivo

| Tipo | Execuções | Sucesso normal | Falha esperada | Falha inesperada |
| --- | ---: | ---: | ---: | ---: |
| API automatizada | 16 | 14 | 2 | 0 |
| E2E no Chromium | 13 | 11 | 2 | 0 |
| E2E no Google Chrome | 13 | 11 | 2 | 0 |
| **Total automatizado** | **42** | **36** | **6** | **0** |

Na sessão manual/exploratória assistida, 7 das 8 observações atenderam ao esperado e 1 reproduziu o BUG-001.

As 42 execuções representam 29 cenários únicos: os 13 cenários E2E foram executados uma vez no Chromium e outra no Google Chrome. As seis falhas esperadas correspondem a dois bugs, porque o problema de frete foi detectado na API e em dois cenários executados nos dois navegadores. O Playwright encerrou com código 0 e informou `42 passed`, pois `test.fail()` classifica corretamente os desvios já conhecidos sem deixar de executar suas asserções.

## Execução automatizada

Comando utilizado, limitado a um worker para evitar várias janelas simultâneas:

```powershell
npm.cmd test -- --workers=1
```

### Resultado de cada cenário de API

| ID | Cenário | Resultado | Observação |
| --- | --- | --- | --- |
| API-04 (abaixo) | Calcular frete abaixo do limite | Passou | Frete R$ 19,90 e faltante R$ 0,20 |
| API-04 (limite) | Calcular frete exatamente no limite | **Falha esperada** | Retornou frete R$ 19,90; BUG-001 |
| API-04 (acima) | Calcular frete acima do limite | Passou | Frete grátis |
| API-05 | Aplicar cupom ignorando caixa e espaços | Passou | Desconto de R$ 21,98 |
| API-06 | Informar cupom inválido | Passou | Sem desconto e mensagem correta |
| API-07 | Informar cupom expirado | Passou | Sem desconto e mensagem correta |
| API-08 | Rejeitar quantidade maior que cinco | **Falha esperada** | Retornou 200 em vez de 422; BUG-002 |
| API-09 | Rejeitar produto duplicado | Passou | Erro `ITEM_DUPLICADO` |
| API-10 | Criar pedido válido | Passou | Status 201 e número `VZ-000000` |
| API-11 | Rejeitar dados inválidos do cliente | Passou | Erro `DADOS_INVALIDOS` |
| API-12 | Rejeitar cupom inexistente no pedido | Passou | Erro `CUPOM_INVALIDO` |
| API-13 | Rejeitar cupom expirado no pedido | Passou | Erro `CUPOM_EXPIRADO` |
| API-14 | Rejeitar pedido sem itens | Passou | Erro `ITENS_OBRIGATORIOS` |
| API-01 | Listar o catálogo | Passou | Os oito produtos e seus dados foram validados |
| API-02 | Consultar produto por id | Passou | Produto e preço corretos |
| API-03 | Consultar produto inexistente | Passou | Status 404 e erro correto |

### Resultado de cada cenário E2E

Cada linha abaixo foi executada no Chromium e no Google Chrome.

| ID | Cenário | Chromium | Chrome | Observação |
| --- | --- | --- | --- | --- |
| UI-01 | Exibir os oito produtos e adicionar ao carrinho | Passou | Passou | Catálogo completo e contador atualizados |
| UI-02 | Conceder frete grátis em R$ 200,00 | **Falha esperada** | **Falha esperada** | Frete R$ 19,90; BUG-001 |
| UI-03 | Cobrar frete abaixo do limite e informar o valor faltante | Passou | Passou | Frete R$ 19,90, faltante R$ 0,20 e total R$ 219,70 |
| UI-04 | Aplicar cupom ignorando caixa e espaços | Passou | Passou | Total R$ 197,82 |
| UI-05 | Informar cupom inexistente sem aplicar desconto | Passou | Passou | Mensagem de cupom inválido e desconto R$ 0,00 |
| UI-06 | Exibir mensagem para cupom expirado | Passou | Passou | Desconto R$ 0,00 |
| UI-07 | Remover o cupom atual antes de aplicar outro | Passou | Passou | Cupom removido e cupom expirado aplicado sem desconto |
| UI-08 | Limitar a quantidade a cinco | Passou | Passou | Botão de aumentar desabilitado |
| UI-09 | Validar campos obrigatórios | Passou | Passou | Três mensagens exatas exibidas |
| UI-10 | Validar formatos dos dados do cliente | Passou | Passou | Nome, e-mail e CEP validados |
| UI-11 | Finalizar compra com cupom | Passou | Passou | Valores do carrinho validados também na confirmação |
| UI-12 | Preservar frete grátis em R$ 200,00 após aplicar cupom | **Falha esperada** | **Falha esperada** | Frete R$ 19,90 e total R$ 199,90 no carrinho e na confirmação; BUG-001 |
| UI-13 | Conceder frete grátis acima do limite | Passou | Passou | Frete grátis e total R$ 219,80 |

## Execução manual dirigida e exploratória

A sessão de 09/10/2026 foi executada fora do runner do Playwright Test, seguindo fluxos de usuário em um navegador isolado e coletando os textos efetivamente exibidos. Como a sessão disponível não ofereceu controle direto de uma janela interativa, a navegação foi assistida por um controlador headless; por isso os resultados abaixo são identificados como **manual/exploratório assistido**, e não como regressão automatizada.

Comando de reprodução:

```powershell
node .\scripts\exploratory-session.cjs
```

| ID | Tipo | Exploração | Resultado | Observado |
| --- | --- | --- | --- | --- |
| EXP-01 | Manual dirigido | Catálogo e persistência na mesma aba | Passou | 8 produtos; carrinho permaneceu com 2 itens após recarregar |
| EXP-02 | Limite/exploratório | Subtotal exatamente em R$ 200,00 | **Falhou** | Frete R$ 19,90, total R$ 219,90 e mensagem “Faltam R$ 0,00” |
| EXP-03 | Manual dirigido | Aumentar produto até 5 unidades | Passou | Quantidade 5; botão de aumentar desabilitado |
| EXP-04 | Manual dirigido | Cupom com minúsculas e espaços | Passou | Desconto R$ 21,98 e total R$ 197,82 |
| EXP-05 | Exploratório | Remover cupom válido e aplicar expirado | Passou | Cupom anterior removido; expirado sem desconto |
| EXP-06 | Manual dirigido | Confirmar checkout vazio | Passou | Mensagens para nome, e-mail e CEP |
| EXP-07 | Manual dirigido | Informar formatos inválidos | Passou | Mensagens específicas para os três campos |
| EXP-08 | Exploratório | Abrir carrinho em nova sessão | Passou | Carrinho vazio, conforme comportamento documentado |

O resultado bruto da sessão está em [`evidencias/2026-10-09/exploratory/session-results.json`](evidencias/2026-10-09/exploratory/session-results.json).

## Conclusão

A entrega está funcional nos fluxos principais, mas não deve ser aprovada sem ressalvas enquanto os bugs BUG-001 e BUG-002 permanecerem abertos. O BUG-001 afeta diretamente o valor cobrado do cliente, e o BUG-002 permite contornar pela API uma restrição aplicada corretamente na interface.
