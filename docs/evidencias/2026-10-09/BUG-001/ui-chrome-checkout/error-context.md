# Contexto da falha — BUG-001 — Google Chrome — checkout

## Cenário

Adicionar duas Mochilas Urbanas 20L, aplicar o cupom `BEMVINDO10` e confirmar a compra com dados válidos.

## Resultado esperado

- Subtotal: R$ 200,00.
- Desconto: R$ 20,00.
- Frete: Grátis.
- Total: R$ 180,00.
- Os mesmos valores devem aparecer na confirmação.

## Resultado obtido

- O desconto permaneceu correto em R$ 20,00.
- O frete foi cobrado em R$ 19,90.
- O total foi R$ 199,90 no carrinho e na confirmação.

O teste `UI-12 — preserva frete grátis em R$ 200,00 após aplicar cupom` confirmou o desvio no Google Chrome em 09/10/2026.
