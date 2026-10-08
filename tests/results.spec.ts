import { expect, test } from "@playwright/test";

test("renders the supplied category scores and correct product identity", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle("Results Summary | Royer Adames");
  await expect(page.getByRole("heading", { level: 1, name: "Your Result" })).toBeVisible();
  await expect(page.locator(".overall-score strong")).toHaveText("76");
  for (const [category, score] of [["Reaction", "80"], ["Memory", "92"], ["Verbal", "61"], ["Visual", "72"]]) {
    const row = page.locator(".category-result").filter({ hasText: category });
    await expect(row.locator("dt")).toHaveText(category);
    await expect(row.locator("dd")).toHaveText(score + " / 100");
  }
  await expect(page.getByRole("button", { name: /login|logout/i })).toHaveCount(0);
  await expect(page.getByText("WeatherBound")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Continue exposes an honest sample endpoint with native keyboard controls", async ({ page }) => {
  await page.goto("/");
  const continuation = page.locator(".continue-disclosure > summary");
  await continuation.focus();
  await expect(continuation).toBeFocused();
  expect(await continuation.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await continuation.press("Enter");
  await expect(page.getByText("This is the end of the sample. No assessment is connected and no result is stored.")).toBeVisible();
  await continuation.press("Space");
  await expect(page.locator(".continue-disclosure")).not.toHaveAttribute("open");
  await expect(continuation).toBeFocused();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test("preserves legible content at reference and family widths", async ({ page }) => {
  for (const width of [375, 400, 640, 641, 667, 700, 767, 768, 1024, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(".category-result")).toHaveCount(4);
    expect(await page.locator("p, dt, dd, footer, summary").evaluateAll(elements => elements.every(element => parseFloat(getComputedStyle(element).fontSize) >= 16))).toBe(true);
    const control = await page.locator(".continue-disclosure > summary").boundingBox();
    expect(control?.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe("without scripts", () => {
  test.use({ javaScriptEnabled: false });
  test("the complete summary and Continue remain usable without transmitting data", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".category-result")).toHaveCount(4);
    const requests: string[] = [];
    page.on("request", request => requests.push(request.url()));
    await page.locator(".continue-disclosure > summary").press("Enter");
    await expect(page.locator(".continue-disclosure")).toHaveAttribute("open", "");
    expect(requests).toEqual([]);
    expect(new URL(page.url()).pathname).toBe("/");
  });
});
