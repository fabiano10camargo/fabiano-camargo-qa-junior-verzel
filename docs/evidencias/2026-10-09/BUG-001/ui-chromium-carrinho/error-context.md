# Contexto da falha — BUG-001 — Chromium — carrinho

## Cenário

Adicionar duas unidades da Mochila Urbana 20L e consultar o carrinho sem cupom.

## Resultado esperado

- Subtotal: R$ 200,00.
- Frete: Grátis.
- Total: R$ 200,00.
- Nenhuma mensagem de valor faltante para frete grátis.

## Resultado obtido

- Subtotal: R$ 200,00.
- Frete: R$ 19,90.
- Total: R$ 219,90.
- Mensagem exibida: “Faltam R$ 0,00 para o frete grátis.”

O teste `UI-02 — concede frete grátis no limite de R$ 200,00` confirmou o desvio no Chromium em 09/10/2026.
