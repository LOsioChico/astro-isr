# Astro ISR - Simple Implementation

A simplified proof of concept for **Incremental Static Regeneration (ISR)** with Astro and Cloudflare Pages.

## 🚀 Features

- **Server-side rendering** with Cloudflare Pages
- **Edge caching** using Cloudflare's Cache API
- **Automatic cache invalidation** after TTL expires
- **Manual revalidation** via API endpoint
- **Simple middleware** for cache management

## 🛠️ How It Works

1. **First Request**: Page is rendered server-side and cached at the edge
2. **Subsequent Requests**: Served from Cloudflare's distributed cache
3. **Cache Expiry**: After TTL (60 seconds), next request triggers regeneration
4. **Manual Invalidation**: Use `/api/revalidate` endpoint to clear cache

## 📋 Setup

1. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Development** (local preview):

   ```bash
   npm run start
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🎯 ISR Configuration

Pages opt into ISR by setting response headers:

```javascript
// In any .astro page
Astro.response.headers.set("x-isr", "true");
Astro.response.headers.set("cache-control", "max-age=60");
```

- `x-isr: true` - Enables ISR caching for this page
- `cache-control: max-age=60` - Sets cache TTL to 60 seconds

## 🔄 Manual Revalidation

Clear cache for any URL:

```bash
GET /api/revalidate?url=https://your-domain.com/
```

Example:

```bash
curl "https://your-site.pages.dev/api/revalidate?url=https://your-site.pages.dev/"
```

## 📁 Project Structure

```
src/
├── middleware.ts          # ISR cache middleware
├── env.d.ts              # TypeScript definitions
├── pages/
│   ├── index.astro       # Demo page with ISR enabled
│   └── api/
│       └── revalidate.ts # Cache invalidation endpoint
```

## 🔧 Key Components

### Middleware (`src/middleware.ts`)

- Checks for cached responses
- Caches new responses when `x-isr: true` header is present
- Uses Cloudflare's Cache API

### Cache Headers

- `x-isr: true` - Marks page for caching
- `cache-control: max-age=N` - Sets cache TTL in seconds

### Revalidation API

- `GET /api/revalidate?url=<url>` - Clears cache for specified URL
- Returns JSON response with success/error status

## 🌍 Cache Behavior

- **Regional caching**: Cache is stored at Cloudflare edge locations
- **Automatic scaling**: Leverages Cloudflare's global network
- **Cache miss handling**: Regenerates content when cache expires
- **Regional limitations**: Cache invalidation only affects current region

## 🔍 Testing Cache

1. Visit the homepage - note the timestamp and random value
2. Refresh multiple times - values should remain the same (cache hit)
3. Wait 60+ seconds and refresh - values should update (cache miss + regeneration)
4. Use revalidation API to manually clear cache

## 📊 Monitoring

Check browser DevTools Network tab:

- **Cache hit**: Fast response times from edge
- **Cache miss**: Slower response times (server-side generation)

## ⚠️ Limitations

- **Regional cache**: Invalidation only affects current Cloudflare region
- **512 MB limit**: Maximum cached object size
- **Free tier limits**: 50 cache operations per request
- **No dev server support**: Requires Cloudflare Workers environment

## 🚀 Deployment

Deploy to Cloudflare Pages:

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy and test ISR functionality

## 🔗 Related Resources

- [Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `yarn install`         | Installs dependencies                            |
| `yarn dev`             | Starts local dev server at `localhost:4321`      |
| `yarn build`           | Build your production site to `./dist/`          |
| `yarn preview`         | Preview your build locally, before deploying     |
| `yarn astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn astro -- --help` | Get help using the Astro CLI                     |
