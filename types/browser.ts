import { Browser, BrowserContext } from "@playwright/test";

export interface BrowserResult {
  env: "LOCAL" | "BROWSERBASE" | "EXISTING_CHROME" | "EXTENSION";
  browser?: Browser;
  context: BrowserContext;
  debugUrl?: string;
  sessionUrl?: string;
  contextPath?: string;
  sessionId?: string;
}
