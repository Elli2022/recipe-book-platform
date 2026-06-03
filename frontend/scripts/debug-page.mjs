import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (error) => console.error("pageerror:", error.message));
page.on("console", (msg) => {
  if (msg.type() === "error") {
    console.error("console:", msg.text());
  }
});
const response = await page.goto(url, { waitUntil: "load", timeout: 30_000 });
console.log("status:", response?.status());
console.log("title:", await page.title());
console.log("body:", (await page.locator("body").innerText()).slice(0, 400));
await browser.close();
