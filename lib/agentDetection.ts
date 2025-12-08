/**
 * Agent Detection Utility
 * Identifies AI bots, shopping bots, and other automated agents
 */

export interface AgentInfo {
  name: string;
  type: 'ai_bot' | 'search_engine' | 'shopping_bot' | 'crawler' | 'unknown';
  isAgent: boolean;
  userAgent: string;
}

// Known AI bots and their user agent patterns
const AI_BOTS = [
  { name: 'GPTBot', pattern: /GPTBot/i, type: 'ai_bot' as const },
  { name: 'ChatGPT-User', pattern: /ChatGPT-User/i, type: 'ai_bot' as const },
  { name: 'PerplexityBot', pattern: /PerplexityBot/i, type: 'ai_bot' as const },
  { name: 'CCBot', pattern: /CCBot/i, type: 'ai_bot' as const },
  { name: 'anthropic-ai', pattern: /anthropic-ai/i, type: 'ai_bot' as const },
  { name: 'Anthropic-WebFetcher', pattern: /Anthropic-WebFetcher/i, type: 'ai_bot' as const },
  { name: 'Claude-Web', pattern: /Claude-Web/i, type: 'ai_bot' as const },
  { name: 'Google-Extended', pattern: /Google-Extended/i, type: 'ai_bot' as const },
  { name: 'Applebot-Extended', pattern: /Applebot-Extended/i, type: 'ai_bot' as const },
  { name: 'Bingbot', pattern: /bingbot/i, type: 'search_engine' as const },
  { name: 'Googlebot', pattern: /Googlebot/i, type: 'search_engine' as const },
  { name: 'Slurp', pattern: /Slurp/i, type: 'search_engine' as const },
  { name: 'DuckDuckBot', pattern: /DuckDuckBot/i, type: 'search_engine' as const },
  { name: 'Baiduspider', pattern: /Baiduspider/i, type: 'search_engine' as const },
  { name: 'YandexBot', pattern: /YandexBot/i, type: 'search_engine' as const },
  { name: 'Sogou', pattern: /Sogou/i, type: 'search_engine' as const },
  { name: 'Exabot', pattern: /Exabot/i, type: 'search_engine' as const },
  { name: 'facebot', pattern: /facebot/i, type: 'search_engine' as const },
  { name: 'ia_archiver', pattern: /ia_archiver/i, type: 'crawler' as const },
  { name: 'archive.org_bot', pattern: /archive.org_bot/i, type: 'crawler' as const },
];

// Shopping bots and price comparison engines
const SHOPPING_BOTS = [
  { name: 'GoogleShoppingBot', pattern: /GoogleShoppingBot/i, type: 'shopping_bot' as const },
  { name: 'PriceGrabber', pattern: /PriceGrabber/i, type: 'shopping_bot' as const },
  { name: 'Shopzilla', pattern: /Shopzilla/i, type: 'shopping_bot' as const },
  { name: 'NexTagBot', pattern: /NexTagBot/i, type: 'shopping_bot' as const },
  { name: 'ShoppingBot', pattern: /ShoppingBot/i, type: 'shopping_bot' as const },
  { name: 'ShopBot', pattern: /ShopBot/i, type: 'shopping_bot' as const },
];

// Generic bot patterns
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /fetcher/i,
  /indexer/i,
];

/**
 * Detect agent from user agent string
 */
export function detectAgent(userAgent: string | null | undefined): AgentInfo {
  if (!userAgent) {
    return {
      name: 'Unknown',
      type: 'unknown',
      isAgent: false,
      userAgent: userAgent || '',
    };
  }

  // Check AI bots first
  for (const bot of AI_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return {
        name: bot.name,
        type: bot.type,
        isAgent: true,
        userAgent,
      };
    }
  }

  // Check shopping bots
  for (const bot of SHOPPING_BOTS) {
    if (bot.pattern.test(userAgent)) {
      return {
        name: bot.name,
        type: bot.type,
        isAgent: true,
        userAgent,
      };
    }
  }

  // Check generic bot patterns
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return {
        name: 'Generic Bot',
        type: 'crawler',
        isAgent: true,
        userAgent,
      };
    }
  }

  // Human user
  return {
    name: 'Human',
    type: 'unknown',
    isAgent: false,
    userAgent,
  };
}

/**
 * Check if user agent is a known AI bot
 */
export function isAIBot(userAgent: string | null | undefined): boolean {
  const agent = detectAgent(userAgent);
  return agent.type === 'ai_bot';
}

/**
 * Check if user agent is a shopping bot
 */
export function isShoppingBot(userAgent: string | null | undefined): boolean {
  const agent = detectAgent(userAgent);
  return agent.type === 'shopping_bot';
}

/**
 * Get agent name for analytics
 */
export function getAgentName(userAgent: string | null | undefined): string {
  return detectAgent(userAgent).name;
}

