# Contexto do erro — BUG-001 na API

## Informações do teste

- **Teste:** API de cálculo do carrinho — calcula frete exatamente no limite
- **Arquivo:** `tests/api/cart-calculation.api.spec.ts`
- **Linha da verificação:** 72
- **Endpoint:** `POST /api/carrinho/calcular`

## Entrada utilizada

```json
{
  "itens": [
    { "produtoId": "P005", "quantidade": 2 }
  ]
}
```

## Falha observada

A resposta foi comparada com os valores definidos pelo critério CA06. Três campos ficaram diferentes do esperado:

| Campo | Esperado | Obtido |
| --- | ---: | ---: |
| `frete` | `0` | `19.9` |
| `freteGratis` | `true` | `false` |
| `total` | `200` | `219.9` |

O subtotal retornado foi `200` e o valor faltante para o frete grátis foi `0`, confirmando que o carrinho atingiu exatamente o limite documentado.

## Interpretação

O teste está alinhado ao CA06, que concede frete grátis para compras com subtotal a partir de R$ 200,00, inclusive. A API aplicou a condição como se o limite fosse maior que R$ 200,00, em vez de maior ou igual.

## Verificação que detectou o erro

```ts
expect(body).toMatchObject(testCase.expected);
```

## Resultado

**FALHOU — comportamento do produto divergente da documentação.**
