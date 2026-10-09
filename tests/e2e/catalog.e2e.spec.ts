import { test, expect } from '../fixtures/store.fixture';
import { products } from '../data/products';

test.describe('Catálogo', () => {
  test(
    'exibe produtos e adiciona item ao carrinho',
    { tag: ['@UI-01', '@catalogo', '@smoke'] },
    async ({ catalogPage }) => {
      await catalogPage.open();

      await expect(catalogPage.productCards).toHaveCount(8);
      await expect(catalogPage.productCard(products.tenis.name)).toContainText('R$ 189,90');

      await catalogPage.addProduct(products.tenis.name);

      await expect(catalogPage.productCard(products.tenis.name)).toContainText('1 no carrinho');
      await expect(catalogPage.header.cartLink).toHaveAccessibleName(
        /Carrinho 1 itens no carrinho/,
      );
    },
  );
});
