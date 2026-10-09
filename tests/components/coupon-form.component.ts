import type { Locator, Page } from '@playwright/test';

export class CouponFormComponent {
  readonly input: Locator;
  readonly applyButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    this.input = page.getByLabel('Cupom de desconto', { exact: true });
    this.applyButton = page.getByRole('button', { name: 'Aplicar cupom' });
    this.removeButton = page.getByRole('button', { name: 'Remover cupom' });
  }

  async apply(code: string): Promise<void> {
    await this.input.fill(code);
    await this.applyButton.click();
  }

  async remove(): Promise<void> {
    await this.removeButton.click();
  }
}
