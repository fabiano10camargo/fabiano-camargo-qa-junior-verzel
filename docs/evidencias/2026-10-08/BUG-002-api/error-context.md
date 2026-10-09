# Contexto do erro — BUG-002 na API

## Informações do teste

- **Teste:** API de cálculo do carrinho — rejeita quantidade maior que cinco
- **Arquivo:** `tests/api/cart-calculation.api.spec.ts`
- **Linha da verificação:** 139
- **Endpoint:** `POST /api/carrinho/calcular`

## Entrada utilizada

```json
{
  "itens": [
    { "produtoId": "P005", "quantidade": 6 }
  ]
}
```

## Falha observada

| Campo | Esperado | Obtido |
| --- | --- | --- |
| Status HTTP | `422` | `200` |
| Código esperado | `QUANTIDADE_MAXIMA_EXCEDIDA` | Nenhum erro retornado |
| Quantidade aceita | No máximo 5 | 6 |

A API calculou normalmente um carrinho com seis unidades:

```json
{
  "subtotal": 600,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 600,
  "cupom": null
}
```

## Interpretação

O CA10 determina que cada produto pode ter no máximo cinco unidades, tanto na interface quanto na API. A interface bloqueia corretamente a sexta unidade, mas o endpoint permite contornar a regra.

## Verificação que detectou o erro

```ts
expect(response.status()).toBe(422);
```

## Resultado

**FALHOU — comportamento do produto divergente do CA10.**
