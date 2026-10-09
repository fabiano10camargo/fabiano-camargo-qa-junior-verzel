import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class CatalogPage {
  readonly header: HeaderComponent;
  readonly productCards: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.productCards = page.getByRole('article');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  productCard(productName: string): Locator {
    return this.page.getByRole('article', { name: productName });
  }

  async addProduct(productName: string, times = 1): Promise<void> {
    const button = this.productCard(productName).getByRole('button', {
      name: 'Adicionar ao carrinho',
    });

    for (let index = 0; index < times; index += 1) {
      await button.click();
    }
  }
}
