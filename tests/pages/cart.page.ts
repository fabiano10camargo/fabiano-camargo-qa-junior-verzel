import type { Locator, Page } from '@playwright/test';
import { CouponFormComponent } from '../components/coupon-form.component';
import { HeaderComponent } from '../components/header.component';
import { OrderSummaryComponent } from '../components/order-summary.component';
import { QuantityControlComponent } from '../components/quantity-control.component';

export class CartPage {
  readonly header: HeaderComponent;
  readonly coupon: CouponFormComponent;
  readonly summary: OrderSummaryComponent;
  readonly emptyCartButton: Locator;
  readonly checkoutLink: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.coupon = new CouponFormComponent(page);
    this.summary = new OrderSummaryComponent(page);
    this.emptyCartButton = page.getByRole('button', { name: 'Esvaziar carrinho' });
    this.checkoutLink = page.getByRole('link', { name: 'Finalizar compra' });
  }

  async open(): Promise<void> {
    await this.page.goto('/carrinho');
  }

  itemHeading(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName, level: 3 });
  }

  quantity(productName: string): QuantityControlComponent {
    return new QuantityControlComponent(this.page, productName);
  }

  removeButton(productName: string): Locator {
    return this.page.getByRole('button', {
      name: `Remover ${productName} do carrinho`,
    });
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }
}
