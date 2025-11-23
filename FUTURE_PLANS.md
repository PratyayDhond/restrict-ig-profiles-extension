# Instagram User Blocker - Future Plans & Roadmap

This document outlines the development roadmap, planned features, and version history for the Instagram User Blocker extension.

---

## 📦 Version History

### v1.0.0 - MVP (WIP)

**Core Features:**
- ✅ Block Instagram user profiles
- ✅ Content scrubbing (hide posts, stories, reels, comments from blocked users)
- ✅ Custom external blocker page with countdown redirect
- ✅ Hidden toggle button on profiles with confirmation dialog
- ✅ Global redirect delay setting
- ✅ Incognito mode support
- ✅ Local file export/import (JSON backup)
- ✅ Minimal UI design
- ✅ Firefox support (Manifest V3)

**Technical Stack:**
- Manifest V3 WebExtensions API
- Vanilla JavaScript (no frameworks)
- Chrome Storage API
- External blocker page (Cloudflare Pages/GitHub Pages)

**Permissions:**
- `storage`
- `tabs`
- `webRequest`
- `*://*.instagram.com/*`

---

## 🚀 Planned Features & Timeline

### v1.1.0 - Enhanced Blocking

**New Features:**
- [ ] **Per-user redirect delay**: Custom delay for specific blocked users
- [ ] **Block reasons**: Add optional notes when blocking users
- [ ] **Quick unblock from blocker page**: "Unblock for 1 hour" temporary override
- [ ] **Keyboard shortcuts**: `Ctrl+Shift+B` to toggle block on current profile

**Improvements:**
- [ ] Better username detection (fallback strategies for DOM changes)
- [ ] Faster content scrubbing algorithm
- [ ] Improved error handling and user feedback

---

### v1.2.0 - Statistics & Insights 

**New Features:**
- [ ] **Visit statistics**: Track how many times you tried to view blocked profiles
- [ ] **Blocking trends**: Graph of blocking activity over time
- [ ] **Most blocked users**: See which profiles you attempt to visit most
- [ ] **Productivity insights**: Time saved by blocking distractions
- [ ] **Weekly reports**: Summary of blocked visits and patterns

**Dashboard Components:**
- [ ] Statistics page in extension settings
- [ ] Daily/weekly/monthly views
- [ ] Export statistics as CSV
- [ ] Privacy-first: all stats stored locally

**Data Schema Addition:**
```javascript
{
  "statistics": {
    "username1": {
      "totalVisitAttempts": 15,
      "lastAttempt": 1700000000000,
      "attemptsByDate": {
        "2026-01-15": 3,
        "2026-01-16": 2
      }
    }
  }
}
```

---

### v1.3.0 - Modern UI Overhaul (Q2 2026)

**New Features:**
- [ ] **Modern design system**: Clean, Instagram-inspired UI
- [ ] **Dark mode support**: Follow system preference or manual toggle
- [ ] **Animations**: Smooth transitions and micro-interactions
- [ ] **Better notifications**: Toast messages for block/unblock actions
- [ ] **Profile previews**: See user's profile picture in blocklist

**UI Components:**
- [ ] Redesigned popup with modern card layout
- [ ] Visual blocklist with user avatars
- [ ] Settings page with better organization
- [ ] Onboarding flow for first-time users

**Design Principles:**
- Minimal cognitive load
- Instagram-native feel
- Accessibility-first (WCAG 2.1 AA)

---

### v2.0.0 - Cross-Browser Support

**New Platforms:**
- [ ] **Chrome**: Full Chrome Web Store release
- [ ] **Brave**: Compatible via Chrome Web Store
- [ ] **Edge**: Compatible via Edge Add-ons store
- [ ] **Opera**: Compatible via Opera Add-ons

**Technical Changes:**
- [ ] Browser-agnostic polyfills for API differences
- [ ] Automated build system for multi-browser packaging
- [ ] CI/CD pipeline for releases

**Browser-Specific Optimizations:**
- [ ] Chrome: Leverage Performance APIs
- [ ] Firefox: ESR compatibility
- [ ] Edge: Windows integration features

---

### v2.1.0 - Cloud Sync

**New Features:**
- [ ] **Google Drive sync**: Auto-backup blocklist to Drive
- [ ] **OneDrive sync**: Microsoft account integration
- [ ] **Sync status indicator**: Show last sync time
- [ ] **Conflict resolution**: Handle sync conflicts gracefully
- [ ] **Selective sync**: Choose what to sync (blocklist vs settings)

