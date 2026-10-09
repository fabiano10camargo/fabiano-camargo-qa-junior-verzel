# Contexto da falha — BUG-001 — API

## Cenário

Calcular o carrinho com duas unidades da Mochila Urbana 20L, totalizando subtotal de R$ 200,00.

## Resultado esperado

- Status HTTP 200.
- Frete igual a 0.
- `freteGratis` igual a `true`.
- Total igual a 200.

## Resultado obtido

- Status HTTP 200.
- Frete igual a 19,90.
- `freteGratis` igual a `false`.
- Total igual a 219,90.

O teste `API-04 — calcula frete exatamente no limite` confirmou o desvio em 09/10/2026.
