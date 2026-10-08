import { expect, test, type Page } from "@playwright/test";

const siteName = "Results Summary";
const siteUrl = "https://results-summary.royeradames.com/";

async function box(page: Page, selector: string) {
  const found = await page.locator(selector).first().boundingBox();
  if (!found) throw new Error(`${selector} has no box`);
  return found;
}

test("declares one site name in og:site_name and WebSite JSON-LD, with canonical, Open Graph image and icons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", siteName);
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl });
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/results-summary\.royeradames\.com\/?$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Results Summary/);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  for (const href of await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href))) {
    expect((await page.request.get(href)).status(), href).toBe(200);
  }
});

test("desktop frame: the 736 x 512 card is centred in the 1440 x 1080 viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("/");
  const card = await box(page, ".results-card");
  expect(card.width).toBe(736);
  expect(Math.abs(card.height - 512)).toBeLessThanOrEqual(8);
  expect(Math.abs(card.x - 352)).toBeLessThanOrEqual(1);
  expect(Math.abs(card.y - 284)).toBeLessThanOrEqual(6);
  const result = await box(page, ".result-panel");
  expect(result.width).toBe(368);
  await expect(page.locator(".results-card")).toHaveCSS("border-radius", "32px");
  await expect(page.locator(".continue-disclosure summary")).toHaveCSS("background-color", "rgb(48, 59, 89)");
  const continueBox = await box(page, ".continue-disclosure summary");
  expect([continueBox.width, continueBox.height]).toEqual([288, 56]);
});

test("tablet frame: side by side, 686 px wide with 41 px gutters at 768", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1080 });
  await page.goto("/");
  const card = await box(page, ".results-card");
  expect(Math.abs(card.width - 686)).toBeLessThanOrEqual(2);
  expect(Math.abs(card.x - 41)).toBeLessThanOrEqual(1);
  const result = await box(page, ".result-panel");
  const summary = await box(page, ".summary-panel");
  expect(Math.abs(result.y - summary.y)).toBeLessThanOrEqual(1);
});

test("mobile frame follows the 375 px design", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 809 });
  await page.goto("/");
  const result = await box(page, ".result-panel");
  expect([result.x, result.y, result.width]).toEqual([0, 0, 375]);
  expect((await box(page, ".overall-score")).width).toBe(140);
  await expect(page.locator(".result-panel")).toHaveCSS("box-shadow", "rgba(61, 108, 236, 0.15) 0px 30px 60px 0px");
  const summary = await box(page, ".summary-panel h2");
  expect(summary.x).toBe(30);
  expect(Math.abs(summary.y - 380)).toBeLessThanOrEqual(6);
});

test("width sweep 320 to 1600 px in 10 px steps: no page scroll, 16 px floor, rows keep the score beside the label", async ({ page }) => {
  await page.goto("/");
  const failures: string[] = [];
  for (let width = 320; width <= 1600; width += 10) {
    await page.setViewportSize({ width, height: 900 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) failures.push(`${width}: page scroll`);
    const small = await page.evaluate(() => [...document.querySelectorAll("h1, h2, p, dt, dd, span, strong, summary, a")].filter((node) => node.getClientRects().length && parseFloat(getComputedStyle(node).fontSize) < 16).map((node) => node.textContent));
    if (small.length) failures.push(`${width}: small text ${small.join(" | ")}`);
    const split = await page.locator(".category-result").evaluateAll((rows) => rows.filter((row) => {
      const [label, score] = [row.querySelector("dt")!.getBoundingClientRect(), row.querySelector("dd")!.getBoundingClientRect()];
      return Math.abs(label.top + label.height / 2 - (score.top + score.height / 2)) > 2;
    }).map((row) => row.querySelector("dt")!.textContent));
    if (split.length) failures.push(`${width}: score off the label row ${split.join(", ")}`);
  }
  expect(failures).toEqual([]);
});
