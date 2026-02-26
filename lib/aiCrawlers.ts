/**
 * AI crawler detection for logging.
 * Detects the six specified AI crawlers by User-Agent.
 */

const AI_CRAWLER_PATTERNS: ReadonlyArray<RegExp> = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /ClaudeBot/i,
  /Claude-Web/i,
  /anthropic-ai/i,
  /Anthropic-WebFetcher/i,
  /PerplexityBot/i,
  /Googlebot/i,
  /bingbot/i,
];

/**
 * Returns true if the User-Agent is one of: GPTBot, ChatGPT-User, ClaudeBot,
 * PerplexityBot, Googlebot, Bingbot (and common variants like Claude-Web).
 */
export function isAICrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent || typeof userAgent !== 'string') {
    return false;
  }
  return AI_CRAWLER_PATTERNS.some((pattern) => pattern.test(userAgent));
}
