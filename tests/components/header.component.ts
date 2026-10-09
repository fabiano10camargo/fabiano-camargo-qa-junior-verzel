import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.cartLink = page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: /^Carrinho/ });
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
