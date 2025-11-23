// Options page script for Instagram User Blocker

document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('Options page initialized');
  
  // Load current settings
  await loadSettings();
  
  // Load blocked users
  await loadBlockedUsers();
  
  // Setup event listeners
  setupEventListeners();
}

// Load current settings
async function loadSettings() {
  try {
    const { settings } = await chrome.storage.sync.get('settings');
    
    if (settings) {
      document.getElementById('redirectDelay').value = settings.redirectDelay || 3;
      document.getElementById('blockerPageUrl').value = settings.blockerPageUrl || '';
      document.getElementById('redirectTarget').value = settings.redirectTarget || 'https://instagram.com';
      document.getElementById('blockedMessage').value = settings.blockedMessage || 'Stay focused on what matters';
      document.getElementById('enableIncognito').checked = settings.enableIncognito !== false;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Save settings
async function saveSettings() {
  try {
    const settings = {
      redirectDelay: parseInt(document.getElementById('redirectDelay').value),
      blockerPageUrl: document.getElementById('blockerPageUrl').value,
      redirectTarget: document.getElementById('redirectTarget').value,
      blockedMessage: document.getElementById('blockedMessage').value,
      enableIncognito: document.getElementById('enableIncognito').checked
    };
    
    await chrome.storage.sync.set({ settings });
    
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Failed to save settings. Please try again.', 'error');
  }
}

// Load blocked users
async function loadBlockedUsers() {
  try {
    const { blockedUsers } = await chrome.storage.sync.get('blockedUsers');
    const users = blockedUsers || {};
    
    const totalBlocked = document.getElementById('totalBlocked');
    const usersList = document.getElementById('blockedUsersList');
    
    const userCount = Object.keys(users).length;
    totalBlocked.textContent = userCount;
    
    if (userCount === 0) {
      usersList.innerHTML = '<p class="empty-state">No blocked users yet</p>';
      return;
    }
    
    // Sort by date (newest first)
    const sortedUsers = Object.entries(users).sort((a, b) => {
      return b[1].addedDate - a[1].addedDate;
    });
    
    // Build user cards
    usersList.innerHTML = sortedUsers.map(([username]) => {
      return `
        <div class="user-card" data-username="${username}">
          <span class="username">@${username}</span>
          <button class="remove-btn" data-username="${username}" title="Remove">
            ×
          </button>
        </div>
      `;
    }).join('');
    
    // Add remove event listeners
    const removeButtons = usersList.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', handleRemoveUser);
    });
    
  } catch (error) {
    console.error('Error loading blocked users:', error);
  }
}

// Handle remove user
async function handleRemoveUser(event) {
  const username = event.target.getAttribute('data-username');
  
  if (!confirm(`Remove @${username} from blocklist?`)) {
    return;
  }
  
  try {
    const { blockedUsers } = await chrome.storage.sync.get('blockedUsers');
    delete blockedUsers[username];
    await chrome.storage.sync.set({ blockedUsers });
    
    // Reload the list
    await loadBlockedUsers();
    
    showStatus(`@${username} removed successfully`, 'success');
  } catch (error) {
    console.error('Error removing user:', error);
    showStatus('Failed to remove user. Please try again.', 'error');
  }
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
    a.download = `instagram-blocker-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('Blocklist exported successfully!', 'success');
  } catch (error) {
    console.error('Error exporting data:', error);
    showStatus('Failed to export data. Please try again.', 'error');
  }
}

// Handle import
async function handleImport() {
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];
  
  if (!file) {
    return;
  }
  
  try {
    const text = await file.text();
    const importData = JSON.parse(text);
    
    // Validate format
    if (!importData.data || !importData.version) {
      throw new Error('Invalid backup file format');
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
    
    // Reload everything
    await loadSettings();
    await loadBlockedUsers();
    
    showStatus('Blocklist imported successfully!', 'success');
    
    // Clear file input
    fileInput.value = '';
  } catch (error) {
    console.error('Error importing data:', error);
    showStatus('Failed to import data. Please check the file format.', 'error');
  }
}

// Handle clear all
async function handleClearAll() {
  const confirmed = confirm(
    'Are you sure you want to remove ALL blocked users?\n\nThis action cannot be undone.'
  );
  
  if (!confirmed) {
    return;
  }
  
  // Double confirmation
  const doubleConfirmed = confirm(
    'This will permanently delete your entire blocklist. Are you absolutely sure?'
  );
  
  if (!doubleConfirmed) {
    return;
  }
  
  try {
    await chrome.storage.sync.set({ blockedUsers: {} });
    await loadBlockedUsers();
    
    showStatus('All blocked users removed', 'success');
  } catch (error) {
    console.error('Error clearing blocklist:', error);
    showStatus('Failed to clear blocklist. Please try again.', 'error');
  }
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('saveStatus');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
  
  setTimeout(() => {
    statusEl.className = 'status-message';
  }, 5000);
}

// Setup event listeners
function setupEventListeners() {
  // Save settings
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // Export
  document.getElementById('exportBtn').addEventListener('click', handleExport);
  
  // Import
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  
  document.getElementById('importFile').addEventListener('change', handleImport);
  
  // Clear all
  document.getElementById('clearAllBtn').addEventListener('click', handleClearAll);
}
