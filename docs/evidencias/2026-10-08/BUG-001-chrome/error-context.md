# Contexto do erro — BUG-001 no Google Chrome

## Cenário

Conceder frete grátis exatamente em R$ 200,00, sem cupom.

## Resultado esperado

- Subtotal: R$ 200,00.
- Frete: grátis.
- Total: R$ 200,00.
- Nenhuma mensagem de valor faltante.

## Resultado obtido

- Subtotal: R$ 200,00.
- Frete: R$ 19,90.
- Total: R$ 219,90.
- Mensagem exibida: “Faltam R$ 0,00 para o frete grátis.”

## Resultado

**FALHOU — BUG-001 reproduzido no Google Chrome.**
