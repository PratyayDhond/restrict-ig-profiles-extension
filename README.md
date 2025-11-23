# Instagram User Blocker Extension

A privacy-focused Firefox extension to block specific Instagram users and redirect attempts to view their content. Maintain your focus and productivity by controlling what content you consume.

## 🎯 Features (MVP - v1.0.0)

### Core Functionality
- **Profile Blocking**: Block any Instagram user by visiting their profile
- **Content Scrubbing**: Hide blocked users' posts, stories, reels, and comments across Instagram
- **Smart Redirection**: Automatic redirect with countdown when attempting to view blocked content
- **Custom Blocker Page**: External blocker page (via Cloudflare Pages/GitHub Pages) with configurable message
- **Incognito Support**: Works seamlessly in private browsing mode
- **Data Portability**: Export/import your blocklist as JSON files

### User Experience
- Minimal, hidden toggle button on profiles
- Confirmation dialog before blocking/unblocking
- Global redirect delay (configurable in settings)
- Clean, minimal UI

## 🚀 Installation

### For Firefox
1. Download the latest `.xpi` file from [Releases](releases)
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon → "Install Add-on From File"
4. Select the downloaded `.xpi` file
5. Grant permissions when prompted

### From Source (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/instagram-blocker.git
   cd instagram-blocker
   ```

2. Load the extension in Firefox:
   - Open Firefox and go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the project directory

3. Enable incognito mode:
   - Go to `about:addons`
   - Find "Instagram User Blocker"
   - Click on the extension → "Run in Private Windows" → "Allow"

## 📖 Usage

### Blocking a User
1. Navigate to any Instagram profile (e.g., `instagram.com/username`)
2. Look for the hidden extension button (appears on hover near profile header)
3. Click the button
4. Confirm the blocking action in the dialog
5. User is now blocked - all their content will be hidden site-wide

### Unblocking a User
1. Visit the blocked user's profile (you'll be redirected to blocker page)
2. Wait for the countdown or click the extension button
3. Click the extension button again to unblock
4. Confirm the unblocking action

### Managing Settings
1. Click the extension icon in Firefox toolbar
2. Click "Settings" or right-click extension → "Options"
3. Configure:
   - **Redirect Delay**: Seconds to wait before redirect (default: 3s)
   - **Blocker Page URL**: Your external blocker page URL
   - **Redirect Target**: Where to redirect after countdown (default: instagram.com)

### Backup & Restore
1. Open extension settings
2. **Export**: Click "Export Blocklist" → Save JSON file
3. **Import**: Click "Import Blocklist" → Select previously saved JSON file

## ⚙️ Configuration

### Environment Variables (Settings Page)

```javascript
{
  "redirectDelay": 3,              // Seconds to show blocker page
  "blockerPageUrl": "https://yourdomain.pages.dev/blocker",
  "redirectTarget": "https://instagram.com",
  "enableIncognito": true
}
```

### Blocker Page Payload

The extension redirects to your blocker page with URL parameters:

```
https://yourdomain.pages.dev/blocker?username=blocked_user&delay=3&message=Stay%20focused
```

**Parameters:**
- `username`: The blocked Instagram username
- `delay`: Seconds before redirect
- `message`: Custom message to display (URL encoded)

### Sample Blocker Page (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <title>User Blocked</title>
  <style>
    body {
      font-family: system-ui;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #fafafa;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .countdown {
      font-size: 3rem;
      font-weight: bold;
      color: #e4405f;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚫 User Blocked</h1>
    <p id="message"></p>
    <div class="countdown" id="countdown"></div>
    <p>Redirecting to Instagram...</p>
  </div>
  <script>
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const delay = parseInt(params.get('delay')) || 3;
    const message = params.get('message') || 'Stay focused on what matters';
    
    document.getElementById('message').textContent = message;
    
    let remaining = delay;
    const countdownEl = document.getElementById('countdown');
    countdownEl.textContent = remaining;
    
    const interval = setInterval(() => {
      remaining--;
      countdownEl.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(interval);
        window.location.href = 'https://instagram.com';
      }
    }, 1000);
  </script>
</body>
</html>
```

## 🏗️ Architecture

### File Structure
```
instagram-blocker/
├── manifest.json           # Extension manifest (V3)
├── background.js           # Service worker (blocklist management)
├── content-script.js       # Instagram page manipulation
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js
│   └── popup.css
├── options/
│   ├── options.html       # Settings page
│   ├── options.js
│   └── options.css
├── utils/
│   ├── storage.js         # Storage utilities
│   └── instagram.js       # Instagram-specific helpers
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md
```

### Key Technologies
- **Manifest V3**: Future-proof WebExtensions API
- **Chrome Storage API**: Persistent blocklist storage
- **Content Scripts**: Instagram DOM manipulation
- **Service Worker**: Background event handling
- **Vanilla JavaScript**: No external dependencies

### Data Storage

Blocklist stored in `chrome.storage.sync`:

```javascript
{
  "blockedUsers": {
    "username1": {
      "addedDate": 1700000000000,
      "addedFrom": "https://instagram.com/username1",
      "customDelay": null  // null = use global setting
    }
  },
  "settings": {
    "redirectDelay": 3,
    "blockerPageUrl": "https://yourdomain.pages.dev/blocker",
    "redirectTarget": "https://instagram.com",
    "enableIncognito": true
  }
}
```

## 🔒 Permissions

The extension requires these permissions:

- `storage`: Save blocklist and settings
- `tabs`: Detect Instagram navigation
- `webRequest`: Intercept blocked profile requests
- `host_permissions`: `*://*.instagram.com/*` (Instagram access)

## 🐛 Troubleshooting

### Extension doesn't work on Instagram
1. Ensure you've granted all permissions
2. Reload Instagram page after installing extension
3. Check Firefox console for errors (`F12` → Console tab)

### Blocker page not showing
1. Verify "Blocker Page URL" is set correctly in settings
2. Ensure your blocker page is accessible (test URL in browser)
3. Check if URL parameters are being passed correctly

### Blocklist not syncing in incognito
1. Go to `about:addons` → Instagram User Blocker
2. Enable "Run in Private Windows"
3. Restart Firefox

### Import/Export not working
1. Ensure JSON file is valid (test with JSON validator)
2. Check file permissions
3. Try exporting first to see expected format

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📮 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/instagram-blocker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/instagram-blocker/discussions)

## 🙏 Acknowledgments

Built with focus and privacy in mind. Inspired by the need for intentional social media consumption.

---

**Version**: 1.0.0 (MVP)  
**Status**: Active Development  
**Last Updated**: November 2025
