import { test, expect } from '../fixtures/store.fixture';
import { products } from '../data/products';
import type { ApiErrorBody, Product } from '../types/store';

test.describe('API de produtos', () => {
  test('lista o catálogo fixo de produtos', { tag: '@API-01' }, async ({ storeApi }) => {
    const response = await storeApi.listProducts();

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Product[];

    expect(body).toHaveLength(8);
    for (const product of Object.values(products)) {
      expect(body).toContainEqual(
        expect.objectContaining({
          id: product.id,
          nome: product.name,
          preco: product.price,
        }),
      );
    }
  });

  test('consulta um produto por id', { tag: '@API-02' }, async ({ storeApi }) => {
    const response = await storeApi.getProduct(products.mochila.id);

    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: products.mochila.id,
      nome: products.mochila.name,
      preco: products.mochila.price,
    });
  });

  test('retorna 404 para produto inexistente', { tag: '@API-03' }, async ({ storeApi }) => {
    const response = await storeApi.getProduct('P999');

    expect(response.status()).toBe(404);
    const body = (await response.json()) as ApiErrorBody;
    expect(body.erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
    expect(body.erro.mensagem).toBeTruthy();
  });
});
