/**
 * js/data-service.js - Central Portfolio Content Database Service
 * Single Source of Truth loader for all portfolio JSON data.
 * Zero-server, 100% static GitHub Pages compatible.
 * 
 * CORE PRINCIPLE: NO DATA = NO INVENTION
 */

(function (window) {
  'use strict';

  const cache = {};
  const inFlightPromises = {};

  // Resolve base path for GitHub Pages subfolder vs root domain
  function getBaseUrl() {
    const path = window.location.pathname;
    const base = path.endsWith('/') ? path : path.substring(0, path.lastIndexOf('/') + 1);
    return new URL(base, window.location.origin).href;
  }

  const BASE_URL = getBaseUrl();

  const PortfolioData = {
    baseUrl: BASE_URL,

    /**
     * Load a section from the content database safely.
     * @param {string} section - Name of section (e.g. 'profile', 'projects', 'skills')
     * @returns {Promise<any>} Parsed JSON content or safe fallback
     */
    async load(section) {
      if (!section) return null;
      const cleanSection = section.toLowerCase().trim();

      // Return cached data if already loaded
      if (cache[cleanSection]) {
        return cache[cleanSection];
      }

      // Avoid duplicate concurrent in-flight requests
      if (inFlightPromises[cleanSection]) {
        return inFlightPromises[cleanSection];
      }

      inFlightPromises[cleanSection] = (async () => {
        // Attempt priority: 1) data/portfolio/{section}.json, 2) data/{section}.json, 3) fallback
        const pathsToTry = [
          `${BASE_URL}data/portfolio/${cleanSection}.json`,
          `${BASE_URL}data/${cleanSection}.json`
        ];

        let result = null;

        for (const url of pathsToTry) {
          try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (response.ok) {
              result = await response.json();
              break;
            }
          } catch (err) {
            // Silently try next fallback url
          }
        }

        delete inFlightPromises[cleanSection];

        if (result !== null) {
          cache[cleanSection] = result;
          return result;
        }

        console.warn(`[PortfolioData] Section '${cleanSection}' could not be loaded. Returning neutral fallback.`);
        return this.getFallback(cleanSection);
      })();

      return inFlightPromises[cleanSection];
    },

    /**
     * Synchronously read from cache if available.
     * @param {string} section
     */
    get(section) {
      return cache[section.toLowerCase().trim()] || null;
    },

    /**
     * Load all core portfolio data in parallel.
     * @returns {Promise<Object>} Map of all loaded sections
     */
    async loadAll() {
      const coreSections = [
        'profile', 'about', 'contact', 'social', 'skills',
        'experience', 'education', 'projects', 'certifications',
        'services', 'testimonials', 'training', 'blog',
        'architecture', 'downloads', 'assets', 'settings'
      ];

      const results = await Promise.allSettled(
        coreSections.map(s => this.load(s))
      );

      const combined = {};
      coreSections.forEach((s, idx) => {
        combined[s] = results[idx].status === 'fulfilled' ? results[idx].value : this.getFallback(s);
      });

      return combined;
    },

    /**
     * Safe checker for item published flag (defaults to true if omitted).
     */
    isPublished(item) {
      if (!item) return false;
      return item.published !== false;
    },

    /**
     * Get registered asset by ID.
     */
    async getAsset(assetId) {
      const assets = await this.load('assets');
      if (Array.isArray(assets)) {
        return assets.find(a => a.id === assetId && a.published !== false) || null;
      }
      return null;
    },

    /**
     * Safe neutral fallback values. NO DATA = NO INVENTION.
     */
    getFallback(section) {
      const listSections = ['experience', 'education', 'projects', 'services', 'testimonials', 'training', 'blog', 'downloads', 'assets'];
      if (listSections.includes(section)) {
        return [];
      }
      return {};
    }
  };

  // Expose to window
  window.PortfolioData = PortfolioData;

})(window);
