/**
 * AXO Agent Tracker (Zero Trust Edition)
 * "Guilty until proven innocent" approach for AI Detection
 */
(function () {
    // Configuration
    /**
     * Configuration Settings
     * Tunable parameters for detection sensitivity and performance.
     */
    const CONFIG = {
        // Auto-switch backend: Localhost for dev, Production URL for live
        backendUrl: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
            ? 'http://localhost:3005'
            : 'https://dev.geck.ai',

        analysisInterval: 2000,               // How often to run behavioral analysis (ms)
        sessionTimeout: 30 * 60 * 1000,       // Session expiration time (30 mins)
        minDataPoints: 15,                    // Minimum mouse events before analysis
        minSessionTime: 5000                  // Wait time before first analysis to avoid false positives
    };

    console.log('🚀 AXO Tracker: Script Initiated'); // VERIFICATION LOG

    /**
     * debugLog - Helper to print logs only if debug mode is enabled (optional)
     * Currently setup to be quiet in production.
     */
    const DEBUG = false; // Set to true for verbose browser console output
    function debugLog(...args) {
        if (DEBUG) console.log('[AXO Debug]', ...args);
    }

    // 1. Initialization & Environment Fingerprinting
    const script = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    const siteId = script.getAttribute('data-site-id');

    // Initial Bot Signs (Environment)
    const envFlags = [];
    if (navigator.webdriver) envFlags.push('navigator.webdriver');
    if (!window.chrome && !window.sidebar) envFlags.push('headless_browser_signature');
    // Enhanced dimension check: automation often sets outer to 0, but inner might be set. 
    // Real users rarely have 0x0 outer.
    if (window.outerWidth === 0 && window.outerHeight === 0 && window.innerWidth === 0) envFlags.push('zero_dimensions');
    if (navigator.languages === '') envFlags.push('no_languages');

    // Detect Antigravity Browser / Automation
    // The Antigravity browser is essentially a controlled Chrome instance
    // v2.1 Fixed Logic
    let isAntigravity = false;
    let detectionReason = '';

    // Method 1: Check for webdriver (most reliable for automation)
    if (navigator.webdriver === true) {
        isAntigravity = true;
        detectionReason = 'navigator.webdriver';
    }

    // Method 2: Check for automation-specific window properties
    if (window.cdc_adoQpoasnfa76pfcZLmcfl_Array ||
        window.cdc_adoQpoasnfa76pfcZLmcfl_Promise ||
        window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol) {
        isAntigravity = true;
        detectionReason = 'chrome_automation_flag';
    }

    // Method 3: Check for Playwright/Puppeteer
    if (window.__playwright || window.__puppeteer) {
        isAntigravity = true;
        detectionReason = 'playwright_puppeteer';
    }

    // Method 4: Check for antigravity-specific markers (if they exist)
    if (window.__ANTIGRAVITY__ || window.antigravity ||
        navigator.userAgent.toLowerCase().includes('antigravity')) {
        isAntigravity = true;
        detectionReason = 'antigravity_marker';
    }

    // Method 4.5: Check for Antigravity DOM markers (MOST RELIABLE)
    // Antigravity leaves behind specific DOM elements even when it masks JS variables
    setTimeout(() => {
        let detectedViaDOM = false;

        // Check for antigravity-scroll-lock-style element
        const scrollLockStyle = document.getElementById('antigravity-scroll-lock-style');
        if (scrollLockStyle) {
            isAntigravity = true;
            detectionReason = 'antigravity_dom_marker';
            detectedViaDOM = true;
            console.log('🤖 AXO: Antigravity detected via DOM marker (scroll-lock-style)');
        }

        // Check for preact-border-container in shadow DOM
        if (!detectedViaDOM) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                if (el.shadowRoot) {
                    const borderContainer = el.shadowRoot.getElementById('preact-border-container');
                    if (borderContainer) {
                        isAntigravity = true;
                        detectionReason = 'antigravity_shadow_dom';
                        detectedViaDOM = true;
                        console.log('🤖 AXO: Antigravity detected via Shadow DOM (preact-border-container)');
                        break;
                    }
                }
            }
        }

        // If we detected Antigravity via DOM, send an immediate update
        if (detectedViaDOM) {
            logAction('antigravity_detected', {
                detectionMethod: detectionReason,
                detectedAt: Date.now() - sessionData.startTime
            });
        }
    }, 500); // Small delay to ensure DOM is fully loaded

    // Method 5: Check for missing plugins (automation browsers often have no plugins)
    // NOTE: This is UNRELIABLE - modern browsers and privacy-focused users often have no plugins
    // DISABLED to reduce false positives
    // if (navigator.plugins.length === 0 && navigator.mimeTypes.length === 0) {
    //     isAntigravity = true;
    //     detectionReason = 'no_plugins';
    // }


    // Method 6: Check for permission API anomalies (automation often has different permissions)
    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'notifications' }).then(result => {
            if (result.state === 'prompt' && navigator.webdriver === false) {
                // This is a subtle check - automation often has different permission states
                console.log('[AXO] Permission state check:', result.state);
            }
        }).catch(() => { });
    }

    // Debug log (Silent in production)
    debugLog('Antigravity Detection Init:', {
        isAntigravity,
        detectionReason
    });

    // Helper: Simple Fingerprint
    function getFingerprint() {
        const str = [
            navigator.userAgent,
            navigator.language,
            new Date().getTimezoneOffset(),
            window.screen.width + 'x' + window.screen.height,
            window.screen.colorDepth,
            navigator.hardwareConcurrency
        ].join('|');

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'fp_' + Math.abs(hash).toString(16);
    }
    const fingerprintId = getFingerprint();

    // Session Management
    let sessionId = localStorage.getItem('axo_session_id');
    let activityTs = localStorage.getItem('axo_last_active');

    // Check if session is valid
    let isNewSession = false;
    if (!sessionId || !activityTs || (Date.now() - parseInt(activityTs) > CONFIG.sessionTimeout)) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('axo_session_id', sessionId);
        isNewSession = true; // Flag to reset score
    }
    localStorage.setItem('axo_last_active', Date.now().toString());

    // Load persisted score from previous pages in this session
    // If it's a new session, reset to baseline (60).
    const savedScore = isNewSession ? 60 : parseFloat(localStorage.getItem('axo_score') || '60');
    const savedSamples = isNewSession ? 0 : parseInt(localStorage.getItem('axo_samples') || '0');

    // State
    const sessionData = {
        movements: [],
        clicks: [],
        scrolls: [],
        keyPresses: [],
        startTime: Date.now(),
        isHumanVerified: false,
        botScore: envFlags.length * 30,
        runningScore: savedScore, // Load from history
        samples: savedSamples     // Load from history
    };

    // ... (Shadow DOM detection code omitted for brevity, keeping existing) ...

    // 3. Advanced Analysis Engine (The "Brain")
    function analyzeBehavior() {
        // If already flagged as hard bot, skip complex maths to save resources
        if (sessionData.botScore > 80) return { score: 0, reasons: ['previously_flagged'] };

        const moves = sessionData.movements;
        // Need more data for a stable analysis chunk
        if (moves.length < 30) return null;

        let chunkScore = 50;
        const indicators = [];

        // Analysis Window: Look at last 60 points (approx 1-2 seconds) or all available
        const sampleSize = Math.min(moves.length, 60);
        const recentMoves = moves.slice(-sampleSize);

        // --- Analysis 1: Linearity ---
        if (recentMoves.length > 10) {
            const rSquared = calculateLinearity(recentMoves);
            if (rSquared > 0.97) { // Stricter: 0.97 catches more subtle bot paths
                chunkScore -= 40;
                indicators.push('straight_movement');
            } else if (rSquared < 0.9) {
                chunkScore += 10; // Reward natural curves
            }
        }

        // --- Analysis 2: Velocity Noise ---
        // Look at a larger set of speeds
        const speeds = recentMoves.map(m => m.speed).filter(s => s !== undefined);
        if (speeds.length > 10) {
            const variance = calculateVariance(speeds);
            if (variance < 0.005) {
                chunkScore -= 30;
                indicators.push('constant_velocity');
            } else if (variance > 0.1) {
                chunkScore += 10;
            }
        }

        // --- Analysis 3: Efficiency ---
        const pathLength = calculatePathLength(recentMoves);
        const displacement = calculateDisplacement(recentMoves);
        // Avoid division by zero
        const efficiency = pathLength > 0 ? displacement / pathLength : 1;

        if (efficiency > 0.90) {
            chunkScore -= 20;
            indicators.push('high_efficiency_path');
        } else {
            chunkScore += 10;
        }

        // --- Analysis 4: Timing ---
        // simplified timing check

        // --- Trusted Event Bonus ---
        if (recentMoves.every(m => m.trusted)) chunkScore += 5;

        // Clamp Chunk Score - CRITICAL UPDATE: Cap score based on Environmental Suspicion
        // If environment looks bot-like, behavior can never be 100% trusted.
        const maxPossibleScore = Math.max(0, 100 - sessionData.botScore);
        chunkScore = Math.min(maxPossibleScore, Math.max(0, chunkScore));

        // UPDATE RUNNING AVERAGE (EMA)
        // New Score = Old Score * 0.9 + Chunk Score * 0.1
        // This makes the score very stable. It takes many "bad" chunks to tank the score.
        sessionData.runningScore = (sessionData.runningScore * 0.9) + (chunkScore * 0.1);
        sessionData.samples++;

        // Persist state to localStorage so it survives page navigation
        localStorage.setItem('axo_score', sessionData.runningScore.toFixed(2));
        localStorage.setItem('axo_samples', sessionData.samples.toString());

        return {
            score: Math.round(sessionData.runningScore),
            chunkScore: chunkScore,
            reasons: indicators,
            metrics: { // NEW: Send raw metrics for forensic analysis
                linearity: recentMoves.length > 10 ? calculateLinearity(recentMoves) : 0,
                variance: recentMoves.length > 10 ? calculateVariance(recentMoves.map(m => m.speed || 0)) : 0,
                efficiency: calculatePathLength(recentMoves) > 0 ? calculateDisplacement(recentMoves) / calculatePathLength(recentMoves) : 0
            }
        };
    }

    // --- Helper Math Functions ---
    function calculateLinearity(moves) {
        if (moves.length < 2) return 0;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
        const n = moves.length;
        for (const m of moves) {
            sumX += m.x;
            sumY += m.y;
            sumXY += m.x * m.y;
            sumXX += m.x * m.x;
            sumYY += m.y * m.y;
        }
        const numerator = (n * sumXY - sumX * sumY);
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        if (denominator === 0) return 1; // Straight vertical/horizontal
        return Math.pow(numerator / denominator, 2);
    }

    function calculateVariance(nums) {
        if (nums.length === 0) return 0;
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
    }

    function calculatePathLength(moves) {
        let len = 0;
        for (let i = 1; i < moves.length; i++) {
            const dx = moves[i].x - moves[i - 1].x;
            const dy = moves[i].y - moves[i - 1].y;
            len += Math.sqrt(dx * dx + dy * dy);
        }
        return len;
    }

    function calculateDisplacement(moves) {
        if (moves.length < 2) return 0;
        const first = moves[0];
        const last = moves[moves.length - 1];
        const dx = last.x - first.x;
        const dy = last.y - first.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 5. Detection Lifecycle
    setTimeout(() => {
        logAction('page_view', { envFlags: envFlags });
        console.log('🚀 AXO Tracker: Page View Sent');
    }, 100);

    let lastAnalysis = null;
    let lastLogTime = 0;

    setInterval(() => {
        const result = analyzeBehavior();
        if (!result) return;

        const now = Date.now();
        // Log every 10 seconds or if meaningful change, but rely on the Running Score
        const timeSinceLastLog = now - lastLogTime;

        // Threshold: < 50 is suspicious (Bot), > 50 is likely Human
        const isBot = result.score < 50;

        // Only log "AI Detection" if we are confident (low score) AND have gathered enough samples
        if (sessionData.samples > 5 && (timeSinceLastLog > 10000 || (isBot && result.score < 50))) {
            logAction('behavioral_analysis', {
                humanScore: result.score, // This is now the stable running average
                chunkScore: result.chunkScore,
                botIndicators: result.reasons, // Why we think it's a bot
                metrics: result.metrics,       // The math behind the decision
                isBot: isBot,
                mousePointsRecorded: sessionData.movements.length,
                samples: sessionData.samples
            });
            lastLogTime = now;
        }
    }, CONFIG.analysisInterval);

    // 6. Session Replay (RRWeb) - Optimized
    function startSessionReplay() {
        const script = document.createElement('script');
        script.src = '/rrweb-record.min.js';
        script.onload = () => {
            if (typeof rrwebRecord === 'undefined') return;
            const events = [];
            rrwebRecord({
                emit(event) { events.push(event); },
                sampling: { mousemove: true, scroll: 150, input: 'last' }
            });

            setInterval(() => {
                if (events.length) {
                    fetch(`${CONFIG.backendUrl}/api/tracking/replay`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId, events: events.splice(0) }),
                        keepalive: true
                    }).catch(() => { });
                }
            }, 5000);
        };
        document.head.appendChild(script);
    }
    setTimeout(startSessionReplay, 1000);

    console.log('🛡️ AXO "Zero Trust" Tracker Active');

    // DOM Mutation Observer for Injectors (Common in Browser Agents)
    new MutationObserver((mutations) => {
        for (const m of mutations) {
            m.addedNodes.forEach(n => {
                if (n.nodeType === 1) {
                    const html = n.outerHTML.toLowerCase();
                    if (html.includes('shadow-root') || html.includes('ai-assistant') || html.includes('overlay')) {
                        logAction('ai_injection_detected', { type: 'dom_injection', specific: n.tagName });
                    }
                }
            });
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    // 4. Communication Channel
    /**
     * Send tracking data to backend
     * Uses Beacon API style (keepalive) to ensure data is sent even if page is closed.
     */
    function logAction(action, data = {}) {
        const payload = {
            siteId: siteId,
            url: window.location.href,
            action: action,
            metadata: {
                ...data,
                sessionId: sessionId,
                userAgent: navigator.userAgent,
                isAntigravity: isAntigravity,
                fingerprintId: fingerprintId
            }
        };

        debugLog('Sending action:', action);

        const body = JSON.stringify(payload);

        // Use sendBeacon for unload events if possible, falling back to fetch
        if (typeof navigator.sendBeacon === 'function' && (action === 'page_exit' || action === 'behavioral_analysis')) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon(`${CONFIG.backendUrl}/api/tracking/collect`, blob);
        } else {
            fetch(`${CONFIG.backendUrl}/api/tracking/collect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                keepalive: true
            }).catch(() => { });
        }
    }

    // --- Event Listeners ---
    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Calculate speed
        const lastMove = sessionData.movements[sessionData.movements.length - 1];
        let speed = 0;
        if (lastMove) {
            const dt = now - lastMove.ts;
            const dist = Math.sqrt(Math.pow(e.clientX - lastMove.x, 2) + Math.pow(e.clientY - lastMove.y, 2));
            speed = dt > 0 ? dist / dt : 0;
        }

        sessionData.movements.push({
            x: e.clientX,
            y: e.clientY,
            ts: now,
            speed: speed,
            trusted: e.isTrusted
        });

        // Keep memory low
        if (sessionData.movements.length > 5000) sessionData.movements.shift();
    });

    // Page Exit
    window.addEventListener('beforeunload', () => {
        logAction('page_exit', {
            duration: Date.now() - sessionData.startTime,
            finalScore: sessionData.runningScore
        });
    });

})();
