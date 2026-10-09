# language: pt

@ui
Funcionalidade: Compra pela interface da Verzel Store
  Como cliente da loja
  Quero adicionar produtos, aplicar cupons e concluir o pedido
  Para validar as regras de desconto, frete e checkout

  @UI-01 @catalogo
  Cenário: Exibir o catálogo e adicionar um produto ao carrinho
    Dado que o cliente abriu o catálogo
    Então devem ser exibidos os 8 produtos documentados
    Quando adicionar 1 "Tênis Casual Urbano" ao carrinho
    Então o produto deve informar "1 no carrinho"
    E o contador do carrinho deve exibir 1 item

  @UI-02 @CA06 @bug-BUG-001
  Cenário: Conceder frete grátis exatamente em duzentos reais
    Dado que adicionei duas Mochilas Urbanas 20L de R$ 100,00 cada
    E o subtotal dos produtos é R$ 200,00
    Quando consulto o carrinho sem cupom
    Então o frete deve ser grátis
    E o total deve ser R$ 200,00
    E não devo ver mensagem de valor faltante para frete grátis

  @UI-03 @CA07
  Cenário: Cobrar frete abaixo do limite
    Dado que o carrinho possui subtotal de "R$ 199,80"
    Quando o cliente consultar o resumo do pedido
    Então o frete deve ser "R$ 19,90"
    E deve ser informado que faltam "R$ 0,20" para o frete grátis
    E o total deve ser "R$ 219,70"

  @UI-13 @CA06 @CA11
  Cenário: Conceder frete grátis acima de duzentos reais
    Dado que o carrinho possui 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"
    E o subtotal é "R$ 219,80"
    Quando o cliente consultar o resumo do pedido
    Então o frete deve ser "Grátis"
    E não deve ser exibida mensagem de valor faltante para frete grátis
    E o total deve ser "R$ 219,80"

  @UI-04 @CA01 @CA02 @CA08 @CA09 @CA11
  Cenário: Aplicar cupom ignorando caixa e espaços
    Dado que o carrinho possui 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"
    E o subtotal é "R$ 219,80"
    Quando o cliente aplicar o cupom "  bemvindo10  "
    Então deve ser exibida a mensagem "Cupom BEMVINDO10 aplicado."
    E o desconto deve ser "- R$ 21,98"
    E o frete deve ser "Grátis"
    E o total deve ser "R$ 197,82"

  @UI-05 @CA03
  Cenário: Informar cupom inexistente
    Dado que o carrinho possui produtos
    Quando o cliente aplicar o cupom "NAOEXISTE"
    Então deve ser exibida a mensagem "Cupom inválido."
    E nenhum desconto deve ser aplicado

  @UI-06 @CA04
  Cenário: Informar cupom expirado
    Dado que o carrinho possui produtos
    Quando o cliente aplicar o cupom "VERAO2026"
    Então deve ser exibida a mensagem "Cupom expirado."
    E nenhum desconto deve ser aplicado

  @UI-07 @CA05
  Cenário: Remover o cupom atual antes de aplicar outro
    Dado que o cupom "BEMVINDO10" está aplicado
    Então somente esse cupom deve estar ativo
    Quando o cliente remover o cupom atual
    E aplicar o cupom "VERAO2026"
    Então deve ser exibida a mensagem "Cupom expirado."
    E nenhum desconto deve permanecer aplicado

  @UI-08 @CA10
  Cenário: Limitar a quantidade de um produto a cinco unidades
    Dado que o carrinho possui 1 "Mochila Urbana 20L"
    Quando o cliente aumentar a quantidade até 5
    Então a quantidade exibida deve ser 5
    E o botão para aumentar deve ficar desabilitado

  @UI-09 @checkout
  Cenário: Validar os campos obrigatórios do checkout
    Dado que o cliente chegou ao checkout com um produto
    Quando tentar confirmar o pedido sem preencher seus dados
    Então deve ser exibida a mensagem "Informe o nome completo."
    E deve ser exibida a mensagem "Informe o e-mail."
    E deve ser exibida a mensagem "Informe o CEP."

  @UI-10 @checkout
  Cenário: Validar os formatos dos dados do cliente
    Dado que o cliente chegou ao checkout com um produto
    Quando informar apenas o primeiro nome, um e-mail inválido e um CEP com 3 dígitos
    Então deve ser exibida a mensagem "Informe nome e sobrenome."
    E deve ser exibida a mensagem "Informe um e-mail válido."
    E deve ser exibida a mensagem "Informe um CEP com 8 dígitos."

  @UI-11 @checkout @smoke
  Cenário: Finalizar uma compra válida com cupom
    Dado que o carrinho possui 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"
    E o cupom "BEMVINDO10" está aplicado
    Quando o cliente informar nome e sobrenome, e-mail e CEP válidos
    E confirmar o pedido
    Então deve ser exibida a confirmação do pedido
    E o número do pedido deve seguir o formato "VZ-000000"

  @UI-12 @checkout @CA01 @CA06 @CA08 @CA09 @bug-BUG-001
  Cenário: Preservar frete grátis em duzentos reais após aplicar cupom
    Dado que adicionei duas Mochilas Urbanas 20L de R$ 100,00 cada
    E o subtotal dos produtos é R$ 200,00
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto deve ser R$ 20,00
    E o frete deve ser grátis
    E o total deve ser R$ 180,00
    Quando confirmo a compra com dados válidos
    Então o desconto confirmado deve ser R$ 20,00
    E o frete confirmado deve ser grátis
    E o total confirmado deve ser R$ 180,00
