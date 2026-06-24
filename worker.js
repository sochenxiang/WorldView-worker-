const CATEGORIES = ['general', 'politics', 'finance', 'tech', 'environment', 'health', 'science', 'culture'];
const REGIONS = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Oceania'];
const PER_REGION_LIMIT = 50;
const FEED_BATCH_SIZE = 4;
const MAX_NEWS_AGE_MS = 3 * 24 * 60 * 60 * 1000;
const CURSOR_KEY = 'scheduler:category-cursor';
const HASH_KEY_PREFIX = 'hash:';

const CATEGORY_QUERIES = {
  tech: 'artificial intelligence OR semiconductor OR technology OR cybersecurity OR cloud computing',
  politics: 'international politics OR diplomacy OR election OR geopolitics OR security',
  finance: 'global markets OR finance OR economy OR central bank OR stocks',
  general: 'world news OR breaking news OR society OR transport OR disaster',
  environment: 'climate change OR environment OR renewable energy OR carbon OR biodiversity',
  health: 'public health OR medicine OR vaccine OR hospital OR disease',
  science: 'science OR space OR astronomy OR physics OR genetics',
  culture: 'culture OR arts OR film OR music OR museum OR heritage'
};

const REGION_QUERIES = {
  'North America': 'North America OR United States OR Canada OR Mexico OR Washington OR New York OR California OR Toronto',
  Europe: 'Europe OR European Union OR UK OR Germany OR France OR Italy OR Spain OR Ukraine OR Brussels',
  Asia: 'Asia OR China OR Japan OR India OR South Korea OR Singapore OR Indonesia OR Vietnam OR Thailand OR Philippines',
  Africa: 'Africa OR African Union OR Nigeria OR Kenya OR South Africa OR Egypt OR Ethiopia OR Ghana OR Morocco OR Tanzania',
  'South America': 'South America OR Latin America OR Brazil OR Argentina OR Chile OR Colombia OR Peru OR Venezuela',
  Oceania: 'Oceania OR Australia OR New Zealand OR Pacific Islands OR Fiji OR Papua New Guinea OR Sydney OR Wellington'
};

const CATEGORY_KEYWORDS = {
  tech: ['ai', 'artificial', 'intelligence', 'chip', 'semiconductor', 'cloud', 'cyber', 'software', 'robot', 'quantum', 'technology'],
  politics: ['election', 'government', 'minister', 'president', 'diplomacy', 'war', 'conflict', 'security', 'sanction', 'policy'],
  finance: ['market', 'stocks', 'shares', 'bond', 'rate', 'inflation', 'central bank', 'economy', 'bank', 'oil', 'gold', 'currency'],
  general: ['breaking', 'world', 'disaster', 'transport', 'strike', 'court', 'police', 'city', 'weather'],
  environment: ['climate', 'carbon', 'emissions', 'energy', 'renewable', 'wildfire', 'flood', 'biodiversity', 'pollution'],
  health: ['health', 'hospital', 'vaccine', 'virus', 'disease', 'medicine', 'drug', 'doctor', 'patient'],
  science: ['science', 'space', 'nasa', 'planet', 'physics', 'genetic', 'research', 'study', 'astronomy'],
  culture: ['film', 'art', 'music', 'museum', 'culture', 'book', 'heritage', 'festival', 'theatre']
};

const CATEGORY_EXCLUDE_KEYWORDS = {
  tech: ['promo code', 'coupon', 'discount', 'movie trailer', 'music festival', 'football', 'basketball'],
  politics: ['stock price', 'earnings', 'quarterly results', 'movie', 'music', 'celebrity', 'sports'],
  finance: ['football', 'basketball', 'movie', 'music', 'museum', 'vaccine trial', 'climate summit'],
  environment: ['business environment', 'desktop environment', 'investment climate', 'political climate'],
  health: ['health insurance stock', 'healthy profits', 'fitness gadget deal', 'coupon'],
  science: ['political science degree', 'science fiction', 'fiction', 'box office'],
  culture: ['cell culture', 'blood culture', 'agriculture', 'corporate culture earnings'],
  general: []
};

