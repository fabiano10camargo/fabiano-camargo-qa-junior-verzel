import { test, expect } from '../fixtures/store.fixture';
import { CartBuilder } from '../builders/cart.builder';
import { invalidCustomer, validCustomer } from '../data/customers';
import { coupons, products } from '../data/products';
import type { ApiErrorBody, OrderResponse } from '../types/store';

test.describe('API de pedidos', () => {
  test(
    'cria um pedido válido',
    { tag: ['@API-10', '@pedidos', '@smoke'] },
    async ({ storeApi }) => {
      const cart = new CartBuilder()
        .add(products.tenis.id)
        .add(products.meias.id)
        .withCoupon(coupons.valid)
        .build();

      const response = await storeApi.createOrder({
        cliente: validCustomer,
        ...cart,
      });

      expect(response.status()).toBe(201);
      const body = (await response.json()) as OrderResponse;
      expect(body).toMatchObject({
        subtotal: 219.8,
        desconto: 21.98,
        frete: 0,
        total: 197.82,
        cliente: {
          nome: validCustomer.nome,
          email: validCustomer.email,
          cep: '01310100',
        },
      });
      expect(body.numero).toMatch(/^VZ-\d{6}$/);
      expect(Date.parse(body.criadoEm)).not.toBeNaN();
    },
  );

  test(
    'rejeita dados inválidos do cliente',
    { tag: ['@API-11', '@pedidos'] },
    async ({ storeApi }) => {
      const response = await storeApi.createOrder({
        cliente: invalidCustomer,
        ...new CartBuilder().add(products.mochila.id).build(),
      });

      expect(response.status()).toBe(422);
      const body = (await response.json()) as ApiErrorBody;
      expect(body.erro.codigo).toBe('DADOS_INVALIDOS');
    },
  );

  test(
    'rejeita cupom inexistente',
    { tag: ['@API-12', '@pedidos', '@CA03'] },
    async ({ storeApi }) => {
      const response = await storeApi.createOrder({
        cliente: validCustomer,
        ...new CartBuilder().add(products.mochila.id).withCoupon(coupons.invalid).build(),
      });

      expect(response.status()).toBe(422);
      const body = (await response.json()) as ApiErrorBody;
      expect(body.erro.codigo).toBe('CUPOM_INVALIDO');
    },
  );

  test(
    'rejeita cupom expirado',
    { tag: ['@API-13', '@pedidos', '@CA04'] },
    async ({ storeApi }) => {
      const response = await storeApi.createOrder({
        cliente: validCustomer,
        ...new CartBuilder().add(products.mochila.id).withCoupon(coupons.expired).build(),
      });

      expect(response.status()).toBe(422);
      const body = (await response.json()) as ApiErrorBody;
      expect(body.erro.codigo).toBe('CUPOM_EXPIRADO');
    },
  );

  test('rejeita pedido sem itens', { tag: ['@API-14', '@pedidos'] }, async ({ storeApi }) => {
    const response = await storeApi.createOrder({
      cliente: validCustomer,
      itens: [],
    });

    expect(response.status()).toBe(422);
    const body = (await response.json()) as ApiErrorBody;
    expect(body.erro.codigo).toBe('ITENS_OBRIGATORIOS');
  });
});
