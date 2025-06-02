import type { APIContext, MiddlewareNext } from "astro";
export async function onRequest(context: APIContext, next: MiddlewareNext) {
  const { request, url } = context;
  const cache = context.locals.runtime.caches.default;

  const cachedResponse = await cache.match(request.clone());
  if (cachedResponse) {
    console.log(`Cache HIT: ${url.pathname}`);
    return new Response(cachedResponse.body, cachedResponse);
  }

  console.log(`Cache MISS: ${url.pathname}`);
  const response = await next();

  if (response.headers.get("x-isr") === "true") {
    console.log(`Caching: ${url.pathname}`);
    await cache.put(request, response.clone());
  }

  return response;
}
