# Instagram User Blocker - Quick Setup Guide

This guide will help you set up the extension in **under 10 minutes**.

---

## 📋 Prerequisites

- Firefox browser (version 109 or higher)
- A GitHub account or Cloudflare account (for blocker page hosting)
- Basic familiarity with browser extensions

---

## 🚀 Step 1: Set Up the Blocker Page

The blocker page is where users are redirected when they try to visit a blocked profile.

### Option A: GitHub Pages (Recommended for beginners)

1. **Create a new repository:**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it: `instagram-blocker-page` (or any name you prefer)
   - Make it **Public**

2. **Upload the blocker page:**
   - Upload `blocker-page.html` to your repository
   - Rename it to `index.html`

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch → `main` → `/ (root)`
   - Save and wait 2-3 minutes

4. **Get your URL:**
   - Your blocker page URL will be: `https://YOUR-USERNAME.github.io/instagram-blocker-page/`
   - Test it by visiting the URL

### Option B: Cloudflare Pages (Faster, more features)

1. **Login to Cloudflare:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to Pages

2. **Create a new project:**
   - Click "Create a project"
   - Connect to Git or upload directly
   - Upload `blocker-page.html`

3. **Deploy:**
   - Cloudflare will auto-deploy
   - Get your URL: `https://YOUR-PROJECT.pages.dev/`

---

## 🔧 Step 2: Load the Extension in Firefox

1. **Open Firefox:**
   - Type `about:debugging#/runtime/this-firefox` in the address bar

2. **Load Temporary Add-on:**
   - Click "Load Temporary Add-on"
   - Navigate to your project folder
   - Select the `manifest.json` file

3. **Verify installation:**
   - You should see "Instagram User Blocker" in the list
   - Extension icon appears in the toolbar

---

## ⚙️ Step 3: Configure Settings

1. **Open extension settings:**
   - Click the extension icon
   - Click "⚙️ Settings"

2. **Configure blocker page URL:**
   - **Blocker Page URL**: Paste your GitHub Pages or Cloudflare Pages URL
     - Example: `https://yourusername.github.io/instagram-blocker-page/`
   - **Redirect Delay**: 3 seconds (default, adjust as needed)
   - **Redirect Target**: `https://instagram.com` (where to go after countdown)
   - **Blocker Message**: "Stay focused on what matters" (customize as you like)

3. **Enable incognito mode (optional):**
   - Check "Enable in Incognito Mode"
   - Go to `about:addons`
   - Find "Instagram User Blocker"
   - Click extension → "Run in Private Windows" → "Allow"

4. **Save settings:**
   - Click "Save Settings"

---

## 🎯 Step 4: Test the Extension

1. **Visit Instagram:**
   - Go to [instagram.com](https://instagram.com)
   - Navigate to any public profile

2. **Block a user:**
   - Hover near the profile header - you'll see a small 🔒 button
   - Click it (opacity increases on hover)
   - Confirm the blocking action

3. **Test the redirect:**
   - Try to visit the blocked profile again
   - You should be redirected to your blocker page
   - After the countdown, you'll be redirected to Instagram homepage

4. **Unblock (if needed):**
   - Visit the blocked profile (you'll see the blocker page)
   - Click the extension icon → Settings
   - Find the user in "Blocked Users" list
   - Click "Unblock"

---

## 📁 Project Structure

Your project folder should look like this:

```
instagram-blocker/
├── manifest.json
├── background.js
├── content-script.js
├── utils/
│   ├── storage.js
│   └── instagram.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/
│   ├── options.html
│   ├── options.js
│   └── options.css
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── README.md
├── FUTURE_PLANS.md
└── SETUP.md (this file)
```

**Note:** You need to create icon files. Use any PNG icon (16x16, 48x48, 128x128 pixels) or create simple placeholder icons for MVP.

---

## 🎨 Creating Icons (Quick Method)

For MVP testing, you can use placeholder icons:

1. **Use an online icon generator:**
   - Go to [favicon.io](https://favicon.io/favicon-generator/)
   - Create a simple icon with "IB" or "🔒"
   - Download and extract

2. **Or use emoji as PNG:**
   - Screenshot the 🔒 emoji at different sizes
   - Resize to 16x16, 48x48, and 128x128
   - Save in `icons/` folder

---

## 🐛 Troubleshooting

### Extension doesn't load
- **Check manifest.json**: Ensure all file paths are correct
- **Check console**: Open `about:debugging` → Inspect → Console for errors
- **Reload extension**: Click "Reload" in `about:debugging`

### Block button doesn't appear
- **Wait for page load**: Instagram takes 1-2 seconds to fully render
- **Refresh the page**: Try reloading the Instagram profile
- **Check console**: Open DevTools (F12) → Console for errors

### Blocker page doesn't work
- **Verify URL**: Make sure blocker page URL is correct in settings
- **Test blocker page**: Visit the URL directly with parameters:
  ```
  https://your-url.pages.dev/?username=test&delay=3&message=Test
  ```
- **Check HTTPS**: Blocker page must use HTTPS (GitHub Pages and Cloudflare Pages use HTTPS by default)

### Incognito mode not working
- **Enable permission**: Go to `about:addons` → Extension → "Run in Private Windows" → "Allow"
- **Reload extension**: After enabling, reload the extension

### Data not syncing
- **Check storage**: Settings are stored in `chrome.storage.sync`
- **Clear and re-import**: If corrupted, clear all and import from backup

---

## 📦 Making it Permanent (Optional)

Temporary add-ons are removed when Firefox restarts. To make it permanent:

### Option 1: Self-Distribution (Signed Add-on)
1. Package as `.xpi`:
   ```bash
   cd instagram-blocker
   zip -r ../instagram-blocker.xpi *
   ```

2. Submit to Mozilla for signing:
   - Go to [addons.mozilla.org/developers](https://addons.mozilla.org/developers)
   - Create account and submit add-on
   - Get signed `.xpi` file back

### Option 2: Developer Edition
- Use [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/)
- Temporary add-ons persist in Developer Edition

---

## 🎉 You're All Set!

Your Instagram User Blocker is now ready to use. 

### Next Steps:
- Block distracting accounts and stay focused
- Export your blocklist regularly (Settings → Export Blocklist)
- Customize the blocker message to motivate yourself
- Check [FUTURE_PLANS.md](FUTURE_PLANS.md) for upcoming features

### Need Help?
- Check [README.md](README.md) for detailed documentation
- Open an issue on GitHub if you encounter problems
- Review Firefox Browser Console for debugging

---

## 📝 Quick Reference

**Load Extension:**
```
about:debugging#/runtime/this-firefox
```

**Manage Add-ons:**
```
about:addons
```

**View Storage:**
```javascript
// In Browser Console (Ctrl+Shift+J):
browser.storage.sync.get(null).then(console.log)
```

**Clear All Data:**
```javascript
// In Browser Console (⚠️ Careful - deletes everything):
browser.storage.sync.clear()
```

---

**Happy Blocking! Stay Focused! 🚀**
