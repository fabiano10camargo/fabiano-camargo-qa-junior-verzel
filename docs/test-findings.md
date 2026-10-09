# Achados da execução revisada

Ambiente validado: `https://verzel-store.qa-test-verzel-store.workers.dev`

## 1. Frete cobrado no limite exato de R$ 200,00

Critério de aceite: compras com subtotal a partir de R$ 200,00, inclusive, devem receber frete grátis.

Requisição usada:

```json
{
  "itens": [
    { "produtoId": "P005", "quantidade": 2 }
  ]
}
```

Esperado:

- `subtotal`: `200`
- `frete`: `0`
- `freteGratis`: `true`
- `total`: `200`

Obtido:

- `subtotal`: `200`
- `frete`: `19.9`
- `freteGratis`: `false`
- `total`: `219.9`

Testes que evidenciam o problema:

- `calcula frete exatamente no limite` — API
- `concede frete grátis no limite de R$ 200,00` — E2E
- `preserva frete grátis em R$ 200,00 após aplicar cupom` — E2E

O segundo cenário confirma que, após aplicar o cupom `BEMVINDO10`, o desconto de R$ 20,00 é calculado corretamente, mas o frete indevido de R$ 19,90 permanece no carrinho e na confirmação do pedido. O total obtido é R$ 199,90, em vez de R$ 180,00.

## 2. API aceita quantidade maior que cinco

Critério de aceite: cada produto pode ter no máximo cinco unidades, tanto na interface quanto na API.

Requisição usada:

```json
{
  "itens": [
    { "produtoId": "P005", "quantidade": 6 }
  ]
}
```

Esperado:

- Status `422`
- Código `QUANTIDADE_MAXIMA_EXCEDIDA`

Obtido:

- Status `200`

A interface impede corretamente o sexto item. O desvio está na validação da API.

Teste que evidencia o problema:

- `rejeita quantidade maior que cinco` — API

## Resultado observado

- TypeScript: sem erros.
- Smoke: 7 execuções aprovadas, considerando API, Chromium e Google Chrome.
- API completa: 14 aprovações normais e 2 falhas esperadas por desvios do produto.
- E2E Chromium: 11 aprovações normais e 2 falhas esperadas pelo mesmo desvio de frete, sem e com cupom.
- E2E Google Chrome: 11 aprovações normais e 2 falhas esperadas pelo mesmo desvio de frete, sem e com cupom.
- Total automatizado: 42 resultados aceitos pelo runner, com 36 aprovações normais, 6 falhas esperadas e nenhuma falha inesperada.
