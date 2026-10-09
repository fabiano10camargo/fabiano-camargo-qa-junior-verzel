# Contexto do erro — BUG-001 no Chromium

## Informações do teste

- **Teste:** Carrinho — concede frete grátis no limite de R$ 200,00
- **Arquivo:** `tests/e2e/cart.e2e.spec.ts`
- **Linha da verificação:** 14
- **Navegador:** Chromium fornecido pelo Playwright

## Passos executados

1. Abrir o catálogo.
2. Adicionar duas unidades de **Mochila Urbana 20L**, a R$ 100,00 cada.
3. Abrir o carrinho.
4. Consultar o resumo do pedido.

## Falha observada

| Campo | Esperado | Obtido |
| --- | --- | --- |
| Subtotal | R$ 200,00 | R$ 200,00 |
| Frete | Grátis | R$ 19,90 |
| Total | R$ 200,00 | R$ 219,90 |

O teste aguardou cinco segundos pela atualização do frete, mas o valor permaneceu em R$ 19,90. A página também exibiu a mensagem contraditória “Faltam R$ 0,00 para o frete grátis.”

## Elemento verificado

```text
Região “Resumo do pedido” → elemento [data-valor="frete"]
```

## Verificação que detectou o erro

```ts
await expect(cartPage.summary.value('Frete')).toHaveText('Grátis');
```

## Resultado

**FALHOU — comportamento do produto divergente do CA06.**
