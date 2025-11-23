// Content script for Instagram pages
// Handles blocking detection, redirect, and UI injection

console.log('Instagram User Blocker content script loaded');

let currentUsername = null;
let blockButtonInjected = false;

// Initialize on page load
init();

function init() {
  console.log('Initializing Instagram User Blocker...');
  
  // Check current page
  checkAndBlockIfNeeded();
  
  // Watch for URL changes (SPA navigation)
  watchForUrlChanges();
  
  // Inject block button if on profile page
  setTimeout(() => {
    injectBlockButton();
  }, 1500); // Wait for Instagram to fully render
}

// Check if current user should be blocked
async function checkAndBlockIfNeeded() {
  const username = InstagramUtils.getCurrentUsername();
  
  if (!username) {
    console.log('Not a profile page, skipping block check');
    return;
  }
  
  console.log('Checking if user is blocked:', username);
  currentUsername = username;
  
  // Ask background script if user is blocked
  chrome.runtime.sendMessage(
    { type: 'CHECK_BLOCKED', username },
    async (response) => {
      if (response && response.blocked) {
        console.log(`User ${username} is blocked, redirecting...`);
        await redirectToBlockerPage(username);
      }
    }
  );
}

// Redirect to blocker page
async function redirectToBlockerPage(username) {
  // Get settings for blocker URL and delay
  chrome.runtime.sendMessage(
    { type: 'GET_SETTINGS' },
    (response) => {
      if (response && response.settings) {
        const settings = response.settings;
        
        // Get delay for this user
        chrome.runtime.sendMessage(
          { type: 'GET_REDIRECT_DELAY', username },
          (delayResponse) => {
            const delay = delayResponse ? delayResponse.delay : settings.redirectDelay;
            
            // Build blocker URL
            const blockerUrl = InstagramUtils.buildBlockerUrl(
              username,
              delay,
              settings.blockedMessage,
              settings.blockerPageUrl
            );
            
            console.log('Redirecting to blocker page:', blockerUrl);
            window.location.href = blockerUrl;
          }
        );
      }
    }
  );
}

// Watch for URL changes (Instagram is a SPA)
function watchForUrlChanges() {
  let lastUrl = window.location.href;
  
  // Listen for background script notifications
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'URL_CHANGED') {
      console.log('URL changed via history API:', message.url);
      handleUrlChange();
    } else if (message.type === 'USER_BLOCKED' || message.type === 'USER_UNBLOCKED') {
      console.log('Blocklist updated:', message);
      checkAndBlockIfNeeded();
    }
  });
  
  // Fallback: poll for URL changes
  setInterval(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      handleUrlChange();
    }
  }, 1000);
}

// Handle URL change
function handleUrlChange() {
  console.log('URL changed, re-checking block status');
  blockButtonInjected = false;
  checkAndBlockIfNeeded();
  
  setTimeout(() => {
    injectBlockButton();
  }, 1500);
}

// Inject block/unblock button on profile page
async function injectBlockButton() {
  if (blockButtonInjected) {
    return;
  }
  
  const username = InstagramUtils.getCurrentUsername();
  
  if (!username || !InstagramUtils.isProfilePage()) {
    console.log('Not a profile page, skipping button injection');
    return;
  }
  
  console.log('Injecting block button for:', username);
  
  // Find header section to inject button
  const headerSelectors = [
    'header section',
    'header > section',
    'main header section'
  ];
  
  let headerSection = null;
  for (const selector of headerSelectors) {
    headerSection = document.querySelector(selector);
    if (headerSection) break;
  }
  
  if (!headerSection) {
    console.log('Could not find header section to inject button');
    return;
  }
  
  // Check if user is already blocked
  chrome.runtime.sendMessage(
    { type: 'CHECK_BLOCKED', username },
    (response) => {
      const isBlocked = response && response.blocked;
      
      // Create button
      const button = createBlockButton(username, isBlocked);
      
      // Inject button
      headerSection.style.position = 'relative';
      headerSection.appendChild(button);
      
      blockButtonInjected = true;
      console.log('Block button injected successfully');
    }
  );
}

// Create the block/unblock button
function createBlockButton(username, isBlocked) {
  const button = document.createElement('button');
  button.id = 'ig-blocker-toggle';
  button.className = 'ig-blocker-btn';
  button.textContent = isBlocked ? '🔓' : '🔒';
  button.title = isBlocked ? 'Unblock this user' : 'Block this user';
  
  // Minimal, hidden styling
  button.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 14px;
    opacity: 0.3;
    transition: opacity 0.2s;
    z-index: 9999;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Show on hover
  button.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.opacity = '0.3';
  });
  
  // Handle click with confirmation
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBlocked) {
      handleUnblock(username, button);
    } else {
      handleBlock(username, button);
    }
  });
  
  return button;
}

// Handle blocking a user
function handleBlock(username, button) {
  const confirmed = confirm(`Block @${username}?\n\nYou will be redirected to a blocker page if you try to visit their profile.`);
  
  if (!confirmed) {
    return;
  }
  
  chrome.runtime.sendMessage(
    {
      type: 'BLOCK_USER',
      username,
      profileUrl: window.location.href
    },
    (response) => {
      if (response && response.success) {
        console.log('User blocked successfully');
        button.textContent = '🔓';
        button.title = 'Unblock this user';
        
        // Show success message
        showNotification(`@${username} blocked successfully`);
        
        // Redirect to blocker page after short delay
        setTimeout(() => {
          checkAndBlockIfNeeded();
        }, 1000);
      } else {
        alert('Failed to block user. Please try again.');
      }
    }
  );
}

// Handle unblocking a user
function handleUnblock(username, button) {
  const confirmed = confirm(`Unblock @${username}?`);
  
  if (!confirmed) {
    return;
  }
  
  chrome.runtime.sendMessage(
    {
      type: 'UNBLOCK_USER',
      username
    },
    (response) => {
      if (response && response.success) {
        console.log('User unblocked successfully');
        button.textContent = '🔒';
        button.title = 'Block this user';
        
        // Show success message
        showNotification(`@${username} unblocked successfully`);
      } else {
        alert('Failed to unblock user. Please try again.');
      }
    }
  );
}

// Show notification (simple implementation for MVP)
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #000;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 99999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

console.log('Content script initialization complete');
