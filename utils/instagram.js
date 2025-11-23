// Instagram-specific utility functions

const InstagramUtils = {
  /**
   * Extract username from Instagram URL
   * @param {string} url - Current page URL
   * @returns {string|null} Username or null if not a profile/user page
   */
  extractUsernameFromUrl(url) {
    // Pattern: instagram.com/username or instagram.com/username/
    const patterns = [
      /instagram\.com\/([a-zA-Z0-9._]+)\/?$/,
      /instagram\.com\/([a-zA-Z0-9._]+)\/$/,
      /instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?|#|$)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Exclude special paths
        const excludedPaths = [
          'explore', 'direct', 'accounts', 'stories', 'p', 'reel', 
          'reels', 'tv', 'about', 'developer', 'privacy', 'terms'
        ];
        
        if (!excludedPaths.includes(match[1])) {
          return match[1];
        }
      }
    }

    return null;
  },

  /**
   * Extract username from DOM (fallback method)
   * @returns {string|null}
   */
  extractUsernameFromDOM() {
    // Try multiple selectors as Instagram's DOM changes frequently
    const selectors = [
      'header h2',
      'header section h1',
      'header a[href^="/"]',
      'main header h2'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        // Validate it looks like a username
        if (text && /^[a-zA-Z0-9._]+$/.test(text)) {
          return text;
        }
      }
    }

    return null;
  },

  /**
   * Get current username from URL or DOM
   * @returns {string|null}
   */
  getCurrentUsername() {
    // Try URL first (more reliable)
    const urlUsername = this.extractUsernameFromUrl(window.location.href);
    if (urlUsername) {
      return urlUsername;
    }

    // Fallback to DOM
    return this.extractUsernameFromDOM();
  },

  /**
   * Check if current page is a user profile
   * @returns {boolean}
   */
  isProfilePage() {
    const username = this.getCurrentUsername();
    return username !== null;
  },

  /**
   * Check if current page is a post page
   * @returns {boolean}
   */
  isPostPage() {
    return /instagram\.com\/p\/[a-zA-Z0-9_-]+/.test(window.location.href);
  },

  /**
   * Check if current page is a reel page
   * @returns {boolean}
   */
  isReelPage() {
    return /instagram\.com\/(reel|reels)\/[a-zA-Z0-9_-]+/.test(window.location.href);
  },

  /**
   * Extract username from post/reel page
   * @returns {string|null}
   */
  extractUsernameFromPost() {
    // Look for username in post header
    const selectors = [
      'article header a[href^="/"]',
      'header a[role="link"]',
      'article a[role="link"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const href = element.getAttribute('href');
        const match = href.match(/^\/([a-zA-Z0-9._]+)\/?$/);
        if (match && match[1]) {
          return match[1];
        }
      }
    }

    return null;
  },

  /**
   * Build blocker page URL with parameters
   * @param {string} username - Blocked username
   * @param {number} delay - Redirect delay in seconds
   * @param {string} message - Custom message
   * @param {string} blockerUrl - Base blocker page URL
   * @returns {string}
   */
  buildBlockerUrl(username, delay, message, blockerUrl) {
    const params = new URLSearchParams({
      username: username,
      delay: delay.toString(),
      message: message
    });

    return `${blockerUrl}?${params.toString()}`;
  },

  /**
   * Hide element (for content scrubbing)
   * @param {HTMLElement} element
   */
  hideElement(element) {
    if (element) {
      element.style.display = 'none';
      element.setAttribute('data-blocked-by-extension', 'true');
    }
  },

  /**
   * Find and hide posts from blocked user in feed
   * @param {string} username - Blocked username
   */
  hidePostsInFeed(username) {
    // This will be implemented in future versions (v2.2.0)
    // For now, we only block profile access
    console.log(`Content scrubbing for ${username} will be available in v2.2.0`);
  }
};
