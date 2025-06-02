import type { APIContext, MiddlewareNext } from "astro";

export async function onRequest(context: APIContext, next: MiddlewareNext) {
  // Get Cloudflare's cache from the runtime
  const cache = context.locals.runtime.caches.default;

  // Check if we have a cached version
  const cachedResponse = await cache.match(context.request.clone());
  if (cachedResponse) {
    console.log("Cache HIT for:", context.url.pathname);
    return new Response(cachedResponse.body, cachedResponse);
  }

  console.log("Cache MISS for:", context.url.pathname);

  // Get the response from Astro
  const response = await next();

  // Check if this page should be cached (has x-isr header)
  const shouldCache = response.headers.get("x-isr") === "true";

  if (shouldCache) {
    console.log("Caching response for:", context.url.pathname);
    // Clone the response before caching it
    const responseToCache = response.clone();

    // Cache the response (don't await to avoid blocking the response)
    cache.put(context.request.clone(), responseToCache);
  }

  return response;
}
