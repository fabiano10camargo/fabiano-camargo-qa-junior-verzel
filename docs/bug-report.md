# Relatório de bugs

Ambiente: `https://verzel-store.qa-test-verzel-store.workers.dev`  
História: VZS-142, versão 2.3.0  
Data da última validação: 09/10/2026

## BUG-001 — Frete é cobrado quando o subtotal é exatamente R$ 200,00

| Campo | Valor |
| --- | --- |
| Severidade | Alta |
| Prioridade sugerida | Alta |
| Frequência | 100% (reproduzido na API, Chromium e Google Chrome) |
| Critério afetado | CA06 |
| Componentes | API de cálculo, carrinho e resumo do pedido |
| Status | Aberto |

### Pré-condição

Ter acesso à Verzel Store com o carrinho vazio.

### Passos pela interface

1. Abrir o catálogo.
2. Adicionar duas unidades de **Mochila Urbana 20L**, no valor de R$ 100,00 cada.
3. Abrir o carrinho.
4. Observar o resumo do pedido.

### Passos pela API

Enviar `POST /api/carrinho/calcular` com:

```json
{
  "itens": [
    { "produtoId": "P005", "quantidade": 2 }
  ]
}
```

### Resultado esperado

- `subtotal`: `200`
- `frete`: `0`
- `freteGratis`: `true`
- `valorFaltanteFreteGratis`: `0`
- `total`: `200`
- A interface deve exibir **Grátis** no frete.

### Resultado obtido

A API responde status 200 com:

```json
{
  "subtotal": 200,
  "desconto": 0,
  "frete": 19.9,
  "freteGratis": false,
  "valorFaltanteFreteGratis": 0,
  "total": 219.9,
  "cupom": null
}
```

A interface exibe frete de **R$ 19,90**, total de **R$ 219,90** e, contraditoriamente, a mensagem **“Faltam R$ 0,00 para o frete grátis.”**

### Reprodução adicional com cupom

O defeito também ocorre quando o cupom `BEMVINDO10` é aplicado sobre o subtotal de R$ 200,00:

| Valor | Esperado | Obtido |
| --- | --- | --- |
| Desconto | R$ 20,00 | R$ 20,00 |
| Frete | Grátis | R$ 19,90 |
| Total | R$ 180,00 | R$ 199,90 |

Após confirmar a compra, o pedido mantém o desconto correto de R$ 20,00, mas também mantém o frete indevido de R$ 19,90 e o total incorreto de R$ 199,90. Isso demonstra que o problema não está apenas na interface: o valor incorreto é confirmado pelo fluxo de pedidos.

### Impacto

O cliente é cobrado indevidamente em R$ 19,90 exatamente no limite divulgado para frete grátis. Como o cálculo vem da API, o problema afeta todos os consumidores do endpoint e não apenas a apresentação na interface.

### Evidências

- [Screenshot sem cupom no Chromium](evidencias/2026-10-09/BUG-001/ui-chromium-carrinho/test-failed-1.png)
- [Vídeo sem cupom no Chromium](evidencias/2026-10-09/BUG-001/ui-chromium-carrinho/video.webm)
- [Contexto sem cupom no Chromium](evidencias/2026-10-09/BUG-001/ui-chromium-carrinho/error-context.md)
- [Screenshot com cupom no Chromium](evidencias/2026-10-09/BUG-001/ui-chromium-checkout/test-failed-1.png)
- [Vídeo com cupom no Chromium](evidencias/2026-10-09/BUG-001/ui-chromium-checkout/video.webm)
- [Contexto com cupom no Chromium](evidencias/2026-10-09/BUG-001/ui-chromium-checkout/error-context.md)
- [Screenshot sem cupom no Google Chrome](evidencias/2026-10-09/BUG-001/ui-chrome-carrinho/test-failed-1.png)
- [Vídeo sem cupom no Google Chrome](evidencias/2026-10-09/BUG-001/ui-chrome-carrinho/video.webm)
- [Contexto sem cupom no Google Chrome](evidencias/2026-10-09/BUG-001/ui-chrome-carrinho/error-context.md)
- [Screenshot com cupom no Google Chrome](evidencias/2026-10-09/BUG-001/ui-chrome-checkout/test-failed-1.png)
- [Vídeo com cupom no Google Chrome](evidencias/2026-10-09/BUG-001/ui-chrome-checkout/video.webm)
- [Contexto com cupom no Google Chrome](evidencias/2026-10-09/BUG-001/ui-chrome-checkout/error-context.md)
- [Contexto da falha na API](evidencias/2026-10-09/BUG-001/api/error-context.md)
- [Execução dos dois cenários de frete em R$ 200,00](evidencias/2026-10-08/exploratory/cenarios-frete-200.md)
- [Captura do pedido confirmado com cupom](evidencias/2026-10-08/exploratory/cenarios-frete-200-confirmacao.png)

## BUG-002 — API aceita quantidade maior que cinco unidades

| Campo | Valor |
| --- | --- |
| Severidade | Alta |
| Prioridade sugerida | Alta |
| Frequência | 100% na API |
| Critério afetado | CA10 |
| Componente | `POST /api/carrinho/calcular` |
| Status | Aberto |

### Pré-condição

Ter acesso à API da Verzel Store.

### Passos

Enviar `POST /api/carrinho/calcular` com:

```json
{
  "itens": [
    { "produtoId": "P005", "quantidade": 6 }
  ]
}
```

### Resultado esperado

- Status HTTP `422`.
- Código `QUANTIDADE_MAXIMA_EXCEDIDA`.
- O carrinho não deve ser calculado.

### Resultado obtido

A API responde status `200` e aceita as seis unidades:

```json
{
  "itens": [
    {
      "produtoId": "P005",
      "nome": "Mochila Urbana 20L",
      "precoUnitario": 100,
      "quantidade": 6,
      "total": 600
    }
  ],
  "subtotal": 600,
  "desconto": 0,
  "frete": 0,
  "freteGratis": true,
  "valorFaltanteFreteGratis": 0,
  "total": 600,
  "cupom": null
}
```

### Impacto

A regra é aplicada na interface, mas pode ser contornada por qualquer cliente que chame a API diretamente. Isso gera inconsistência entre canais e permite pedidos fora do limite documentado.

### Evidência

- [Contexto da falha na API](evidencias/2026-10-09/BUG-002/api/error-context.md)

## Itens que não são bugs

Conforme a documentação, não foram reportados como defeito:

- carrinho isolado por aba, navegador ou janela anônima;
- pedidos não persistidos;
- ausência de e-mail e cobrança real;
- produtos, preços e cupons fixos;
- ausência de controle de estoque;
- API sem persistência entre requisições.
