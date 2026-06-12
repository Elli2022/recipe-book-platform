import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Receptbok smoke", () => {
  test("warmup: static routes load first", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /varför receptbok/i })).toBeVisible();
    await page.goto("/login");
    await expect(page.getByLabel(/e-post/i)).toBeVisible();
  });

  test("home loads browse UI and branding", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await expect(page.getByRole("link", { name: "Receptbok" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", {
        name: /matinspiration för vardag och helg/i,
      })
    ).toBeVisible();
    await expect(page.getByPlaceholder(/sök recept/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Frukost" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vegetariskt" })).toBeVisible();
  });

  test("recipe library page responds", async ({ page }) => {
    await page.goto("/recept", { waitUntil: "load" });
    await expect(page.getByPlaceholder(/sök recept/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/den-har-rutten-finns-inte");
    await expect(
      page.getByRole("heading", { name: /sidan hittades inte/i })
    ).toBeVisible();
  });
});