**Cloud Integration:**
- [ ] OAuth 2.0 flow for Google/Microsoft
- [ ] End-to-end encryption option
- [ ] Automatic sync on changes
- [ ] Manual sync trigger

**Privacy Considerations:**
- [ ] Encrypted cloud storage
- [ ] User controls over what's synced
- [ ] Clear privacy policy
- [ ] Option to stay fully local (no cloud)

---

### v2.2.0 - Advanced Content Filtering

**New Features:**
- [ ] **Feed filtering**: Hide blocked users' posts from home feed
- [ ] **Story filtering**: Skip blocked users' stories
- [ ] **Reels filtering**: Hide in Reels tab and explore
- [ ] **Comment hiding**: Collapse/hide comments from blocked users
- [ ] **Suggested content filtering**: Block "Suggested for you" posts

**Technical Challenges:**
- Instagram's React-based dynamic rendering
- Infinite scroll and lazy loading
- GraphQL API detection
- Performance optimization for real-time filtering

**Configuration Options:**
- [ ] Granular filtering controls (e.g., "hide in feed but show in search")
- [ ] Whitelist mode (allow only specific content types)

---

### v3.0.0 - Smart Blocking & AI Features

**New Features:**
- [ ] **Similar account suggestions**: Block similar accounts based on patterns
- [ ] **Keyword blocking**: Block users whose bio contains specific keywords
- [ ] **Content-based blocking**: Analyze post content for auto-blocking
- [ ] **Schedule-based blocking**: Auto-block during specific hours
- [ ] **Smart reminders**: "You've tried to visit this profile 10 times this week"

**AI/ML Components:**
- [ ] Pattern recognition for similar accounts
- [ ] Natural language processing for bio analysis
- [ ] Time-based behavior analysis
- [ ] Predictive blocking suggestions

**Privacy Note:**
- All AI processing done locally (no data sent to external servers)
- Optional feature (can be disabled)

---

## 🔧 Technical Debt & Improvements

### Ongoing Maintenance

**Code Quality:**
- [ ] Add comprehensive unit tests (Jest)
- [ ] Add end-to-end tests (Playwright)
- [ ] Set up ESLint + Prettier
- [ ] Improve code documentation
- [ ] TypeScript migration (consider for v2.0+)

**Performance:**
- [ ] Optimize content scrubbing algorithm
- [ ] Reduce memory footprint
- [ ] Lazy load settings page components
- [ ] Cache frequently accessed data

**Security:**
- [ ] Regular dependency audits
- [ ] Content Security Policy hardening
- [ ] XSS prevention audits
- [ ] Secure data sanitization


## 🎯 Long-term Vision
-- This is generated by Perplexity AI--

- Establish as reliable Instagram blocker
- Build user base and gather feedback
- Achieve cross-browser compatibility
- Implement cloud sync

- Advanced AI-powered features
- Expand to other social platforms (Twitter, Facebook, TikTok)
- Enterprise features (team blocklists, admin controls)
- Open source community contributions

- Full social media wellness suite
- Mental health partnerships
- Research collaborations on digital wellbeing
- Mobile app integration (share blocklists across devices)

---

## 🔄 Release Cycle

- **Major versions** (X.0.0)
- **Minor versions** (x.X.0)
- **Patch versions** (x.x.X)

---

## 📝 Changelog Format

Each release will include:
- **Added**: New features
- **Changed**: Updates to existing features
- **Deprecated**: Features being phased out
- **Removed**: Deleted features
- **Fixed**: Bug fixes
- **Security**: Security improvements

---

## 💡 Feature Request Process

1. **Submit**: Open GitHub issue with "Feature Request" label
2. **Discussion**: Community feedback and refinement
3. **Evaluation**: Team reviews feasibility and priority
4. **Planning**: Added to roadmap if approved
5. **Development**: Implemented in appropriate version
6. **Release**: Shipped with detailed changelog

---

**Document Version**: 1.0  
**Last Updated**: November 23, 2025  
---

## 🙋 Questions?

- **Roadmap suggestions**: Open a [GitHub Discussion](https://github.com/PratyayDhond/restrict-ig-profiles-extension/discussions)
- **Feature priorities**: Vote on existing feature requests
- **Timeline questions**: Comment on roadmap issues

Thank you for supporting this project! 🚀
