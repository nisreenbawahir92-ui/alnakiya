/** SEO scrapers and AI crawlers that burn Vercel edge requests without sending customers. */
const BLOCKED_BOT =
  /ahrefsbot|semrushbot|dotbot|petalbot|bytespider|mj12bot|blexbot|dataforseo|gptbot|chatgpt-user|claudebot|ccbot|meta-externalagent|applebot-extended|imagesiftbot|scrapy|serpstatbot|rogerbot|megaindex|seokicks|blexbot|linkdexbot|spbot|360spider|sogou|yisouspider|python-requests|go-http-client|curl\/|wget\/|java\/|libwww-perl|node-fetch|axios/i;

/** Real search / social preview crawlers — always allow. */
const ALLOWED_BOT =
  /googlebot|bingbot|duckduckbot|slurp|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|applebot(?!-extended)/i;

export function isBlockedBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  if (ALLOWED_BOT.test(userAgent)) return false;
  return BLOCKED_BOT.test(userAgent);
}
