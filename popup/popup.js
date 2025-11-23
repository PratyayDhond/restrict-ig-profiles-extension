// Popup script for Instagram User Blocker

document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('Popup initialized');
  
  // Load blocked users
  await loadBlockedUsers();
  
  // Update current page info
  await updateCurrentPageInfo();
  
  // Setup event listeners
  setupEventListeners();
}

// Load and display blocked users
async function loadBlockedUsers() {
  try {
    const { blockedUsers } = await chrome.storage.sync.get('blockedUsers');
    const users = blockedUsers || {};
    
    const userList = document.getElementById('blockedUsersList');
    const blockedCount = document.getElementById('blockedCount');
    
    const userCount = Object.keys(users).length;
    blockedCount.textContent = userCount;
    
    if (userCount === 0) {
      userList.innerHTML = '<p class="empty-state">No blocked users yet</p>';
      return;
    }
    
    // Sort by date (newest first)
    const sortedUsers = Object.entries(users).sort((a, b) => {
      return b[1].addedDate - a[1].addedDate;
    });
    
    // Build user list HTML
    userList.innerHTML = sortedUsers.map(([username, data]) => {
      const date = new Date(data.addedDate);
      const formattedDate = formatDate(date);
      
      return `
        <div class="user-item" data-username="${username}">
          <div class="user-info">
            <div class="username">@${username}</div>
            <div class="blocked-date">Blocked ${formattedDate}</div>
          </div>
          <button class="unblock-btn" data-username="${username}">
            Unblock
          </button>
        </div>
      `;
    }).join('');
    
    // Add unblock event listeners
    const unblockButtons = userList.querySelectorAll('.unblock-btn');
    unblockButtons.forEach(btn => {
      btn.addEventListener('click', handleUnblock);
    });
    
  } catch (error) {
    console.error('Error loading blocked users:', error);
  }
}

// Update current page info
async function updateCurrentPageInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentPageText = document.getElementById('currentPageText');
    
    if (!tab || !tab.url) {
      currentPageText.textContent = 'Unable to detect current page';
      return;
    }
    
    if (tab.url.includes('instagram.com')) {
      currentPageText.textContent = '✓ Instagram detected';
      currentPageText.style.color = '#4CAF50';
    } else {
      currentPageText.textContent = 'Not on Instagram';
      currentPageText.style.color = '#8e8e8e';
    }
  } catch (error) {
    console.error('Error updating page info:', error);
  }
}

// Handle unblock button click
async function handleUnblock(event) {
  const username = event.target.getAttribute('data-username');
  
  if (!confirm(`Unblock @${username}?`)) {
    return;
  }
  
  try {
    // Send message to background script
    chrome.runtime.sendMessage(
      { type: 'UNBLOCK_USER', username },
      async (response) => {
        if (response && response.success) {
          console.log(`User ${username} unblocked`);
          
          // Reload the list
          await loadBlockedUsers();
        } else {
          alert('Failed to unblock user. Please try again.');
        }
      }
    );
  } catch (error) {
    console.error('Error unblocking user:', error);
    alert('Error unblocking user. Please try again.');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Open settings
  document.getElementById('openSettings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // Export data
  document.getElementById('exportData').addEventListener('click', handleExport);
}

// Handle export
async function handleExport() {
  try {
    const data = await chrome.storage.sync.get(null);
    
    const exportData = {
      version: '1.0.0',
      exportDate: Date.now(),
      data: data
    };
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-blocker-export-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    console.log('Data exported successfully');
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');
  }
}

// Utility: Format date
function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'today';
  } else if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
