import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CalculateCartRequest, CreateOrderRequest } from '../types/store';

export class StoreApi {
  constructor(private readonly request: APIRequestContext) {}

  listProducts(): Promise<APIResponse> {
    return this.request.get('/api/produtos');
  }

  getProduct(id: string): Promise<APIResponse> {
    return this.request.get(`/api/produtos/${encodeURIComponent(id)}`);
  }

  calculateCart(payload: CalculateCartRequest): Promise<APIResponse> {
    return this.request.post('/api/carrinho/calcular', {
      data: payload,
    });
  }

  createOrder(payload: CreateOrderRequest): Promise<APIResponse> {
    return this.request.post('/api/pedidos', {
      data: payload,
    });
  }
}
