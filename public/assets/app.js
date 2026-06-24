function getCookie(name) {
    const prefix = `${name}=`;
    return document.cookie
        .split(';')
        .map(item => item.trim())
        .find(item => item.startsWith(prefix))
        ?.slice(prefix.length) || null;
}

function setCookie(name, value, days = 365) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function safeLocalStorageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}

function safeLocalStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore blocked storage */ }
}

function getSavedLanguage() {
    return safeLocalStorageGet('global-window-language') || getCookie('global-window-language') || 'en';
}

let state = { currentPage: 'page-welcome', category: 'general', region: 'Global', lastUpdated: null, lang: getSavedLanguage(), selectedNews: null, sortMode: localStorage.getItem('worldview-sort-mode') || 'heat' };

        const CATEGORIES = {
            'tech': { color: 'blue', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            'politics': { color: 'red', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1M10 10l5 5m0-5l-5 5M14 3v18' },
            'finance': { color: 'green', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            'general': { color: 'purple', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-10 4v2m12-2v2' },
            'environment': { color: 'emerald', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
            'health': { color: 'rose', icon: 'M4.8 2.5A3.5 3.5 0 017.5 6a3.5 3.5 0 01-3 3.5V18a2 2 0 002 2h10a2 2 0 002-2V6a3.5 3.5 0 01-3-3.5A3.5 3.5 0 0114.5 6a3.5 3.5 0 01-3 3.5' },
            'science': { color: 'amber', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547' },
            'culture': { color: 'orange', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.754 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.754 0-3.332.477-4.5 1.253' }
        };



        const LANGUAGES = [
            {
                        "code": "en",
                        "name": "English",
                        "native": "English"
            },
            {
                        "code": "zh",
                        "name": "Chinese",
                        "native": "中文"
            },
            {
                        "code": "ko",
                        "name": "Korean",
                        "native": "한국어"
            },
            {
                        "code": "ja",
                        "name": "Japanese",
                        "native": "日本語"
            },
            {
                        "code": "ru",
                        "name": "Russian",
                        "native": "Русский"
            },
            {
                        "code": "fr",
                        "name": "French",
                        "native": "Français"
            },
            {
                        "code": "de",
                        "name": "German",
                        "native": "Deutsch"
            },
            {
                        "code": "it",
                        "name": "Italian",
                        "native": "Italiano"
            },
            {
                        "code": "es",
                        "name": "Spanish",
                        "native": "Español"
            },
            {
                        "code": "pt",
                        "name": "Portuguese",
                        "native": "Português"
            },
            {
                        "code": "ar",
                        "name": "Arabic",
                        "native": "العربية"
            },
            {
                        "code": "hi",
                        "name": "Hindi",
                        "native": "हिन्दी"
            },
            {
                        "code": "tr",
                        "name": "Turkish",
                        "native": "Türkçe"
            },
            {
                        "code": "id",
                        "name": "Indonesian",
                        "native": "Bahasa Indonesia"
            },
            {
                        "code": "vi",
                        "name": "Vietnamese",
                        "native": "Tiếng Việt"
            },
            {
                        "code": "th",
                        "name": "Thai",
                        "native": "ไทย"
            },
            {
                        "code": "nl",
                        "name": "Dutch",
                        "native": "Nederlands"
            },
            {
                        "code": "pl",
                        "name": "Polish",
                        "native": "Polski"
            },
            {
                        "code": "uk",
                        "name": "Ukrainian",
                        "native": "Українська"
            },
            {
                        "code": "sv",
                        "name": "Swedish",
                        "native": "Svenska"
            }
];

        function getLanguageMeta(code) {
            return LANGUAGES.find(item => item.code === code) || LANGUAGES[0];
        }

        function normalizeLanguage(code) {
            return LANGUAGES.some(item => item.code === code) ? code : 'en';
        }

        function updateLanguageButtonLabel() {
            const currentLang = getLanguageMeta(state.lang);
            setText('current-language-label', currentLang.native);
        }

        const I18N = {};
        const loadingLanguages = new Map();

        async function loadLanguage(lang) {
            const code = LANGUAGES.some(item => item.code === lang) ? lang : 'en';
            if (I18N[code]) return I18N[code];
            if (loadingLanguages.has(code)) return loadingLanguages.get(code);

            const request = fetch(`/lang/${code}.json?v=20260607-langpack2`, { cache: 'no-store' })
                .then(response => {
                    if (!response.ok) throw new Error(`Language pack ${code} failed: HTTP ${response.status}`);
                    return response.json();
                })
                .then(dict => {
                    I18N[code] = dict;
                    return dict;
                })
                .catch(error => {
                    console.warn(error);
                    if (code !== 'en') return loadLanguage('en');
                    I18N.en = I18N.en || {};
                    return I18N.en;
                })
                .finally(() => loadingLanguages.delete(code));

            loadingLanguages.set(code, request);
            return request;
        }

        function t(key) {
            return (I18N[state.lang] && I18N[state.lang][key]) || (I18N.en && I18N.en[key]) || key;
        }

        function tFormat(key, values = {}) {
            return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
        }

        function getCategoryLabel(id) {
            return (I18N[state.lang]?.categories?.[id]?.[0]) || I18N.en?.categories?.[id]?.[0] || id;
        }

        function getCategoryDesc(id) {
            return (I18N[state.lang]?.categories?.[id]?.[1]) || I18N.en?.categories?.[id]?.[1] || '';
        }

        function getRegionLabel(region) {
            return (I18N[state.lang]?.regions?.[region]) || I18N.en?.regions?.[region] || region || t('unknown');
        }

        function setText(id, value) {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        }

        function renderLanguageMenu() {
            const menu = document.getElementById('language-menu');
            if (!menu) return;
            menu.innerHTML = '';
            LANGUAGES.forEach(lang => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `language-option ${state.lang === lang.code ? 'active' : ''}`;
                btn.setAttribute('role', 'menuitem');
                btn.onclick = () => setLanguage(lang.code);
                btn.innerHTML = `<span>${lang.native}</span><span class="text-slate-400">${lang.name}</span>`;
                menu.appendChild(btn);
            });
        }

        function toggleLanguageMenu() {
            const menu = document.getElementById('language-menu');
            const button = document.getElementById('language-button');
            if (!menu) return;
            const open = !menu.classList.contains('open');
            menu.classList.toggle('open', open);
            if (button) button.setAttribute('aria-expanded', String(open));
        }

        function closeLanguageMenu() {
            const menu = document.getElementById('language-menu');
            const button = document.getElementById('language-button');
            if (menu) menu.classList.remove('open');
            if (button) button.setAttribute('aria-expanded', 'false');
        }

        async function setLanguage(lang) {
            state.lang = normalizeLanguage(lang);
            updateLanguageButtonLabel();
            safeLocalStorageSet('global-window-language', state.lang);
            setCookie('global-window-language', state.lang);
            await loadLanguage(state.lang);
            applyLanguage();
            closeLanguageMenu();
        }

        function applyLanguage() {
            document.documentElement.lang = state.lang;
            document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
            document.title = t('title');
            setText('sync-title', t('syncTitle'));
            setText('sync-desc', t('syncDesc'));
            setText('brand-title', t('brandName'));
            setText('welcome-kicker', t('welcomeKicker'));
            setText('sections-kicker', t('sectionsKicker'));
            setText('region-kicker', t('regionKicker'));
            setText('back-sections-button', t('backSections'));
            setText('related-back-button', t('back'));
            setText('hero-subtitle', t('heroSubtitle'));
            setText('hero-tagline', t('heroTagline'));
            setText('enter-button', t('enter'));
            setText('feedback-button', t('feedbackButton'));
            setText('feedback-email-label', t('feedbackEmailLabel'));
            setText('feedback-mail-action', t('feedbackMailAction'));
            setText('feedback-close-button', t('feedbackClose'));
            const feedbackLink = document.getElementById('feedback-email-link');
            const feedbackMailAction = document.getElementById('feedback-mail-action');
            if (feedbackLink) {
                feedbackLink.textContent = FEEDBACK_EMAIL;
                feedbackLink.href = `mailto:${FEEDBACK_EMAIL}`;
            }
            if (feedbackMailAction) feedbackMailAction.href = `mailto:${FEEDBACK_EMAIL}`;
            setText('intro-kicker', t('introKicker'));
            setText('intro-heading', t('introHeading'));
            setText('intro-lead', t('introLead'));
            setText('intro-card-1-title', t('introCard1Title'));
            setText('intro-card-1-text', t('introCard1Text'));
            setText('intro-card-2-title', t('introCard2Title'));
            setText('intro-card-2-text', t('introCard2Text'));
            setText('intro-card-3-title', t('introCard3Title'));
            setText('intro-card-3-text', t('introCard3Text'));
            setText('intro-card-4-title', t('introCard4Title'));
            setText('intro-card-4-text', t('introCard4Text'));
            setText('back-home-button', t('backHome'));
            setText('home-title', t('homeTitle'));
            setText('home-desc', t('homeDesc'));
            setText('map-title', t('mapTitle'));
            setText('map-desc', t('mapDesc'));
            setText('orientation-tip', t('orientationTip'));
            setText('reset-region-button', t('resetGlobal'));
            setText('footer-text', t('footer'));
            setText('live-label', t('live'));
            setText('latest-sync-label', t('latestSync'));
            setText('sort-label', t('sortLabel'));
            setText('sort-heat-option', t('sortHeat'));
            setText('sort-time-option', t('sortTime'));
            updateSortControl();
            setText('map-na', getRegionLabel('North America'));
            setText('map-sa', getRegionLabel('South America'));
            setText('map-eu', getRegionLabel('Europe'));
            setText('map-af', getRegionLabel('Africa'));
            setText('map-as', getRegionLabel('Asia'));
            setText('map-oc', getRegionLabel('Oceania'));
            updateLanguageButtonLabel();
            renderLanguageMenu();
            initHome();
            if (state.currentPage === 'page-detail') {
                document.getElementById('detail-title').innerText = getCategoryLabel(state.category);
                updateUI(false);
                if (currentNews.length) renderNewsList(currentNews);
            } else if (state.currentPage === 'page-related') {
                renderRelatedReports();
            } else {
                updateUI(false);
            }
        }

        const COLOR_CLASSES = {
            blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
            red: 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white',
            green: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
            purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
            emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
            rose: 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
            amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
            orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
        };

        const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));


        function createImageFallback(title) {
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
                    <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stop-color="#312e81"/>
                            <stop offset="1" stop-color="#0f172a"/>
                        </linearGradient>
                    </defs>
                    <rect width="800" height="450" fill="url(#g)"/>
                    <circle cx="680" cy="90" r="120" fill="#6366f1" opacity="0.35"/>
                    <circle cx="120" cy="360" r="150" fill="#14b8a6" opacity="0.22"/>
                    <text x="48" y="214" fill="#ffffff" font-size="44" font-family="Arial, sans-serif" font-weight="700">${escapeHTML(t('brandName'))}</text>
                    <text x="50" y="265" fill="#cbd5e1" font-size="24" font-family="Arial, sans-serif">${escapeHTML(title).slice(0, 34)}</text>
                </svg>`;
            return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
        }


        const API_ENDPOINT = '/api/news';
        const FEEDBACK_EMAIL = 'sochenxiang@outlook.com';
        let activeNewsRequest = null;
        let currentNews = [];
        let lastRenderedNewsSignature = '';


        function navigateTo(pageId) {
            const current = document.getElementById(state.currentPage);
            const next = document.getElementById(pageId);
            if (!next || current === next) return;

            if (current) {
                current.classList.remove('active');
                current.style.display = 'none';
            }

            state.currentPage = pageId;
            next.style.display = pageId === 'page-welcome' ? 'flex' : 'block';
            requestAnimationFrame(() => next.classList.add('active'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function enterDetail(cat) {
            state.category = cat;
            document.getElementById('detail-title').innerText = getCategoryLabel(cat);
            navigateTo('page-detail');
            updateUI();
        }

        function selectRegion(region, element) {
            state.region = region;
            document.querySelectorAll('.map-region').forEach(reg => reg.classList.remove('active'));
            if (element) element.classList.add('active');
            updateUI();
        }

        function resetRegion() {
            state.region = 'Global';
            document.querySelectorAll('.map-region').forEach(reg => reg.classList.remove('active'));
            updateUI();
        }

        function setSortMode(mode) {
            state.sortMode = mode === 'time' ? 'time' : 'heat';
            localStorage.setItem('worldview-sort-mode', state.sortMode);
            updateSortControl();
            if (state.currentPage === 'page-detail') renderNews();
        }

        function updateSortControl() {
            const select = document.getElementById('sort-select');
            if (select) select.value = state.sortMode;
        }

        function updateUI(refreshNews = true) {
            const regionLabel = getRegionLabel(state.region);
            document.getElementById('region-badge').innerText = `${t('currentView')}: ${regionLabel}`;
            const scopeText = state.region === 'Global' ? t('globalMonitoring') : `${regionLabel} ${t('regionMonitoring')}`;
            document.getElementById('detail-subtitle').innerText = `${t('scope')}: ${getCategoryLabel(state.category)} • ${scopeText}`;
            if (refreshNews) renderNews();
        }

        function getPreferredNewsLimit() {
            return state.region === 'Global' ? '300' : '50';
        }

        function buildNewsApiUrl() {
            const params = new URLSearchParams({
                category: state.category,
                region: state.region,
                limit: getPreferredNewsLimit(),
                sort: state.sortMode,
                t: Date.now().toString()
            });
            return `${API_ENDPOINT}?${params.toString()}`;
        }

        function buildNewsStreamUrl() {
            const params = new URLSearchParams({
                category: state.category,
                region: state.region,
                limit: getPreferredNewsLimit(),
                sort: state.sortMode,
                t: Date.now().toString()
            });
            return `${API_ENDPOINT}/stream?${params.toString()}`;
        }

        function processStreamPayload(payload) {
            if (payload.ok === false) throw new Error(payload.message || t('errorTitle'));
            if (!Array.isArray(payload.articles)) return false;

            if (!payload.done) return false;

            currentNews = payload.articles;
            renderNewsList(currentNews);
            return true;
        }

        async function renderNews() {
            const grid = document.getElementById('news-grid');
            grid.setAttribute('aria-live', 'polite');
            grid.innerHTML = '';
            grid.appendChild(createNewsLoadingState());
            currentNews = [];
            lastRenderedNewsSignature = '';
            if (activeNewsRequest) activeNewsRequest.abort();
            activeNewsRequest = new AbortController();
            const request = activeNewsRequest;
            let receivedAny = false;
            let renderedFinal = false;

            try {
                const response = await fetch(buildNewsStreamUrl(), {
                    signal: request.signal,
                    headers: { 'Accept': 'application/x-ndjson' },
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`新闻接口请求失败：HTTP ${response.status}`);
                }

                if (!response.body) {
                    return renderNewsFallback(request);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (request !== activeNewsRequest) return;
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        const payload = JSON.parse(line);
                        const changed = processStreamPayload(payload);
                        receivedAny = receivedAny || changed;
                        if (payload.done) renderedFinal = true;
                    }
                }

                if (buffer.trim()) {
                    const payload = JSON.parse(buffer);
                    const changed = processStreamPayload(payload);
                    receivedAny = receivedAny || changed;
                    if (payload.done) renderedFinal = true;
                }

                if (!receivedAny) {
                    grid.innerHTML = '';
                    grid.appendChild(createEmptyNewsState());
                }
            } catch (error) {
                if (error.name === 'AbortError') return;
                console.error(error);
                grid.innerHTML = '';
                grid.appendChild(createNewsErrorState(error));
            }
        }

        async function renderNewsFallback(request) {
            const response = await fetch(buildNewsApiUrl(), {
                signal: request.signal,
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.message || `新闻接口请求失败：HTTP ${response.status}`);
            currentNews = Array.isArray(payload.articles) ? payload.articles : [];
            if (request !== activeNewsRequest) return;
            if (!currentNews.length) {
                const grid = document.getElementById('news-grid');
                grid.innerHTML = '';
                grid.appendChild(createEmptyNewsState());
                return;
            }
            renderNewsList(currentNews);
        }

        function getNewsSignature(newsItems) {
            return newsItems
                .slice(0, Number(getPreferredNewsLimit()))
                .map(item => `${item.url || item.id || item.title}:${item.hotRank || ''}:${item.hotScore || ''}:${item.duplicateCount || ''}`)
                .join('|');
        }

        function renderNewsList(newsItems) {
            const grid = document.getElementById('news-grid');
            if (!grid) return;
            const signature = getNewsSignature(newsItems);
            if (signature && signature === lastRenderedNewsSignature) return;
            lastRenderedNewsSignature = signature;
            grid.innerHTML = '';
            const fragment = document.createDocumentFragment();
            newsItems.slice(0, Number(getPreferredNewsLimit())).forEach((news, index) => {
                fragment.appendChild(createNewsCard(normalizeNews(news), index));
            });
            grid.appendChild(fragment);
        }

        function normalizeNews(news) {
            return {
                title: news.title || t('unknown'),
                summary: news.summary || news.description || '',
                source: news.source || t('unknown'),
                url: news.url || '#',
                img: news.img || news.image || '',
                category: news.category || state.category,
                region: news.region || 'Global',
                publishedAt: news.publishedAt || '',
                hotScore: Number(news.hotScore || 0),
                hotRank: Number(news.hotRank || 0),
                gdeltCoverage: Number(news.gdeltCoverage || 0),
                gdeltSourceCount: Number(news.gdeltSourceCount || 0),
                gdeltScore: Number(news.gdeltScore || 0),
                duplicateCount: Number(news.duplicateCount || 1),
                duplicateSources: Array.isArray(news.duplicateSources) ? news.duplicateSources : [],
                relatedArticles: Array.isArray(news.relatedArticles) ? news.relatedArticles : []
            };
        }

        function createNewsLoadingState() {
            const loading = document.createElement('div');
            loading.className = 'col-span-full text-center py-20 text-slate-400';
            loading.innerHTML = `
                <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p class="text-xl font-bold text-slate-500 mb-2">${t('loadingTitle')}</p>
                <p class="text-sm">${t('loadingDesc')}</p>
            `;
            return loading;
        }

        function createEmptyNewsState() {
            const empty = document.createElement('div');
            empty.className = 'col-span-full text-center py-20 text-slate-400';
            empty.innerHTML = `
                <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"></path>
                    </svg>
                </div>
                <p class="text-xl font-bold text-slate-500 mb-2">${t('emptyTitle')}</p>
                <p class="text-sm">${t('emptyDesc')}</p>
            `;
            return empty;
        }

        function createNewsErrorState(error) {
            const box = document.createElement('div');
            box.className = 'col-span-full text-center py-20 text-slate-400';
            box.innerHTML = `
                <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"></path>
                    </svg>
                </div>
                <p class="text-xl font-bold text-slate-500 mb-2">${t('errorTitle')}</p>
                <p class="text-sm mb-6">${escapeHTML(error.message || t('errorTitle'))}</p>
                <button class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-xs font-bold transition-all" onclick="renderNews()">${t('retry')}</button>
            `;
            return box;
        }


        function openRelatedReports(news) {
            state.selectedNews = normalizeNews(news);
            renderRelatedReports();
            navigateTo('page-related');
        }

        function createRelatedReportCard(news, index) {
            const article = document.createElement('article');
            article.className = 'news-card bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col fade-in';
            article.style.animationDelay = `${Math.min(index, 12) * 0.04}s`;
            const link = document.createElement('a');
            link.href = news.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'flex flex-col h-full text-slate-800';
            const imageSrc = news.img || createImageFallback(news.title || t('unknown'));
            link.innerHTML = `
                <div class="h-40 overflow-hidden bg-slate-100">
                    <img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(news.title || t('unknown'))}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='${createImageFallback(t('brandName'))}'">
                </div>
                <div class="p-6 flex-1 flex flex-col">
                    <div class="flex justify-between items-center mb-3 gap-3">
                        <span class="news-source-badge text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">${escapeHTML(news.source || t('unknown'))}</span>
                        <span class="news-time-label text-[10px] text-slate-400 font-bold">${formatPublishedTime(news.publishedAt)}</span>
                    </div>
                    <h4 class="font-bold text-slate-800 mb-3 leading-tight hover:text-indigo-600 transition-colors line-clamp-2 text-lg">${escapeHTML(news.title || t('unknown'))}</h4>
                    <p class="text-sm text-slate-500 line-clamp-3 leading-relaxed">${escapeHTML(news.summary || '')}</p>
                    <div class="mt-auto pt-4 flex items-center text-indigo-600 text-xs font-bold group">
                        ${t('openOriginal')}
                    </div>
                </div>
            `;
            article.appendChild(link);
            return article;
        }

        function renderRelatedReports() {
            const news = state.selectedNews;
            const main = document.getElementById('related-main');
            const grid = document.getElementById('related-grid');
            if (!main || !grid || !news) return;

            setText('related-eyebrow', t('relatedCoverage'));
            setText('related-title', t('relatedTitle'));
            setText('related-subtitle', t('relatedSubtitle'));

            main.innerHTML = `
                <p class="text-[10px] text-indigo-500 uppercase tracking-widest font-bold mb-3">${t('representativeReport')}</p>
                <a href="${escapeHTML(news.url)}" target="_blank" rel="noopener noreferrer" class="block text-slate-800">
                    <h3 class="text-2xl font-bold mb-3 hover:text-indigo-600 transition-colors">${escapeHTML(news.title)}</h3>
                    <p class="text-sm text-slate-500 leading-relaxed mb-4">${escapeHTML(news.summary || '')}</p>
                    <div class="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                        <span class="bg-slate-100 px-3 py-1 rounded-full">${escapeHTML(news.source)}</span>
                        <span class="bg-red-50 text-red-600 px-3 py-1 rounded-full">${t('heat')} ${news.hotScore || 0}</span>
                        <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">${tFormat('moreCoverage', { count: Math.max(0, news.duplicateCount - 1) })}</span>
                    </div>
                </a>
            `;

            grid.innerHTML = '';
            const related = Array.isArray(news.relatedArticles) ? news.relatedArticles : [];
            if (!related.length) {
                grid.innerHTML = `<div class="col-span-full text-center py-20 text-slate-400"><p class="text-xl font-bold">${t('noRelated')}</p></div>`;
                return;
            }
            const heading = document.createElement('div');
            heading.className = 'col-span-full text-sm font-bold text-slate-500 uppercase tracking-widest';
            heading.textContent = t('otherReports');
            grid.appendChild(heading);
            related.forEach((item, index) => grid.appendChild(createRelatedReportCard(item, index)));
        }

        function createNewsCard(news, index) {
            const article = document.createElement('article');
            article.className = 'news-card bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col fade-in';
            article.style.animationDelay = `${Math.min(index, 12) * 0.04}s`;

            const link = document.createElement('a');
            link.href = news.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'flex flex-col h-full text-slate-800';
            link.setAttribute('aria-label', `${t('openOriginal')}: ${news.title}`);

            const imageWrap = document.createElement('div');
            imageWrap.className = 'h-48 overflow-hidden relative bg-slate-100';

            const img = document.createElement('img');
            img.src = news.img || createImageFallback(news.title);
            img.alt = news.title;
            img.loading = 'lazy';
            img.className = 'w-full h-full object-cover transition-transform duration-500';
            img.onerror = () => {
                img.onerror = null;
                img.src = createImageFallback(news.title);
            };
            imageWrap.appendChild(img);

            const heatBadge = document.createElement('span');
            heatBadge.className = 'news-heat-badge absolute top-10 left-10 text-[10px] font-bold text-white bg-red-600 px-3 py-1 rounded-full shadow-sm';
            heatBadge.textContent = news.hotScore ? `${t('heat')} ${news.hotScore}` : t('heatRealtime');
            heatBadge.title = news.gdeltCoverage ? `GDELT: ${news.gdeltCoverage} / ${news.gdeltSourceCount}` : t('heatRealtime');
            imageWrap.appendChild(heatBadge);

            const regionBadge = document.createElement('span');
            regionBadge.className = 'news-region-badge absolute top-10 right-10 text-[10px] font-bold text-white bg-slate-900/70 px-3 py-1 rounded-full backdrop-blur-lg';
            regionBadge.textContent = getRegionLabel(news.region);
            imageWrap.appendChild(regionBadge);

            const body = document.createElement('div');
            body.className = 'p-6 flex-1 flex flex-col';

            const meta = document.createElement('div');
            meta.className = 'news-meta-row flex justify-between items-center mb-3 gap-3';

            const source = document.createElement('span');
            source.className = 'news-source-badge text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded';
            source.textContent = news.source;

            const time = document.createElement('span');
            time.className = 'news-time-label text-[10px] text-slate-400 font-bold';
            time.textContent = formatPublishedTime(news.publishedAt);

            meta.append(source, time);

            const title = document.createElement('h4');
            title.className = 'font-bold text-slate-800 mb-3 leading-tight hover:text-indigo-600 transition-colors line-clamp-2 text-lg';
            title.textContent = news.title;

            const summary = document.createElement('p');
            summary.className = 'text-sm text-slate-500 line-clamp-3 leading-relaxed';
            summary.textContent = news.summary;

            const related = document.createElement('div');
            related.className = 'mt-4 text-[11px] text-slate-400 font-bold';
            if (news.duplicateCount > 1 && news.relatedArticles.length) {
                related.innerHTML = `<span>${tFormat('moreCoverage', { count: news.duplicateCount - 1 })}</span> · <span class="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">${t('viewMore')}</span>`;
                related.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    openRelatedReports(news);
                });
            }

            const action = document.createElement('div');
            action.className = 'mt-auto pt-4 flex items-center text-indigo-600 text-xs font-bold group';
            action.innerHTML = `${t('openOriginal')}`;

            body.append(meta, title, summary);
            if (news.duplicateCount > 1 && news.relatedArticles.length) body.appendChild(related);
            body.appendChild(action);
            link.append(imageWrap, body);
            article.appendChild(link);
            return article;
        }

        function formatPublishedTime(value) {
            if (!value) return t('realTime');
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return t('realTime');
            return date.toLocaleDateString(state.lang === 'zh' ? 'zh-CN' : state.lang, { month: '2-digit', day: '2-digit' });
        }

        function initHome() {
            const matrix = document.getElementById('category-matrix');
            matrix.innerHTML = '';
            Object.entries(CATEGORIES).forEach(([id, info]) => {
                const card = document.createElement('div');
                card.onclick = () => enterDetail(id);
                card.className = 'category-card cursor-pointer p-10 bg-white rounded-[32px] border border-slate-200 text-center group shadow-sm';
                const colorClasses = COLOR_CLASSES[info.color] || COLOR_CLASSES.purple;
                card.innerHTML = `
                    <div class="w-20 h-20 ${colorClasses} rounded-3xl flex items-center justify-center mx-auto mb-8 transition-all duration-500">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${info.icon}"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">${getCategoryLabel(id)}</h3>
                `;
                matrix.appendChild(card);
            });
        }

        function openFeedbackModal(mode = 'notice') {
            const modal = document.getElementById('feedback-modal');
            if (!modal) return;
            setText('feedback-modal-kicker', mode === 'feedback' ? t('feedbackKicker') : t('noticeKicker'));
            setText('feedback-modal-title', mode === 'feedback' ? t('feedbackTitle') : t('noticeTitle'));
            setText('feedback-modal-body', mode === 'feedback' ? t('feedbackIntro') : t('noticeBody'));
            setText('feedback-email-label', t('feedbackEmailLabel'));
            setText('feedback-mail-action', t('feedbackMailAction'));
            setText('feedback-close-button', t('feedbackClose'));
            const feedbackLink = document.getElementById('feedback-email-link');
            const feedbackMailAction = document.getElementById('feedback-mail-action');
            if (feedbackLink) {
                feedbackLink.textContent = FEEDBACK_EMAIL;
                feedbackLink.href = `mailto:${FEEDBACK_EMAIL}`;
            }
            if (feedbackMailAction) feedbackMailAction.href = `mailto:${FEEDBACK_EMAIL}`;
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        }

        function closeFeedbackModal() {
            const modal = document.getElementById('feedback-modal');
            if (!modal) return;
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }

        window.openFeedbackModal = openFeedbackModal;
        window.closeFeedbackModal = closeFeedbackModal;

        function syncData({ showOverlay = false, refresh = false } = {}) {
            const overlay = document.getElementById('update-overlay');
            if (showOverlay && overlay) overlay.style.display = 'flex';
            const finish = () => {
                state.lastUpdated = new Date().toLocaleTimeString();
                document.getElementById('last-updated').innerText = state.lastUpdated;
                if (overlay) overlay.style.display = 'none';
                if (refresh && state.currentPage === 'page-detail') renderNews();
            };
            if (showOverlay) setTimeout(finish, 600);
            else finish();
        }


        window.setSortMode = setSortMode;

        window.onload = async () => {
            state.lang = normalizeLanguage(state.lang);
            updateLanguageButtonLabel();
            await loadLanguage('en');
            if (state.lang !== 'en') await loadLanguage(state.lang);
            renderLanguageMenu();
            applyLanguage();
            syncData();
            setTimeout(() => openFeedbackModal('notice'), 500);
        };

        document.addEventListener('click', (event) => {
            const switcher = document.getElementById('language-switcher');
            if (switcher && !switcher.contains(event.target)) closeLanguageMenu();
        });
