import type { Locator, Page } from '@playwright/test';

type ConfirmationLabel = 'Subtotal' | 'Desconto' | 'Frete' | 'Total';

const confirmationField: Record<ConfirmationLabel, string> = {
  Subtotal: 'subtotal',
  Desconto: 'desconto',
  Frete: 'frete',
  Total: 'total',
};

export class OrderConfirmationPage {
  readonly title: Locator;
  readonly orderNumber: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByText(/Pedido confirmado/i);
    this.orderNumber = page.getByText(/VZ-\d{6}/);
  }

  value(label: ConfirmationLabel): Locator {
    return this.page.locator(`[data-valor="${confirmationField[label]}"]`);
  }
}
