import { test as base } from '@playwright/test';
import { StoreApi } from '../clients/store-api';
import { CartPage } from '../pages/cart.page';
import { CatalogPage } from '../pages/catalog.page';
import { CheckoutPage } from '../pages/checkout.page';
import { OrderConfirmationPage } from '../pages/order-confirmation.page';

type StoreFixtures = {
  storeApi: StoreApi;
  catalogPage: CatalogPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
};

export const test = base.extend<StoreFixtures>({
  storeApi: async ({ request }, use) => {
    await use(new StoreApi(request));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
});

export { expect } from '@playwright/test';
