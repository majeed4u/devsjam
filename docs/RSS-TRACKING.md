# RSS Feed Tracking Guide

## How to Track RSS Subscribers

### Option 1: Feedly (Free)
Feedly shows subscriber count for public feeds.

**Check your subscribers:**
1. Go to [Feedly](https://feedly.com)
2. Search for your blog URL
3. It will show subscriber count if available

### Option 2: FeedPress (Paid)
- URL: https://feedpress.com
- Features: Detailed analytics, subscriber tracking

### Option 3: Self-Hosted Tracking
Add tracking parameter to RSS URLs:

```typescript
// In rss-generator.ts
const item: RSSItem = {
  link: `${baseUrl}/blog/${post.slug}?utm_source=rss&utm_medium=feed`,
  // ...
};
```

Then track in your analytics (Google Analytics, Plausible, etc.)

## Testing Your RSS Feed

### Validate RSS
- https://validator.w3.org/feed/
- https://www.feedvalidator.org/

### Test URL
```bash
curl -I https://yourdomain.com/feed.xml
```

Should return:
```
HTTP/2 200
content-type: application/rss+xml; charset=utf-8
```

## Submitting Your RSS Feed

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add your property (domain)
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### Blog Directories
Submit to directories to increase reach:

**Tech:**
- https://dev.to (Settings → Import from RSS)
- https://hashnode.com (Settings → Import from RSS)
- https://reddit.com/r/blogging (Sidebar → Submit)

**General:**
- https://bloggers.com
- https://blogcatalog.com
