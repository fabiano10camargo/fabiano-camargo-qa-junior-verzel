import type { Locator, Page } from '@playwright/test';

export class QuantityControlComponent {
  readonly group: Locator;
  readonly decreaseButton: Locator;
  readonly increaseButton: Locator;
  readonly status: Locator;

  constructor(page: Page, productName: string) {
    this.group = page.getByRole('group', {
      name: `Quantidade de ${productName}`,
    });
    this.decreaseButton = this.group.getByRole('button', {
      name: `Diminuir quantidade de ${productName}`,
    });
    this.increaseButton = this.group.getByRole('button', {
      name: `Aumentar quantidade de ${productName}`,
    });
    this.status = this.group.getByRole('status', {
      name: `Quantidade de ${productName}`,
    });
  }

  async increase(times = 1): Promise<void> {
    for (let index = 0; index < times; index += 1) {
      await this.increaseButton.click();
    }
  }

  async decrease(times = 1): Promise<void> {
    for (let index = 0; index < times; index += 1) {
      await this.decreaseButton.click();
    }
  }
}
