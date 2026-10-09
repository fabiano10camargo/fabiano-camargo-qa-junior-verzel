import { test, expect } from '../fixtures/store.fixture';
import { coupons, products } from '../data/products';

test.describe('Carrinho', () => {
  test(
    'concede frete grátis no limite de R$ 200,00',
    { tag: ['@UI-02', '@CA06', '@bug-BUG-001'] },
    async ({ catalogPage, cartPage }) => {
      test.fail(true, 'BUG-001: o frete deveria ser grátis exatamente em R$ 200,00.');

      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name, 2);
      await catalogPage.header.openCart();

      await expect(cartPage.summary.value('Subtotal')).toHaveText('R$ 200,00');
      await expect.soft(cartPage.summary.value('Frete')).toHaveText('Grátis', { timeout: 2_000 });
      await expect
        .soft(cartPage.summary.value('Total'))
        .toHaveText('R$ 200,00', { timeout: 2_000 });
      await expect
        .soft(cartPage.summary.remainingForFreeShippingMessage)
        .not.toBeVisible({ timeout: 2_000 });
    },
  );

  test(
    'cobra frete abaixo do limite e informa o valor faltante',
    { tag: ['@UI-03', '@CA07', '@CA11'] },
    async ({ catalogPage, cartPage }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.calca.name);
      await catalogPage.addProduct(products.camiseta.name);
      await catalogPage.header.openCart();

      await expect(cartPage.summary.value('Subtotal')).toHaveText('R$ 199,80');
      await expect(cartPage.summary.value('Frete')).toHaveText('R$ 19,90');
      await expect(cartPage.summary.remainingForFreeShippingMessage).toHaveText(
        'Faltam R$ 0,20 para o frete grátis.',
      );
      await expect(cartPage.summary.value('Total')).toHaveText('R$ 219,70');
    },
  );

  test(
    'concede frete grátis acima do limite',
    { tag: ['@UI-13', '@CA06', '@CA11'] },
    async ({ catalogPage, cartPage }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.tenis.name);
      await catalogPage.addProduct(products.meias.name);
      await catalogPage.header.openCart();

      await expect(cartPage.summary.value('Subtotal')).toHaveText('R$ 219,80');
      await expect(cartPage.summary.value('Frete')).toHaveText('Grátis');
      await expect(cartPage.summary.value('Total')).toHaveText('R$ 219,80');
      await expect(cartPage.summary.remainingForFreeShippingMessage).not.toBeVisible();
    },
  );

  test(
    'limita a quantidade de cada produto a cinco',
    { tag: ['@UI-08', '@CA10'] },
    async ({ catalogPage, cartPage }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name);
      await catalogPage.header.openCart();

      const quantity = cartPage.quantity(products.mochila.name);
      await quantity.increase(4);

      await expect(quantity.status).toHaveText('5');
      await expect(quantity.increaseButton).toBeDisabled();
    },
  );

  test(
    'aplica cupom ignorando caixa e espaços',
    { tag: ['@UI-04', '@CA01', '@CA02', '@CA08', '@CA09', '@CA11', '@smoke'] },
    async ({ catalogPage, cartPage, page }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.tenis.name);
      await catalogPage.addProduct(products.meias.name);
      await catalogPage.header.openCart();

      await cartPage.coupon.apply('  bemvindo10  ');

      await expect(page.getByText(`Cupom ${coupons.valid} aplicado.`)).toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('- R$ 21,98');
      await expect(cartPage.summary.value('Frete')).toHaveText('Grátis');
      await expect(cartPage.summary.value('Total')).toHaveText('R$ 197,82');
    },
  );

  test(
    'exibe mensagem para cupom expirado',
    { tag: ['@UI-06', '@CA04'] },
    async ({ catalogPage, cartPage, page }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name);
      await catalogPage.header.openCart();

      await cartPage.coupon.apply(coupons.expired);

      await expect(page.getByText('Cupom expirado.')).toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('R$ 0,00');
    },
  );

  test(
    'informa cupom inexistente sem aplicar desconto',
    { tag: ['@UI-05', '@CA03'] },
    async ({ catalogPage, cartPage, page }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name);
      await catalogPage.header.openCart();

      await cartPage.coupon.apply(coupons.invalid);

      await expect(page.getByText('Cupom inválido.')).toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('R$ 0,00');
      await expect(cartPage.summary.value('Total')).toHaveText('R$ 119,90');
    },
  );

  test(
    'remove o cupom atual antes de aplicar outro',
    { tag: ['@UI-07', '@CA05'] },
    async ({ catalogPage, cartPage, page }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.tenis.name);
      await catalogPage.addProduct(products.meias.name);
      await catalogPage.header.openCart();

      await cartPage.coupon.apply(coupons.valid);
      await expect(page.getByText(`Cupom ${coupons.valid} aplicado.`)).toBeVisible();
      await expect(cartPage.coupon.removeButton).toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('- R$ 21,98');

      await cartPage.coupon.remove();
      await expect(cartPage.coupon.input).toBeVisible();
      await expect(cartPage.coupon.removeButton).not.toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('R$ 0,00');
      await expect(cartPage.summary.value('Total')).toHaveText('R$ 219,80');

      await cartPage.coupon.apply(coupons.expired);
      await expect(page.getByText('Cupom expirado.')).toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('R$ 0,00');
    },
  );
});