const SOURCE_WEIGHTS = {
  Reuters: 28, Bloomberg: 27, 'Associated Press': 26, 'AP News': 26, 'BBC News': 25, BBC: 25, 'Financial Times': 25,
  'The Guardian': 23, 'Al Jazeera': 22, 'France 24': 21, NPR: 20, CNBC: 20, MarketWatch: 18, 'The Verge': 18,
  Wired: 18, 'Ars Technica': 18, TechCrunch: 17, NASA: 18, WHO: 19, 'Google News': 16
};

const FALLBACK_FEEDS = {
  tech: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/technology/rss.xml'],
    ['The Verge', 'https://www.theverge.com/rss/index.xml'],
    ['Wired', 'https://www.wired.com/feed/rss'],
    ['Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index'],
    ['Engadget', 'https://www.engadget.com/rss.xml'],
    ['TechCrunch', 'https://techcrunch.com/feed/'],
    ['MIT Technology Review', 'https://www.technologyreview.com/feed/'],
    ['The Register', 'https://www.theregister.com/headlines.atom'],
    ['VentureBeat AI', 'https://venturebeat.com/category/ai/feed/'],
    ['Mashable Tech', 'https://mashable.com/feeds/rss/tech'],
    ['NYTimes Technology', 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'],
    ['CNN Technology', 'http://rss.cnn.com/rss/edition_technology.rss']
  ],
  politics: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
    ['Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml'],
    ['France 24', 'https://www.france24.com/en/rss'],
    ['NPR World', 'https://feeds.npr.org/1004/rss.xml'],
    ['UN News', 'https://news.un.org/feed/subscribe/en/news/all/rss.xml'],
    ['DW', 'https://rss.dw.com/rdf/rss-en-world'],
    ['The Guardian', 'https://www.theguardian.com/world/rss'],
    ['NYTimes World', 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'],
    ['CNN World', 'http://rss.cnn.com/rss/edition_world.rss'],
    ['CBC World', 'https://www.cbc.ca/cmlink/rss-world'],
    ['Sky News World', 'https://feeds.skynews.com/feeds/rss/world.xml'],
    ['Time', 'https://time.com/feed/']
  ],
  finance: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/business/rss.xml'],
    ['Financial Times', 'https://www.ft.com/rss/home'],
    ['NPR Business', 'https://feeds.npr.org/1006/rss.xml'],
    ['CNBC', 'https://www.cnbc.com/id/100003114/device/rss/rss.html'],
    ['MarketWatch', 'https://feeds.marketwatch.com/marketwatch/topstories/'],
    ['The Guardian Business', 'https://www.theguardian.com/uk/business/rss'],
    ['NYTimes Business', 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml'],
    ['CNN Business', 'http://rss.cnn.com/rss/edition_business.rss'],
    ['Yahoo Finance', 'https://finance.yahoo.com/news/rssindex'],
    ['Fortune', 'https://fortune.com/feed/']
  ],
  general: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
    ['Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml'],
    ['France 24', 'https://www.france24.com/en/rss'],
    ['NPR World', 'https://feeds.npr.org/1004/rss.xml'],
    ['UN News', 'https://news.un.org/feed/subscribe/en/news/all/rss.xml'],
    ['DW', 'https://rss.dw.com/rdf/rss-en-world'],
    ['The Guardian', 'https://www.theguardian.com/world/rss'],
    ['NYTimes World', 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'],
    ['CNN Top Stories', 'http://rss.cnn.com/rss/edition.rss'],
    ['CBC World', 'https://www.cbc.ca/cmlink/rss-world'],
    ['Sky News World', 'https://feeds.skynews.com/feeds/rss/world.xml'],
    ['Time', 'https://time.com/feed/']
  ],
  environment: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'],
    ['NASA Climate', 'https://climate.nasa.gov/news/rss.xml'],
    ['Yale Climate Connections', 'https://yaleclimateconnections.org/feed/'],
    ['The Guardian Environment', 'https://www.theguardian.com/environment/rss'],
    ['Carbon Brief', 'https://www.carbonbrief.org/feed/'],
    ['UN Climate', 'https://news.un.org/feed/subscribe/en/news/topic/climate-change/feed/rss.xml'],
    ['Mongabay', 'https://news.mongabay.com/feed/'],
    ['Inside Climate News', 'https://insideclimatenews.org/feed/'],
    ['NYTimes Climate', 'https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml']
  ],
  health: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/health/rss.xml'],
    ['WHO', 'https://www.who.int/rss-feeds/news-english.xml'],
    ['NPR Health', 'https://feeds.npr.org/103537970/rss.xml'],
    ['Medical Xpress', 'https://medicalxpress.com/rss-feed/'],
    ['ScienceDaily Health', 'https://www.sciencedaily.com/rss/health_medicine.xml'],
    ['NYTimes Health', 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml'],
    ['Medical News Today', 'https://www.medicalnewstoday.com/rss'],
    ['STAT News', 'https://www.statnews.com/feed/']
  ],
  science: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'],
    ['NASA', 'https://www.nasa.gov/rss/dyn/breaking_news.rss'],
    ['ScienceDaily', 'https://www.sciencedaily.com/rss/top/science.xml'],
    ['Phys.org', 'https://phys.org/rss-feed/'],
    ['Space.com', 'https://www.space.com/feeds/all'],
    ['Scientific American', 'https://www.scientificamerican.com/feed/'],
    ['Science News', 'https://www.sciencenews.org/feed'],
    ['Nature', 'https://www.nature.com/nature.rss'],
    ['NYTimes Science', 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml']
  ],
  culture: [
    ['BBC News', 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'],
    ['NPR Arts', 'https://feeds.npr.org/1008/rss.xml'],
    ['The Art Newspaper', 'https://www.theartnewspaper.com/rss.xml'],
    ['The Guardian Culture', 'https://www.theguardian.com/culture/rss'],
    ['Pitchfork', 'https://pitchfork.com/rss/news/'],
    ['NYTimes Arts', 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml'],
    ['Variety', 'https://variety.com/feed/'],
    ['Hollywood Reporter', 'https://www.hollywoodreporter.com/t/feed/'],
    ['Hyperallergic', 'https://hyperallergic.com/feed/']
  ]
};

const xmlDecodeMap = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const STOP_WORDS = new Set(['the','and','for','with','from','that','this','are','was','were','has','have','after','over','into','about','says','news','live','latest','update','updates','will','more','than','your','you','our']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/news') return handleNewsRequest(url, env);

    // Compatibility endpoint for the existing frontend. The Node version streams
    // NDJSON; the Worker cache version returns the final cached result as one
    // NDJSON line so assets/app.js can consume it without changes.
    if (url.pathname === '/api/news/stream') {
      const response = await handleNewsRequest(url, env);
      const data = await response.json();
      return new Response(`${JSON.stringify({ ...data, type: 'final', done: true })}\n`, {
        headers: {
          'Content-Type': 'application/x-ndjson; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    }

    if (url.pathname === '/api/health') return json({ ok: true, service: 'WorldView Worker', time: new Date().toISOString() });
    if (url.pathname === '/api/config') return json({ ok: true, categories: CATEGORIES, regions: REGIONS, perRegionLimit: PER_REGION_LIMIT });

    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(updateNextCategory(env));
  }
};

async function handleNewsRequest(url, env) {
  const category = normalizeCategory(url.searchParams.get('category') || 'general');
  const region = url.searchParams.get('region') || 'Global';
  const limit = clamp(Number(url.searchParams.get('limit') || (region === 'Global' ? 300 : 50)), 1, 300);
  const sort = url.searchParams.get('sort') === 'time' ? 'time' : 'heat';

  const cached = await env.NEWS_KV.get(newsKey(category), 'json');
  if (!cached) return json({ ok: true, cached: true, category, region, count: 0, articles: [], updatedAt: null, message: 'Cache warming in progress.' });

  const articles = region === 'Global'
    ? REGIONS.flatMap(item => (cached.regions?.[item] || []).slice(0, PER_REGION_LIMIT))
    : (cached.regions?.[region] || []);

  const sorted = articles
    .slice()
    .sort(sort === 'time' ? compareTimeThenHeat : compareHeatThenTime)
    .slice(0, limit)
    .map((article, index) => ({ ...article, hotRank: index + 1 }));

  return json({
    ok: true,
    cached: true,
    category,
    region,
    sort,
    updatedAt: cached.updatedAt,
    count: sorted.length,
    articles: sorted
  });
}

function randomInt(max) {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffleIndexes(length) {
  const indexes = Array.from({ length }, (_, index) => index);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

function getNextFeedBatch(category, fallbackFeeds, rssQueues = {}) {
  const existing = rssQueues[category] || {};
  let queue = Array.isArray(existing.queue) ? existing.queue.filter(index => index >= 0 && index < fallbackFeeds.length) : [];
  let cursor = Number(existing.cursor || 0);
  let cycle = Number(existing.cycle || 0);

  if (!queue.length || cursor >= queue.length) {
    queue = shuffleIndexes(fallbackFeeds.length);
    cursor = 0;
    cycle += 1;
  }

  const batchIndexes = queue.slice(cursor, cursor + FEED_BATCH_SIZE);
  const nextCursor = cursor + batchIndexes.length;
  rssQueues[category] = { queue, cursor: nextCursor, cycle };

  return {
    feedBatch: batchIndexes.map(index => fallbackFeeds[index]),
    batchIndexes,
    cursorBefore: cursor,
    cursorAfter: nextCursor,
    cycle,
    remainingInCycle: Math.max(0, queue.length - nextCursor),
    rssQueues
  };
}

async function updateNextCategory(env) {
  const cursor = await env.NEWS_KV.get(CURSOR_KEY, 'json').catch(() => null) || {
    categoryIndex: 0,
    rssQueues: {}
  };

  const category = CATEGORIES[cursor.categoryIndex % CATEGORIES.length];
  const fallbackFeeds = FALLBACK_FEEDS[category] || FALLBACK_FEEDS.general;
  const batch = getNextFeedBatch(category, fallbackFeeds, cursor.rssQueues || {});
  const existing = await env.NEWS_KV.get(newsKey(category), 'json').catch(() => null);

  const result = await buildCategoryCache(category, existing, batch.feedBatch, batch);
  const payload = JSON.stringify(result);
  const hash = await sha256(payload);
  const oldHash = await env.NEWS_KV.get(`${HASH_KEY_PREFIX}${category}`);

  if (hash !== oldHash) {
    await env.NEWS_KV.put(newsKey(category), payload);
    await env.NEWS_KV.put(`${HASH_KEY_PREFIX}${category}`, hash);
  }

  await env.NEWS_KV.put(CURSOR_KEY, JSON.stringify({
    categoryIndex: (cursor.categoryIndex + 1) % CATEGORIES.length,
    rssQueues: batch.rssQueues,
    lastUpdatedCategory: category,
    lastFeedBatchIndexes: batch.batchIndexes,
    lastFeedBatchSources: batch.feedBatch.map(([source]) => source),
    lastFeedBatchCycle: batch.cycle,
    remainingInCycle: batch.remainingInCycle,
    updatedAt: new Date().toISOString()
  }));
}

async function buildCategoryCache(category, existing, feedBatch, batchMeta) {
  const regions = {};
  const diagnostics = {};

  for (const region of REGIONS) {
    const existingRegionArticles = existing?.regions?.[region] || [];
    const articles = await fetchRegionCategory(category, region, feedBatch, existingRegionArticles);
    regions[region] = articles.slice(0, PER_REGION_LIMIT);
    diagnostics[region] = {
      count: regions[region].length,
      feedBatchSources: feedBatch.map(([source]) => source),
      feedBatchCycle: batchMeta.cycle,
      remainingInCycle: batchMeta.remainingInCycle
    };
  }

  return { ok: true, category, updatedAt: new Date().toISOString(), regions, diagnostics };
}

async function fetchRegionCategory(category, region, feedBatch, existingRegionArticles = []) {
  const categoryQuery = CATEGORY_QUERIES[category] || CATEGORY_QUERIES.general;
  const regionQuery = REGION_QUERIES[region];
  const feeds = [
    googleFeed(`Google News ${region} today`, `(${categoryQuery}) (${regionQuery}) when:1d`, region),
    googleFeed(`Google News ${region} 2d`, `(${categoryQuery}) (${regionQuery}) when:2d`, region),
    googleFeed(`Google News ${region} 3d`, `(${categoryQuery}) (${regionQuery}) when:3d`, region),
    ...feedBatch.map(([source, url]) => ({ source, url, trustRegion: false }))
  ];

  const results = await runLimited(feeds.map(feed => () => fetchFeed(feed, category, region)), 5);
  const freshArticles = results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
  const mergedArticles = [...freshArticles, ...existingRegionArticles];
  const filtered = dedupeArticles(mergedArticles)
    .filter(article => article.region === region)
    .filter(isAllowedDate)
    .filter(article => category === 'general' || scoreByRelevance(article, category) >= 8);

  const ranked = rankArticles(filtered, category);
  return ranked.slice(0, PER_REGION_LIMIT).map((article, index) => ({ ...article, hotRank: index + 1 }));
}

function googleFeed(source, query, region) {
  return { source, url: `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`, trustRegion: true };
}

async function fetchFeed(feed, category, requestedRegion) {
  const res = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WorldViewWorker/1.0)' } });
  if (!res.ok) throw new Error(`${feed.source} failed: ${res.status}`);
  const xml = await res.text();
  return parseRSS(xml, category, requestedRegion, feed.source, feed.trustRegion);
}

function parseRSS(xml, category, requestedRegion, fallbackSource, trustRegion) {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];
  return blocks.map((item, index) => {
    const rawTitle = pickTag(item, 'title');
    const source = pickSource(item, fallbackSource);
    const title = cleanTitle(rawTitle, source);
    const summary = stripTags(pickTag(item, 'description') || pickTag(item, 'summary') || pickTag(item, 'content'));
    const url = pickLink(item);
    const publishedRaw = stripTags(pickTag(item, 'pubDate') || pickTag(item, 'published') || pickTag(item, 'updated'));
    const region = trustRegion ? requestedRegion : inferRegion(`${title} ${summary}`, requestedRegion);

    return {
      id: stripTags(pickTag(item, 'guid') || pickTag(item, 'id')) || url || `${category}-${source}-${index}`,
      title,
      summary: summary || title,
      source,
      url,
      img: pickImage(item),
      category,
      region,
      regionLabel: region,
      publishedAt: normalizeDate(publishedRaw)
    };
  }).filter(article => article.title && article.url && isHttpUrl(article.url) && !isBlockedArticle(article));
}

function rankArticles(articles, category) {
  const ranked = articles
    .map(article => ({
      ...article,
      hotScore: Math.round(
        scoreByRecency(article.publishedAt) +
        scoreBySource(article.source) +
        scoreByRelevance(article, category) +
        (article.img ? 3 : 0)
      )
    }))
    .sort(compareFreshnessThenHeat);

  return dedupeSimilarEvents(ranked)
    .map((article, index) => ({ ...article, hotRank: index + 1 }));
}

function tokenizeTitle(title) {
  return normalizeText(title)
    .split(' ')
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function eventTokenSet(article) {
  return new Set(tokenizeTitle(`${article.title || ''} ${article.summary || ''}`).slice(0, 48));
}

function intersectionSize(a, b) {
  let count = 0;
  for (const value of a) if (b.has(value)) count++;
  return count;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  const intersection = intersectionSize(a, b);
  return intersection / (a.size + b.size - intersection);
}

function overlapRatio(a, b) {
  if (!a.size || !b.size) return 0;
  return intersectionSize(a, b) / Math.min(a.size, b.size);
}

function isSameEvent(a, b) {
  const titleA = new Set(tokenizeTitle(a.title));
  const titleB = new Set(tokenizeTitle(b.title));
  const titleShared = intersectionSize(titleA, titleB);
  const titleOverlap = overlapRatio(titleA, titleB);
  if (titleShared >= 3 && titleOverlap >= 0.33) return true;

  const tokensA = eventTokenSet(a);
  const tokensB = eventTokenSet(b);
  const shared = intersectionSize(tokensA, tokensB);
  const jac = jaccard(tokensA, tokensB);
  const overlap = overlapRatio(tokensA, tokensB);

  return (shared >= 3 && Math.max(jac, overlap * 0.86) >= 0.38) ||
    (shared >= 4 && jac >= 0.10);
}

function eventBlocks(article) {
  const titleTokens = tokenizeTitle(article.title);
  const allTokens = tokenizeTitle(`${article.title || ''} ${article.summary || ''}`);
  const preferred = [...new Set([...titleTokens, ...allTokens])]
    .filter(token => token.length >= 4 && !/^\d+$/.test(token))
    .slice(0, 10);
  const blocks = new Set();

  for (let i = 0; i < Math.min(preferred.length, 6); i++) blocks.add(`t:${preferred[i]}`);
  for (let i = 0; i < Math.min(preferred.length - 1, 5); i++) blocks.add(`p:${preferred[i]}|${preferred[i + 1]}`);

  return [...blocks];
}

function compareArticleQuality(a, b) {
  return Number(a.hotScore || 0) - Number(b.hotScore || 0) ||
    scoreBySource(a.source) - scoreBySource(b.source) ||
    new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime() ||
    Number(Boolean(a.img)) - Number(Boolean(b.img));
}

function toRelatedArticle(item) {
  return {
    title: item.title,
    summary: item.summary,
    source: item.source,
    url: item.url,
    img: item.img,
    publishedAt: item.publishedAt,
    hotScore: item.hotScore
  };
}

function dedupeSimilarEvents(rankedArticles) {
  const selected = [];
  const groups = [];
  const blockIndex = new Map();

  for (const article of rankedArticles) {
    const blocks = eventBlocks(article);
    const candidateIndexes = new Set();

    for (const block of blocks) {
      for (const index of blockIndex.get(block) || []) candidateIndexes.add(index);
    }

    let matchIndex = -1;
    for (const index of candidateIndexes) {
      if (isSameEvent(article, selected[index])) {
        matchIndex = index;
        break;
      }
    }

    if (matchIndex === -1) {
      const newIndex = selected.length;
      selected.push(article);
      groups.push([article]);
      for (const block of blocks) {
        if (!blockIndex.has(block)) blockIndex.set(block, []);
        blockIndex.get(block).push(newIndex);
      }
      continue;
    }

    groups[matchIndex].push(article);
    if (compareArticleQuality(article, selected[matchIndex]) > 0) selected[matchIndex] = article;
  }

  return selected.map((article, index) => {
    const group = groups[index].slice().sort((a, b) => compareArticleQuality(b, a));
    const relatedArticles = group
      .filter(item => item.url !== article.url)
      .slice(0, 12)
      .map(toRelatedArticle);

    return {
      ...article,
      duplicateCount: group.length,
      duplicateSources: [...new Set(group.map(item => item.source).filter(Boolean))].slice(0, 8),
      relatedArticles
    };
  });
}

function freshnessBucket(article) {
  const age = articleAgeMs(article);
  if (age <= 24 * 60 * 60 * 1000) return 0;
  if (age <= 2 * 24 * 60 * 60 * 1000) return 1;
  return 2;
}

function compareFreshnessThenHeat(a, b) {
  return freshnessBucket(a) - freshnessBucket(b) || compareHeatThenTime(a, b);
}

function compareHeatThenTime(a, b) {
  return Number(b.hotScore || 0) - Number(a.hotScore || 0) || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}

function compareTimeThenHeat(a, b) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    || Number(b.hotScore || 0) - Number(a.hotScore || 0);
}

function isAllowedDate(article) {
  const time = new Date(article.publishedAt).getTime();
  if (Number.isNaN(time)) return false;
  const now = Date.now();
  if (time > now + 6 * 60 * 60 * 1000) return false;
  return now - time <= MAX_NEWS_AGE_MS;
}

function articleAgeMs(article) {
  const time = new Date(article.publishedAt).getTime();
  return Number.isNaN(time) ? Infinity : Math.max(0, Date.now() - time);
}

function scoreByRecency(publishedAt) {
  const ageHours = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 36e5);
  if (ageHours <= 3) return 42;
  if (ageHours <= 12) return 35;
  if (ageHours <= 24) return 28;
  if (ageHours <= 72) return 18;
  return 0;
}

function scoreBySource(source = '') {
  const found = Object.entries(SOURCE_WEIGHTS).find(([name]) => String(source).toLowerCase().includes(name.toLowerCase()));
  return found ? found[1] : 12;
}

function scoreByRelevance(article, category) {
  if (category === 'general') return 12;

  const title = String(article.title || '').toLowerCase();
  const summary = String(article.summary || '').toLowerCase();
  const text = `${title} ${summary}`;
  const positive = CATEGORY_KEYWORDS[category] || [];
  const negative = CATEGORY_EXCLUDE_KEYWORDS[category] || [];
  let score = 0;

  for (const keyword of positive) {
    const key = String(keyword).toLowerCase();
    if (title.includes(key)) score += key.includes(' ') ? 10 : 7;
    else if (summary.includes(key)) score += key.includes(' ') ? 6 : 4;
  }

  for (const keyword of negative) {
    if (text.includes(String(keyword).toLowerCase())) score -= 8;
  }

  return Math.max(0, Math.min(score, 32));
}

function inferRegion(text) {
  const lower = String(text).toLowerCase();
  const rules = [
    ['North America', ['united states', 'u.s.', 'canada', 'mexico', 'north america']],
    ['Europe', ['europe', 'european union', 'uk ', 'germany', 'france', 'italy', 'spain', 'ukraine']],
    ['Asia', ['asia', 'china', 'japan', 'india', 'korea', 'singapore', 'vietnam', 'indonesia', 'taiwan']],
    ['Africa', ['africa', 'nigeria', 'kenya', 'ethiopia', 'south africa', 'egypt', 'sudan']],
    ['South America', ['south america', 'latin america', 'brazil', 'argentina', 'chile', 'colombia', 'peru']],
    ['Oceania', ['australia', 'new zealand', 'oceania', 'pacific island']]
  ];
  return rules.find(([, words]) => words.some(word => lower.includes(word)))?.[0] || 'Global';
}

function dedupeArticles(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = `${normalizeText(article.title)}|${String(article.source).toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickSource(item, fallbackSource) {
  const source = pickTag(item, 'source');
  if (source) return stripTags(source);
  const title = stripTags(pickTag(item, 'title'));
  const parts = title.split(' - ');
  return parts.length > 1 && fallbackSource === 'Google News' ? parts.at(-1).trim() : fallbackSource;
}

function cleanTitle(title, source) {
  const value = stripTags(title);
  return source && value.endsWith(` - ${source}`) ? value.slice(0, -(` - ${source}`).length).trim() : value;
}

function pickTag(item, tag) {
  return decodeEntities(item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1] || '').trim();
}

function pickAttr(item, tag, attr) {
  return decodeEntities(item.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, 'i'))?.[1] || '').trim();
}

function pickLink(item) {
  return safeHttpUrl(stripTags(pickTag(item, 'link'))) || safeHttpUrl(pickAttr(item, 'link', 'href'));
}

function pickImage(item) {
  return safeHttpUrl(pickAttr(item, 'media:content', 'url')) || safeHttpUrl(pickAttr(item, 'media:thumbnail', 'url')) || safeHttpUrl(pickAttr(item, 'enclosure', 'url')) || '';
}

function stripTags(value = '') {
  return decodeEntities(String(value).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function decodeEntities(value = '') {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, item => xmlDecodeMap[item] || item)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function normalizeText(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function isBlockedArticle(article) {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  return ['promo code', 'coupon', 'discount code', 'shopping guide', 'gift card', '% off'].some(word => text.includes(word));
}

function isHttpUrl(value = '') {
  return /^https?:\/\//i.test(String(value));
}

function safeHttpUrl(value = '') {
  const url = String(value || '').trim();
  return isHttpUrl(url) ? url : '';
}

function normalizeDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function newsKey(category) {
  return `news:${category}`;
}

function normalizeCategory(category) {
  return CATEGORIES.includes(category) ? category : 'general';
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || min, min), max);
}

async function runLimited(tasks, concurrency = 5) {
  const results = new Array(tasks.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
    while (cursor < tasks.length) {
      const index = cursor++;
      try {
        results[index] = { status: 'fulfilled', value: await tasks[index]() };
      } catch (error) {
        results[index] = { status: 'rejected', reason: error };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init.headers || {})
    }
  });
}
