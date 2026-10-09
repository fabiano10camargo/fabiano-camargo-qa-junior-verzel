import { test, expect } from '../fixtures/store.fixture';
import { CartBuilder } from '../builders/cart.builder';
import { coupons, products } from '../data/products';
import type { ApiErrorBody, CartCalculation } from '../types/store';

type FreightCase = {
  name: string;
  tags: string[];
  knownBug?: string;
  payload: ReturnType<CartBuilder['build']>;
  expected: Pick<
    CartCalculation,
    'subtotal' | 'desconto' | 'frete' | 'freteGratis' | 'valorFaltanteFreteGratis' | 'total'
  >;
};

const freightCases: FreightCase[] = [
  {
    name: 'abaixo do limite',
    tags: ['@API-04', '@CA07', '@CA11'],
    payload: new CartBuilder().add(products.calca.id).add(products.camiseta.id).build(),
    expected: {
      subtotal: 199.8,
      desconto: 0,
      frete: 19.9,
      freteGratis: false,
      valorFaltanteFreteGratis: 0.2,
      total: 219.7,
    },
  },
  {
    name: 'exatamente no limite',
    tags: ['@API-04', '@CA06', '@CA11', '@bug-BUG-001'],
    knownBug: 'BUG-001: o frete deveria ser grátis exatamente em R$ 200,00.',
    payload: new CartBuilder().add(products.mochila.id, 2).build(),
    expected: {
      subtotal: 200,
      desconto: 0,
      frete: 0,
      freteGratis: true,
      valorFaltanteFreteGratis: 0,
      total: 200,
    },
  },
  {
    name: 'acima do limite',
    tags: ['@API-04', '@CA06', '@CA11'],
    payload: new CartBuilder().add(products.tenis.id).add(products.meias.id).build(),
    expected: {
      subtotal: 219.8,
      desconto: 0,
      frete: 0,
      freteGratis: true,
      valorFaltanteFreteGratis: 0,
      total: 219.8,
    },
  },
];

test.describe('API de cálculo do carrinho', () => {
  for (const testCase of freightCases) {
    test(`calcula frete ${testCase.name}`, { tag: testCase.tags }, async ({ storeApi }) => {
      test.fail(Boolean(testCase.knownBug), testCase.knownBug);

      const response = await storeApi.calculateCart(testCase.payload);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as CartCalculation;
      expect(body).toMatchObject(testCase.expected);
    });
  }

  test(
    'aplica cupom ignorando caixa e espaços',
    { tag: ['@API-05', '@CA01', '@CA02', '@CA08', '@CA09', '@CA11'] },
    async ({ storeApi }) => {
      const payload = new CartBuilder()
        .add(products.tenis.id)
        .add(products.meias.id)
        .withCoupon('  bemvindo10  ')
        .build();

      const response = await storeApi.calculateCart(payload);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as CartCalculation;
      expect(body).toMatchObject({
        subtotal: 219.8,
        desconto: 21.98,
        frete: 0,
        freteGratis: true,
        total: 197.82,
        cupom: {
          codigo: coupons.valid,
          aplicado: true,
        },
      });
    },
  );

  test(
    'informa cupom inválido sem aplicar desconto',
    { tag: ['@API-06', '@CA03'] },
    async ({ storeApi }) => {
      const payload = new CartBuilder()
        .add(products.mochila.id)
        .withCoupon(coupons.invalid)
        .build();

      const response = await storeApi.calculateCart(payload);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as CartCalculation;
      expect(body.desconto).toBe(0);
      expect(body.cupom).toMatchObject({
        aplicado: false,
        mensagem: 'Cupom inválido.',
      });
    },
  );

  test(
    'informa cupom expirado sem aplicar desconto',
    { tag: ['@API-07', '@CA04'] },
    async ({ storeApi }) => {
      const payload = new CartBuilder()
        .add(products.mochila.id)
        .withCoupon(coupons.expired)
        .build();

      const response = await storeApi.calculateCart(payload);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as CartCalculation;
      expect(body.desconto).toBe(0);
      expect(body.cupom).toMatchObject({
        aplicado: false,
        mensagem: 'Cupom expirado.',
      });
    },
  );

  test(
    'rejeita quantidade maior que cinco',
    { tag: ['@API-08', '@CA10', '@bug-BUG-002'] },
    async ({ storeApi }) => {
      test.fail(true, 'BUG-002: a API deveria rejeitar quantidades maiores que cinco.');

      const response = await storeApi.calculateCart(
        new CartBuilder().add(products.mochila.id, 6).build(),
      );

      expect(response.status()).toBe(422);
      const body = (await response.json()) as ApiErrorBody;
      expect(body.erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
    },
  );

  test(
    'rejeita produto duplicado na lista',
    { tag: ['@API-09', '@validacao'] },
    async ({ storeApi }) => {
      const response = await storeApi.calculateCart(
        new CartBuilder().add(products.mochila.id).add(products.mochila.id).build(),
      );

      expect(response.status()).toBe(422);
      const body = (await response.json()) as ApiErrorBody;
      expect(body.erro.codigo).toBe('ITEM_DUPLICADO');
    },
  );
});
