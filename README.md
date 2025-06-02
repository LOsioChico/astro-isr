# Astro ISR - Simple Implementation

A simplified proof of concept for **Incremental Static Regeneration (ISR)** with Astro and Cloudflare Pages, featuring **dynamic routes** and **independent caching**.

## 🚀 Features

- **Server-side rendering** with Cloudflare Pages
- **Edge caching** using Cloudflare's Cache API
- **Dynamic routes** with parameterized URLs (`/products`, `/blog`, `/about`, etc.)
- **Independent cache management** - each route cached separately
- **Automatic cache invalidation** after TTL expires
- **Manual revalidation** via API endpoint
- **Different cache TTLs** per route type
- **Simple middleware** for cache management

## 🛠️ How It Works

1. **First Request**: Page is rendered server-side and cached at the edge
2. **Subsequent Requests**: Served from Cloudflare's distributed cache
3. **Cache Expiry**: After TTL expires, next request triggers regeneration
4. **Manual Invalidation**: Use `/api/revalidate` endpoint to clear cache
5. **Route Independence**: Each dynamic route maintains separate cache

## 📋 Setup

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Development** (local preview):

   ```bash
   yarn start
   ```

3. **Build for production**:
   ```bash
   yarn build
   ```

## 🎯 ISR Configuration

Pages opt into ISR by setting response headers:

```javascript
// In any .astro page
Astro.response.headers.set("x-isr", "true");
Astro.response.headers.set("cache-control", "max-age=60"); // Homepage: 60s
Astro.response.headers.set("cache-control", "max-age=30"); // Dynamic routes: 30s
```

- `x-isr: true` - Enables ISR caching for this page
- `cache-control: max-age=N` - Sets cache TTL in seconds

## 🔗 Available Routes

### **Static Routes**

- **Homepage** (`/`): Main demo page with 60-second cache TTL

### **Dynamic Routes** (`/[slug]`)

- **Products** (`/products`): Red theme, product catalog demo
- **Blog** (`/blog`): Blue theme, blog posts demo
- **About** (`/about`): Green theme, company info demo
- **Custom** (`/any-name`): Purple theme, generic dynamic content

Each dynamic route has a **30-second cache TTL** for faster testing.

## 🔄 Manual Revalidation

Clear cache for any URL:

```bash
GET /api/revalidate?url=http://localhost:4321/path
```

Examples:

```bash
curl "http://localhost:4321/api/revalidate?url=http://localhost:4321/"
curl "http://localhost:4321/api/revalidate?url=http://localhost:4321/products"
```

## 📁 Project Structure

```
src/
├── middleware.ts          # ISR cache middleware
├── env.d.ts              # TypeScript definitions
├── pages/
│   ├── index.astro       # Homepage with ISR (60s TTL)
│   ├── [slug].astro      # Dynamic routes with ISR (30s TTL)
│   └── api/
│       └── revalidate.ts # Cache invalidation endpoint
```

## 🔧 Key Components

### Middleware (`src/middleware.ts`)

- Checks for cached responses using Cloudflare Cache API
- Caches new responses when `x-isr: true` header is present
- Works in both development and production environments
- Handles cache operations safely

### Dynamic Routes (`src/pages/[slug].astro`)

- Responds to any URL pattern: `/products`, `/blog`, `/custom-name`
- Generates different content based on URL slug
- Each route cached independently with 30s TTL
- Themed UI with route-specific colors

### Cache Headers

- `x-isr: true` - Marks page for caching
- `cache-control: max-age=N` - Sets cache TTL in seconds
- Different TTLs: Homepage (60s) vs Dynamic routes (30s)

### Revalidation API

- `GET /api/revalidate?url=<url>` - Clears cache for specified URL
- Works with both static and dynamic routes
- Returns JSON response with success/error status

## 🌍 Cache Behavior

- **Independent caching**: `/products` and `/blog` cache separately
- **Regional caching**: Cache stored at Cloudflare edge locations
- **Automatic scaling**: Leverages Cloudflare's global network
- **Cache miss handling**: Regenerates content when cache expires
- **Different TTLs**: Homepage (60s) vs dynamic routes (30s)
- **Route-specific keys**: Each URL gets its own cache entry

## 🔍 Testing Cache Behavior

### **Homepage Testing**

1. Visit `http://localhost:4321/` - note timestamp and random value
2. Refresh multiple times - values should remain the same (cache hit)
3. Wait 60+ seconds and refresh - values should update (cache miss + regeneration)

### **Dynamic Routes Testing**

1. Visit `http://localhost:4321/products` - note timestamp and random value
2. Refresh multiple times - values stay same (cache hit)
3. Wait 30+ seconds and refresh - values update (faster regeneration)
4. Visit `http://localhost:4321/blog` - gets its own independent cache

### **Manual Cache Clearing**

1. Use the "Clear Cache" button on any page
2. Or call the API: `GET /api/revalidate?url=http://localhost:4321/products`
3. Refresh to see fresh content immediately

### **Independence Testing**

1. Visit `/products` and `/blog` - each caches independently
2. Clear cache for `/products` - doesn't affect `/blog` cache
3. Different routes can have different cache states

## 📊 Monitoring

### Console Logs

Check the terminal for cache behavior:

```
Cache MISS for: /products
Caching response for: /products
Cache HIT for: /products
```

### Browser DevTools

- **Cache hit**: Fast response times from edge
- **Cache miss**: Slower response times (server-side generation)
- Network tab shows response times and headers

## ⚡ Development vs Production

### **Development Mode** (`yarn dev`)

- Cache operations logged but may not persist between requests
- ISR middleware runs but uses in-memory cache simulation
- Full functionality available in production deployment

### **Production Mode** (Cloudflare Pages)

- Full Cloudflare Cache API functionality
- Persistent cache across requests and regions
- True edge caching with global distribution

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
4. Deploy and test ISR functionality with real edge caching

## 📈 Advanced Testing

### **Load Testing**

1. Visit multiple dynamic routes rapidly
2. Observe independent cache behavior
3. Test cache invalidation under load

### **TTL Testing**

1. Compare homepage (60s) vs dynamic routes (30s) cache expiration
2. Use browser timestamp to verify cache timing
3. Test manual invalidation vs automatic expiration

## 🔗 Related Resources

- [Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Astro Dynamic Routes](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `yarn install`         | Installs dependencies                            |
| `yarn build`           | Build your production site to `./dist/`          |
| `yarn preview`         | Preview your build locally, before deploying     |
| `yarn astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn astro -- --help` | Get help using the Astro CLI                     |
