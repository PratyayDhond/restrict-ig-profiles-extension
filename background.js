// Background service worker for Instagram User Blocker

// Import storage utilities (note: imports work differently in service workers)
importScripts('utils/storage.js');

console.log('Instagram User Blocker background service worker loaded');

// Initialize storage on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed, initializing storage...');
  await StorageManager.initialize();
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  switch (message.type) {
    case 'CHECK_BLOCKED':
      handleCheckBlocked(message.username, sendResponse);
      return true; // Keep channel open for async response

    case 'BLOCK_USER':
      handleBlockUser(message.username, message.profileUrl, sendResponse);
      return true;

    case 'UNBLOCK_USER':
      handleUnblockUser(message.username, sendResponse);
      return true;

    case 'GET_SETTINGS':
      handleGetSettings(sendResponse);
      return true;

    case 'GET_REDIRECT_DELAY':
      handleGetRedirectDelay(message.username, sendResponse);
      return true;

    default:
      console.warn('Unknown message type:', message.type);
  }
});

// Handle check if user is blocked
async function handleCheckBlocked(username, sendResponse) {
  try {
    const isBlocked = await StorageManager.isUserBlocked(username);
    sendResponse({ blocked: isBlocked });
  } catch (error) {
    console.error('Error checking blocked status:', error);
    sendResponse({ blocked: false, error: error.message });
  }
}

// Handle blocking a user
async function handleBlockUser(username, profileUrl, sendResponse) {
  try {
    await StorageManager.blockUser(username, profileUrl);
    console.log(`User ${username} blocked successfully`);
    
    // Notify all Instagram tabs to refresh their blocked status
    notifyAllInstagramTabs({ type: 'USER_BLOCKED', username });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error blocking user:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle unblocking a user
async function handleUnblockUser(username, sendResponse) {
  try {
    await StorageManager.unblockUser(username);
    console.log(`User ${username} unblocked successfully`);
    
    // Notify all Instagram tabs
    notifyAllInstagramTabs({ type: 'USER_UNBLOCKED', username });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error unblocking user:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle getting settings
async function handleGetSettings(sendResponse) {
  try {
    const settings = await StorageManager.getSettings();
    sendResponse({ settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    sendResponse({ settings: null, error: error.message });
  }
}

// Handle getting redirect delay
async function handleGetRedirectDelay(username, sendResponse) {
  try {
    const delay = await StorageManager.getRedirectDelay(username);
    sendResponse({ delay });
  } catch (error) {
    console.error('Error getting redirect delay:', error);
    sendResponse({ delay: 3, error: error.message });
  }
}

// Notify all Instagram tabs about blocklist changes
async function notifyAllInstagramTabs(message) {
  try {
    const tabs = await chrome.tabs.query({ url: '*://*.instagram.com/*' });
    
    for (const tab of tabs) {
      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (error) {
        // Tab might not have content script loaded yet
        console.log(`Could not send message to tab ${tab.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error notifying tabs:', error);
  }
}

// Listen for tab updates (navigation events)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only process when page is loaded and it's Instagram
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('instagram.com')) {
    console.log('Instagram tab updated:', tab.url);
    
    // Content script will handle the blocking check
    // We just log for debugging
  }
});

// Listen for web navigation (SPA navigation detection)
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (details.url && details.url.includes('instagram.com')) {
    console.log('Instagram SPA navigation detected:', details.url);
    
    // Notify content script about URL change
    try {
      await chrome.tabs.sendMessage(details.tabId, {
        type: 'URL_CHANGED',
        url: details.url
      });
    } catch (error) {
      console.log('Could not notify content script of URL change:', error.message);
    }
  }
}, { url: [{ hostContains: 'instagram.com' }] });

// Handle storage changes (for debugging and sync)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    console.log('Storage changed:', changes);
    
    if (changes.blockedUsers) {
      console.log('Blocklist updated');
    }
    
    if (changes.settings) {
      console.log('Settings updated');
    }
  }
});

console.log('Background service worker setup complete');
