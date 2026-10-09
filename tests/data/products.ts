import type { ProductId } from '../types/store';

type TestProduct = {
  id: ProductId;
  name: string;
  price: number;
};

export const products = {
  camiseta: { id: 'P001', name: 'Camiseta Essencial', price: 59.9 },
  calca: { id: 'P002', name: 'Calça Jeans Slim', price: 139.9 },
  tenis: { id: 'P003', name: 'Tênis Casual Urbano', price: 189.9 },
  bone: { id: 'P004', name: 'Boné Aba Curva', price: 49.9 },
  mochila: { id: 'P005', name: 'Mochila Urbana 20L', price: 100 },
  meias: { id: 'P006', name: 'Kit 3 Pares de Meias', price: 29.9 },
  jaqueta: { id: 'P007', name: 'Jaqueta Corta-Vento', price: 229.9 },
  garrafa: { id: 'P008', name: 'Garrafa Térmica 750ml', price: 50 },
} as const satisfies Record<string, TestProduct>;

export const coupons = {
  valid: 'BEMVINDO10',
  expired: 'VERAO2026',
  invalid: 'NAOEXISTE',
} as const;
