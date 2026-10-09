import { test, expect } from '../fixtures/store.fixture';
import { invalidCustomer, validCustomer } from '../data/customers';
import { coupons, products } from '../data/products';

test.describe('Checkout', () => {
  test(
    'valida os campos obrigatórios',
    { tag: ['@UI-09', '@checkout'] },
    async ({ catalogPage, cartPage, checkoutPage, page }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name);
      await catalogPage.header.openCart();
      await cartPage.goToCheckout();
      await checkoutPage.submit();

      await expect(page.getByText('Informe o nome completo.')).toBeVisible();
      await expect(page.getByText('Informe o e-mail.')).toBeVisible();
      await expect(page.getByText('Informe o CEP.')).toBeVisible();
    },
  );

  test(
    'valida os formatos dos dados do cliente',
    { tag: ['@UI-10', '@checkout'] },
    async ({ catalogPage, cartPage, checkoutPage, page }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name);
      await catalogPage.header.openCart();
      await cartPage.goToCheckout();
      await checkoutPage.fillCustomer(invalidCustomer);
      await checkoutPage.submit();

      await expect(page.getByText('Informe nome e sobrenome.')).toBeVisible();
      await expect(page.getByText('Informe um e-mail válido.')).toBeVisible();
      await expect(page.getByText('Informe um CEP com 8 dígitos.')).toBeVisible();
    },
  );

  test(
    'finaliza uma compra com cupom',
    { tag: ['@UI-11', '@checkout', '@smoke'] },
    async ({ catalogPage, cartPage, checkoutPage, orderConfirmationPage }) => {
      await catalogPage.open();
      await catalogPage.addProduct(products.tenis.name);
      await catalogPage.addProduct(products.meias.name);
      await catalogPage.header.openCart();
      await cartPage.coupon.apply(coupons.valid);
      await cartPage.goToCheckout();

      await expect(checkoutPage.summary.value('Total')).toHaveText('R$ 197,82');
      await checkoutPage.fillCustomer(validCustomer);
      await checkoutPage.submit();

      await expect(orderConfirmationPage.title).toBeVisible();
      await expect(orderConfirmationPage.orderNumber).toBeVisible();
      await expect(orderConfirmationPage.value('Subtotal')).toHaveText('R$ 219,80');
      await expect(orderConfirmationPage.value('Desconto')).toHaveText('- R$ 21,98');
      await expect(orderConfirmationPage.value('Frete')).toHaveText('Grátis');
      await expect(orderConfirmationPage.value('Total')).toHaveText('R$ 197,82');
    },
  );

  test(
    'preserva frete grátis em R$ 200,00 após aplicar cupom',
    { tag: ['@UI-12', '@checkout', '@CA01', '@CA06', '@CA08', '@CA09', '@bug-BUG-001'] },
    async ({ catalogPage, cartPage, checkoutPage, orderConfirmationPage, page }) => {
      test.fail(true, 'BUG-001: o frete deveria ser grátis exatamente em R$ 200,00.');

      await catalogPage.open();
      await catalogPage.addProduct(products.mochila.name, 2);
      await catalogPage.header.openCart();

      await expect(cartPage.summary.value('Subtotal')).toHaveText('R$ 200,00');

      await cartPage.coupon.apply(coupons.valid);

      await expect(page.getByText(`Cupom ${coupons.valid} aplicado.`)).toBeVisible();
      await expect(cartPage.summary.value('Desconto')).toHaveText('- R$ 20,00');
      await expect.soft(cartPage.summary.value('Frete')).toHaveText('Grátis', { timeout: 2_000 });
      await expect
        .soft(cartPage.summary.value('Total'))
        .toHaveText('R$ 180,00', { timeout: 2_000 });

      await cartPage.goToCheckout();
      await checkoutPage.fillCustomer(validCustomer);
      await checkoutPage.submit();

      await expect(orderConfirmationPage.title).toBeVisible();
      await expect(orderConfirmationPage.orderNumber).toBeVisible();
      await expect(orderConfirmationPage.value('Desconto')).toHaveText('- R$ 20,00');
      await expect
        .soft(orderConfirmationPage.value('Frete'))
        .toHaveText('Grátis', { timeout: 2_000 });
      await expect
        .soft(orderConfirmationPage.value('Total'))
        .toHaveText('R$ 180,00', { timeout: 2_000 });
    },
  );
});
