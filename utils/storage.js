// Storage utility functions for managing blocklist and settings

const StorageManager = {
  // Default settings
  DEFAULT_SETTINGS: {
    redirectDelay: 3,
    blockerPageUrl: 'https://yourdomain.pages.dev/blocker',
    redirectTarget: 'https://instagram.com',
    enableIncognito: true,
    blockedMessage: 'Stay focused on what matters'
  },

  /**
   * Initialize storage with default settings if not present
   */
  async initialize() {
    const { settings } = await chrome.storage.sync.get('settings');
    if (!settings) {
      await chrome.storage.sync.set({
        settings: this.DEFAULT_SETTINGS,
        blockedUsers: {}
      });
    }
  },

  /**
   * Get all blocked users
   * @returns {Promise<Object>} Object with username keys
   */
  async getBlockedUsers() {
    const { blockedUsers } = await chrome.storage.sync.get('blockedUsers');
    return blockedUsers || {};
  },

  /**
   * Check if a user is blocked
   * @param {string} username - Instagram username
   * @returns {Promise<boolean>}
   */
  async isUserBlocked(username) {
    const blockedUsers = await this.getBlockedUsers();
    return username in blockedUsers;
  },

  /**
   * Block a user
   * @param {string} username - Instagram username
   * @param {string} profileUrl - URL of the profile
   * @returns {Promise<void>}
   */
  async blockUser(username, profileUrl = '') {
    const blockedUsers = await this.getBlockedUsers();
    blockedUsers[username] = {
      addedDate: Date.now(),
      addedFrom: profileUrl,
      customDelay: null
    };
    await chrome.storage.sync.set({ blockedUsers });
  },

  /**
   * Unblock a user
   * @param {string} username - Instagram username
   * @returns {Promise<void>}
   */
  async unblockUser(username) {
    const blockedUsers = await this.getBlockedUsers();
    delete blockedUsers[username];
    await chrome.storage.sync.set({ blockedUsers });
  },

  /**
   * Get settings
   * @returns {Promise<Object>}
   */
  async getSettings() {
    const { settings } = await chrome.storage.sync.get('settings');
    return settings || this.DEFAULT_SETTINGS;
  },

  /**
   * Update settings
   * @param {Object} newSettings - Settings to update
   * @returns {Promise<void>}
   */
  async updateSettings(newSettings) {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await chrome.storage.sync.set({ settings: updatedSettings });
  },

  /**
   * Get redirect delay for a user (custom or global)
   * @param {string} username - Instagram username
   * @returns {Promise<number>}
   */
  async getRedirectDelay(username) {
    const blockedUsers = await this.getBlockedUsers();
    const settings = await this.getSettings();
    
    if (blockedUsers[username] && blockedUsers[username].customDelay !== null) {
      return blockedUsers[username].customDelay;
    }
    
    return settings.redirectDelay;
  },

  /**
   * Export blocklist as JSON
   * @returns {Promise<Object>}
   */
  async exportData() {
    const data = await chrome.storage.sync.get(null);
    return {
      version: '1.0.0',
      exportDate: Date.now(),
      data: data
    };
  },

  /**
   * Import blocklist from JSON
   * @param {Object} importData - Exported data object
   * @returns {Promise<void>}
   */
  async importData(importData) {
    if (!importData.data) {
      throw new Error('Invalid import data format');
    }
    
    // Merge with existing data
    const currentData = await chrome.storage.sync.get(null);
    const mergedBlockedUsers = {
      ...currentData.blockedUsers,
      ...importData.data.blockedUsers
    };
    
    await chrome.storage.sync.set({
      blockedUsers: mergedBlockedUsers,
      settings: importData.data.settings || currentData.settings
    });
  },

  /**
   * Clear all data (use with caution)
   * @returns {Promise<void>}
   */
  async clearAll() {
    await chrome.storage.sync.clear();
    await this.initialize();
  }
};

// Initialize on load
if (typeof chrome !== 'undefined' && chrome.storage) {
  StorageManager.initialize();
}
