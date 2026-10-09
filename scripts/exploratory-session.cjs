const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseURL = process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';
const evidenceDate = process.env.EVIDENCE_DATE ?? dateInTimeZone(new Date(), 'America/Sao_Paulo');
const outputDir = path.resolve(__dirname, '..', 'docs', 'evidencias', evidenceDate, 'exploratory');

function dateInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));

  return `${value.year}-${value.month}-${value.day}`;
}

function containsExactly(actual, expected) {
  return actual.length === expected.length && expected.every((message) => actual.includes(message));
}

async function addProduct(page, productName, times = 1) {
  const card = page.getByRole('article', { name: productName });
  const button = card.getByRole('button', { name: 'Adicionar ao carrinho' });

  for (let index = 0; index < times; index += 1) {
    await button.click();
  }
}

async function summary(page) {
  const root = page.getByRole('region', { name: 'Resumo do pedido' });
  const value = (field) => root.locator(`[data-valor="${field}"]`).innerText();

  return {
    subtotal: await value('subtotal'),
    desconto: await value('desconto'),
    frete: await value('frete'),
    total: await value('total'),
  };
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });

  let browser;
  let context;
  let secondContext;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    const page = await context.newPage();
    const observations = [];

    await page.goto(baseURL);
    await page.getByRole('article', { name: 'Mochila Urbana 20L' }).waitFor({ state: 'visible' });
    const productCards = await page.getByRole('article').count();
    await addProduct(page, 'Mochila Urbana 20L', 2);
    const cartAccessibleName = await page.getByRole('link', { name: /Carrinho/ }).innerText();
    await page.reload();
    await page.getByRole('link', { name: /Carrinho/ }).waitFor({ state: 'visible' });
    const cartAfterReload = await page.getByRole('link', { name: /Carrinho/ }).innerText();
    const persistedQuantity = Number(cartAfterReload.match(/\d+/)?.[0]);
    observations.push({
      id: 'EXP-01',
      titulo: 'Catálogo e persistência do carrinho na mesma aba',
      observado: {
        quantidadeCartoesProduto: productCards,
        textoCarrinho: cartAccessibleName,
        textoCarrinhoAposRecarregar: cartAfterReload,
      },
      resultado: productCards === 8 && persistedQuantity === 2 ? 'PASSOU' : 'FALHOU',
    });

    await page.getByRole('link', { name: /Carrinho/ }).click();
    const freightSummary = await summary(page);
    const missingFreightMessage = page.getByText(/Faltam R\$/);
    const missingFreightText = (await missingFreightMessage.isVisible())
      ? await missingFreightMessage.innerText()
      : null;
    await page.screenshot({
      path: path.join(outputDir, 'frete-no-limite.png'),
      fullPage: true,
    });
    observations.push({
      id: 'EXP-02',
      titulo: 'Limite exato do frete grátis',
      observado: { ...freightSummary, mensagem: missingFreightText },
      resultado:
        freightSummary.subtotal === 'R$ 200,00' && freightSummary.frete === 'Grátis'
          ? 'PASSOU'
          : 'FALHOU',
    });

    const quantityGroup = page.getByRole('group', {
      name: 'Quantidade de Mochila Urbana 20L',
    });
    const increaseButton = quantityGroup.getByRole('button', {
      name: 'Aumentar quantidade de Mochila Urbana 20L',
    });
    await increaseButton.click();
    await increaseButton.click();
    await increaseButton.click();
    const quantity = await quantityGroup
      .getByRole('status', { name: 'Quantidade de Mochila Urbana 20L' })
      .innerText();
    const increaseDisabled = await increaseButton.isDisabled();
    observations.push({
      id: 'EXP-03',
      titulo: 'Limite de cinco unidades na interface',
      observado: {
        quantidade: quantity,
        botaoAumentarDesabilitado: increaseDisabled,
      },
      resultado: quantity === '5' && increaseDisabled ? 'PASSOU' : 'FALHOU',
    });

    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(baseURL);
    await addProduct(page, 'Tênis Casual Urbano');
    await addProduct(page, 'Kit 3 Pares de Meias');
    await page.getByRole('link', { name: /Carrinho/ }).click();
    await page.getByLabel('Cupom de desconto', { exact: true }).fill('  bemvindo10  ');
    await page.getByRole('button', { name: 'Aplicar cupom' }).click();
    await page.waitForFunction(
      () => document.querySelector('[data-valor="desconto"]')?.textContent?.trim() === '- R$ 21,98',
    );
    const validCouponSummary = await summary(page);
    const validCouponMessage = await page.getByText(/Cupom BEMVINDO10 aplicado/).innerText();
    const removeCouponButton = page.getByRole('button', { name: 'Remover cupom' });
    await removeCouponButton.waitFor({ state: 'visible' });
    const removeCouponVisible = await removeCouponButton.isVisible();
    observations.push({
      id: 'EXP-04',
      titulo: 'Cupom válido com espaços e letras minúsculas',
      observado: {
        ...validCouponSummary,
        mensagem: validCouponMessage,
        botaoRemoverCupomVisivel: removeCouponVisible,
      },
      resultado:
        validCouponSummary.desconto === '- R$ 21,98' &&
        validCouponSummary.total === 'R$ 197,82' &&
        removeCouponVisible
          ? 'PASSOU'
          : 'FALHOU',
    });

    await page.getByRole('button', { name: 'Remover cupom' }).click();
    await page.getByLabel('Cupom de desconto', { exact: true }).fill('VERAO2026');
    await page.getByRole('button', { name: 'Aplicar cupom' }).click();
    const expiredCouponMessage = await page.getByText('Cupom expirado.').innerText();
    const expiredCouponSummary = await summary(page);
    observations.push({
      id: 'EXP-05',
      titulo: 'Remoção e troca por cupom expirado',
      observado: { ...expiredCouponSummary, mensagem: expiredCouponMessage },
      resultado:
        expiredCouponMessage === 'Cupom expirado.' && expiredCouponSummary.desconto === 'R$ 0,00'
          ? 'PASSOU'
          : 'FALHOU',
    });

    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto(baseURL);
    await addProduct(page, 'Mochila Urbana 20L');
    await page.getByRole('link', { name: /Carrinho/ }).click();
    await page.getByRole('link', { name: 'Finalizar compra' }).click();
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    const requiredMessages = await page
      .getByText(/Informe (o nome completo|o e-mail|o CEP)\./)
      .allInnerTexts();
    observations.push({
      id: 'EXP-06',
      titulo: 'Campos obrigatórios do checkout',
      observado: { mensagensCamposObrigatorios: requiredMessages },
      resultado: containsExactly(requiredMessages, [
        'Informe o nome completo.',
        'Informe o e-mail.',
        'Informe o CEP.',
      ])
        ? 'PASSOU'
        : 'FALHOU',
    });

    await page.getByLabel('Nome completo', { exact: true }).fill('Maria');
    await page.getByLabel('E-mail', { exact: true }).fill('email-invalido');
    await page.getByLabel('CEP', { exact: true }).fill('123');
    await page.getByRole('button', { name: 'Confirmar pedido' }).click();
    const formatMessages = await page
      .getByText(/Informe (nome e sobrenome|um e-mail válido|um CEP com 8 dígitos)\./)
      .allInnerTexts();
    observations.push({
      id: 'EXP-07',
      titulo: 'Formatos inválidos dos dados do cliente',
      observado: { mensagensFormatoInvalido: formatMessages },
      resultado: containsExactly(formatMessages, [
        'Informe nome e sobrenome.',
        'Informe um e-mail válido.',
        'Informe um CEP com 8 dígitos.',
      ])
        ? 'PASSOU'
        : 'FALHOU',
    });

    secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    await secondPage.goto(`${baseURL}/carrinho`);
    const emptyCartMessage = secondPage.getByText(/carrinho está vazio/i);
    await emptyCartMessage.waitFor({ state: 'visible' });
    const emptyCartVisible = await emptyCartMessage.isVisible();
    observations.push({
      id: 'EXP-08',
      titulo: 'Isolamento do carrinho em uma nova sessão',
      observado: { carrinhoVazioVisivel: emptyCartVisible },
      resultado: emptyCartVisible ? 'PASSOU' : 'FALHOU',
    });

    const result = {
      executadoEm: evidenceDate,
      executadoEmIso: new Date().toISOString(),
      ambiente: baseURL,
      navegador: 'Chromium (Playwright)',
      modo: 'Sessão exploratória assistida, fora da suíte Playwright Test',
      observacoes: observations,
    };

    const resultPath = path.join(outputDir, 'session-results.json');
    fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await secondContext?.close();
    await context?.close();
    await browser?.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
