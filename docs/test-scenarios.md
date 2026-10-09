# Cenários de teste

## Fonte e escopo

Os cenários foram levantados a partir da documentação da história **VZS-142 — Cupom de desconto e frete grátis**, versão **2.3.0**, publicada em 30/09/2026, e das regras preexistentes de catálogo e checkout.

Ambiente documentado: `https://verzel-store.qa-test-verzel-store.workers.dev`

Estão no escopo:

- catálogo e carrinho;
- cupons válido, inválido e expirado;
- limites e cálculo do frete;
- limite de quantidade por produto;
- validações e conclusão do checkout;
- contratos de produtos, cálculo do carrinho e pedidos na API.

Estão fora do escopo, conforme a documentação: login, cadastro de clientes, pagamento on-line, estoque e consulta de pedidos.

## Cenários em Gherkin

- [Interface: catálogo, carrinho e checkout](cenarios/store-ui.feature)
- [API: produtos, cálculo do carrinho e pedidos](cenarios/store-api.feature)

Os arquivos contêm **29 casos de teste**: 13 de interface e 16 de API, contando separadamente os três exemplos de limite de frete do `Esquema do Cenário`.

## Rastreabilidade dos critérios de aceite

| Critério | Regra resumida | Cenários |
| --- | --- | --- |
| CA01 | Cupom `BEMVINDO10` aplica 10% sobre o subtotal | UI-04, UI-12, API-05 |
| CA02 | Cupom ignora caixa e espaços externos | UI-04, API-05 |
| CA03 | Cupom inexistente não aplica desconto | UI-05, API-06, API-12 |
| CA04 | Cupom expirado não aplica desconto | UI-06, UI-07, API-07, API-13 |
| CA05 | Apenas um cupom pode permanecer aplicado | UI-07 |
| CA06 | Frete grátis a partir de R$ 200,00, inclusive | UI-02, UI-12, UI-13, API-04 |
| CA07 | Frete de R$ 19,90 abaixo de R$ 200,00 | UI-03, API-04 |
| CA08 | Frete considera o subtotal antes do desconto | UI-04, UI-12, API-05 |
| CA09 | Desconto não incide sobre o frete | UI-04, UI-12, API-05 |
| CA10 | Máximo de 5 unidades por produto na UI e API | UI-08, API-08 |
| CA11 | Valores arredondados para duas casas decimais | UI-03, UI-04, UI-13, API-04, API-05 |

## Priorização

- **Críticos/smoke:** exibição e inclusão de produto, aplicação do cupom válido, criação de pedido e conclusão do checkout.
- **Alta prioridade:** limites do frete, quantidade máxima, validação dos cupons e consistência de valores.
- **Regressão:** consultas de produtos, validações do cliente, itens duplicados e pedido sem itens.
