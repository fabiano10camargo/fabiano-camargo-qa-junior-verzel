import type { Locator, Page } from '@playwright/test';

type SummaryLabel = 'Subtotal' | 'Desconto' | 'Frete' | 'Total';

const summaryField: Record<SummaryLabel, string> = {
  Subtotal: 'subtotal',
  Desconto: 'desconto',
  Frete: 'frete',
  Total: 'total',
};

export class OrderSummaryComponent {
  readonly root: Locator;
  readonly remainingForFreeShippingMessage: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('region', { name: 'Resumo do pedido' });
    this.remainingForFreeShippingMessage = this.root.getByText(/Faltam R\$/);
  }

  value(label: SummaryLabel): Locator {
    return this.root.locator(`[data-valor="${summaryField[label]}"]`);
  }
}
