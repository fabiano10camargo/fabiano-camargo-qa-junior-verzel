# language: pt

@api
Funcionalidade: API da Verzel Store
  Como consumidor da API
  Quero consultar produtos, calcular o carrinho e criar pedidos
  Para validar os contratos e as regras de negócio documentadas

  @API-01 @produtos
  Cenário: Listar o catálogo fixo
    Quando enviar GET para "/api/produtos"
    Então o status deve ser 200
    E a resposta deve conter os 8 produtos documentados

  @API-02 @produtos
  Cenário: Consultar um produto por id
    Quando enviar GET para "/api/produtos/P005"
    Então o status deve ser 200
    E a resposta deve conter a "Mochila Urbana 20L" com preço 100

  @API-03 @produtos
  Cenário: Consultar um produto inexistente
    Quando enviar GET para "/api/produtos/P999"
    Então o status deve ser 404
    E o código de erro deve ser "PRODUTO_NAO_ENCONTRADO"

  @API-04 @CA11
  Esquema do Cenário: Calcular o frete nos limites documentados
    Dado um carrinho com subtotal de <subtotal>
    Quando enviar POST para "/api/carrinho/calcular"
    Então o status deve ser 200
    E o frete deve ser <frete>
    E freteGratis deve ser <freteGratis>
    E o valor faltante deve ser <faltante>
    E o total deve ser <total>

    @CA07
    Exemplos: Abaixo do limite
      | caso               | subtotal | frete | freteGratis | faltante | total |
      | abaixo do limite   | 199.80   | 19.90 | false       | 0.20     | 219.70 |

    @CA06 @bug-BUG-001
    Exemplos: No limite exato
      | caso                 | subtotal | frete | freteGratis | faltante | total |
      | exatamente no limite | 200.00 | 0.00  | true        | 0.00     | 200.00 |

    @CA06
    Exemplos: Acima do limite
      | caso               | subtotal | frete | freteGratis | faltante | total |
      | acima do limite    | 219.80   | 0.00  | true        | 0.00     | 219.80 |

  @API-05 @CA01 @CA02 @CA08 @CA09 @CA11
  Cenário: Aplicar cupom válido no cálculo do carrinho
    Dado um carrinho com subtotal de 219.80
    Quando calcular o carrinho com o cupom "  bemvindo10  "
    Então o status deve ser 200
    E o desconto deve ser 21.98
    E o frete deve ser 0
    E o total deve ser 197.82
    E o cupom normalizado deve ser "BEMVINDO10"

  @API-06 @CA03
  Cenário: Calcular o carrinho com cupom inexistente
    Quando calcular o carrinho com o cupom "NAOEXISTE"
    Então o status deve ser 200
    E nenhum desconto deve ser aplicado
    E a mensagem do cupom deve ser "Cupom inválido."

  @API-07 @CA04
  Cenário: Calcular o carrinho com cupom expirado
    Quando calcular o carrinho com o cupom "VERAO2026"
    Então o status deve ser 200
    E nenhum desconto deve ser aplicado
    E a mensagem do cupom deve ser "Cupom expirado."

  @API-08 @CA10 @bug-BUG-002
  Cenário: Rejeitar quantidade maior que cinco
    Quando calcular um carrinho com 6 unidades do produto "P005"
    Então o status deve ser 422
    E o código de erro deve ser "QUANTIDADE_MAXIMA_EXCEDIDA"

  @API-09 @validacao
  Cenário: Rejeitar produto duplicado na lista de itens
    Quando calcular um carrinho com o produto "P005" repetido em dois itens
    Então o status deve ser 422
    E o código de erro deve ser "ITEM_DUPLICADO"

  @API-10 @pedidos @smoke
  Cenário: Criar um pedido válido
    Dado um cliente com nome e sobrenome, e-mail e CEP válidos
    E um carrinho com produtos e cupom válido
    Quando enviar POST para "/api/pedidos"
    Então o status deve ser 201
    E o número deve seguir o formato "VZ-000000"
    E os valores do pedido devem corresponder ao cálculo do carrinho

  @API-11 @pedidos
  Cenário: Rejeitar dados inválidos do cliente
    Quando criar um pedido com nome, e-mail e CEP inválidos
    Então o status deve ser 422
    E o código de erro deve ser "DADOS_INVALIDOS"

  @API-12 @pedidos @CA03
  Cenário: Rejeitar cupom inexistente ao criar pedido
    Quando criar um pedido com o cupom "NAOEXISTE"
    Então o status deve ser 422
    E o código de erro deve ser "CUPOM_INVALIDO"

  @API-13 @pedidos @CA04
  Cenário: Rejeitar cupom expirado ao criar pedido
    Quando criar um pedido com o cupom "VERAO2026"
    Então o status deve ser 422
    E o código de erro deve ser "CUPOM_EXPIRADO"

  @API-14 @pedidos
  Cenário: Rejeitar pedido sem itens
    Quando criar um pedido com a lista de itens vazia
    Então o status deve ser 422
    E o código de erro deve ser "ITENS_OBRIGATORIOS"
