# Contexto da falha — BUG-002 — API

## Cenário

Calcular o carrinho com seis unidades da Mochila Urbana 20L.

## Resultado esperado

- Status HTTP 422.
- Código de erro `QUANTIDADE_MAXIMA_EXCEDIDA`.

## Resultado obtido

- Status HTTP 200.
- A API aceitou as seis unidades e calculou subtotal e total de R$ 600,00.

O teste `API-08 — rejeita quantidade maior que cinco` confirmou o desvio em 09/10/2026.
