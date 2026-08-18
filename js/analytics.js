/**
 * js/analytics.js - Telemetry & Visitor Analytics Client SDK (Component 13)
 */
(function () {
    const ANALYTICS_SESSION_ENDPOINT = '/api/analytics/session';
    const ANALYTICS_EVENT_ENDPOINT = '/api/analytics/event';

    function getStorageItem(key, defaultValue) {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function setStorageItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {}
    }

    // Generate or retrieve persistent Visitor ID & Session ID
    let visitorId = getStorageItem('pa_visitor_id', null);
    if (!visitorId) {
        visitorId = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        setStorageItem('pa_visitor_id', visitorId);
    }

    let sessionId = sessionStorage.getItem('pa_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        sessionStorage.setItem('pa_session_id', sessionId);
    }

    // Helper functions for user environment detection
    function detectDevice() {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'Mobile';
        if (/tablet|ipad/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }

    function detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
        if (ua.includes('Edg')) return 'Edge';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        return 'Other';
    }

    function detectOS() {
        const ua = navigator.userAgent;
        if (ua.includes('Win')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
        return 'Other';
    }

    function getReferrer() {
        const ref = document.referrer;
        if (!ref) return 'Direct';
        if (ref.includes('google')) return 'Google';
        if (ref.includes('linkedin')) return 'LinkedIn';
        if (ref.includes('github')) return 'GitHub';
        if (ref.includes('twitter') || ref.includes('x.com')) return 'Twitter';
        return 'Other External';
    }

    let startTime = Date.now();

    function sendSessionHeartbeat() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const payload = {
            session_id: sessionId,
            visitor_id: visitorId,
            device: detectDevice(),
            browser: detectBrowser(),
            os: detectOS(),
            referrer: getReferrer(),
            time_spent_seconds: timeSpent
        };

        fetch(ANALYTICS_SESSION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {});
    }

    window.trackAnalyticsEvent = function (eventType, eventTarget) {
        if (!sessionId) return;
        fetch(ANALYTICS_EVENT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                event_type: eventType,
                event_target: eventTarget
            })
        }).catch(() => {});
    };

    // Initial session record & periodic heartbeats
    sendSessionHeartbeat();
    setInterval(sendSessionHeartbeat, 30000);

    // Clickstream event listeners
    document.addEventListener('click', function (e) {
        const target = e.target.closest('a, button, .tech-badge, [data-analytics]');
        if (!target) return;

        const analyticsTag = target.getAttribute('data-analytics');
        if (analyticsTag) {
            trackAnalyticsEvent('custom_click', analyticsTag);
            return;
        }

        const href = target.getAttribute('href') || '';
        if (href.includes('github.com')) {
            trackAnalyticsEvent('repo_view', href);
        } else if (href.endsWith('.pdf')) {
            trackAnalyticsEvent('download', href);
        } else if (target.classList.contains('tech-badge') || target.closest('.tech-badge')) {
            trackAnalyticsEvent('tech_click', target.innerText.trim());
        }
    });

    // IntersectionObserver for Most Visited Sections
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id) {
                    trackAnalyticsEvent('section_view', entry.target.id);
                }
            });
        }, { threshold: 0.4 });

        document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));
    }
})();
