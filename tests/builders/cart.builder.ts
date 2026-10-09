import type { CalculateCartRequest, CartItemInput, ProductId } from '../types/store';

export class CartBuilder {
  private readonly items: CartItemInput[] = [];
  private couponCode?: string;

  add(productId: ProductId, quantity = 1): this {
    this.items.push({ produtoId: productId, quantidade: quantity });
    return this;
  }

  withCoupon(code: string): this {
    this.couponCode = code;
    return this;
  }

  build(): CalculateCartRequest {
    return {
      itens: this.items.map((item) => ({ ...item })),
      ...(this.couponCode === undefined ? {} : { cupom: this.couponCode }),
    };
  }
}
