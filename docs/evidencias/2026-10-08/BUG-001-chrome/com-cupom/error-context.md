# Contexto do erro — BUG-001 com cupom no Google Chrome

## Cenário

Preservar o frete grátis em R$ 200,00 após aplicar o cupom `BEMVINDO10` e confirmar a compra.

## Resultado esperado

- Desconto: R$ 20,00.
- Frete: grátis.
- Total: R$ 180,00.
- Os mesmos valores devem aparecer na confirmação.

## Resultado obtido

- Desconto: R$ 20,00.
- Frete: R$ 19,90.
- Total: R$ 199,90.
- A confirmação do pedido preservou o frete e o total incorretos.

## Resultado

**FALHOU — BUG-001 reproduzido no carrinho e na confirmação pelo Google Chrome.**
