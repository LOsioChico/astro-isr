import type { APIContext } from "astro";

export async function GET({ url, locals }: APIContext) {
  try {
    const urlToRevalidate = url.searchParams.get("url");

    if (!urlToRevalidate) {
      return Response.json(
        { success: false, error: "Missing url parameter" },
        { status: 400 }
      );
    }

    const cache = locals.runtime.caches.default;
    await cache.delete(new Request(urlToRevalidate));

    console.log("Cache invalidated for:", urlToRevalidate);

    return Response.json({
      success: true,
      message: `Cache cleared for ${urlToRevalidate}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return Response.json(
      { success: false, error: "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}
