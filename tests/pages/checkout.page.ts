import type { Locator, Page } from '@playwright/test';
import { OrderSummaryComponent } from '../components/order-summary.component';
import type { Customer } from '../types/store';

export class CheckoutPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly cepInput: Locator;
  readonly submitButton: Locator;
  readonly summary: OrderSummaryComponent;

  constructor(page: Page) {
    this.nameInput = page.getByLabel('Nome completo', { exact: true });
    this.emailInput = page.getByLabel('E-mail', { exact: true });
    this.cepInput = page.getByLabel('CEP', { exact: true });
    this.submitButton = page.getByRole('button', { name: 'Confirmar pedido' });
    this.summary = new OrderSummaryComponent(page);
  }

  async fillCustomer(customer: Customer): Promise<void> {
    await this.nameInput.fill(customer.nome);
    await this.emailInput.fill(customer.email);
    await this.cepInput.fill(customer.cep);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
