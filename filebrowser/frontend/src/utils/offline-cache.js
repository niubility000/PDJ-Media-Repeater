import localforage from "localforage";

const CACHE_NAME = "filebrowser-offline-cache";

function getCacheKey(url) {
  const parsedUrl = new URL(url, window.location.origin);
  // 移除 auth 参数
  parsedUrl.searchParams.delete("auth");
  // 移除 key 参数（getPreviewURL 使用的修改时间戳）
  parsedUrl.searchParams.delete("key");
  let pathname = parsedUrl.pathname;

  // 把 /api/preview/{size}/{path} 转换成 /api/raw/{path}，
  // 这样不管用 raw 还是 preview/big 还是 preview/thumb，都用同一份缓存！
  if (pathname.startsWith("/api/preview/")) {
    // 找到第三个 / 的位置，从 /api/preview/{size} 之后截取
    const parts = pathname.split("/");
    // parts: ['', 'api', 'preview', 'thumb', 'test2', ...]
    if (parts.length >= 4) {
      // 把路径改成 /api/raw/{path}
      const pathParts = parts.slice(4);
      pathname = "/api/raw/" + pathParts.join("/");
    }
  }
  if (!pathname.endsWith("/")) {
    pathname = pathname.split("/").pop();
  }
  if(pathname.endsWith(".mp4") || pathname.endsWith(".mp3")) {
    return pathname.split('/').filter(Boolean).pop();
  }
  let userName = window.localStorage.getItem("line1");
  return userName + parsedUrl.host + pathname;
}

function isOfflineMode() {
  return Number(window.localStorage.getItem("isOffline")) === 1;
}

function isCacheable() {
  return true;
}

async function getFromCache(url) {
  try {
    const cache = await localforage.createInstance({
      name: CACHE_NAME,
      storeName: "assets",
    });
    const cacheKey = getCacheKey(url);
    return await cache.getItem(cacheKey);
  } catch (e) {
    console.warn("Failed to get from cache:", e);
    return null;
  }
}

async function saveToCache(url, response) {
  try {
    const cache = await localforage.createInstance({
      name: CACHE_NAME,
      storeName: "assets",
    });

    const clonedResponse = response.clone();

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await clonedResponse.json();
    } else if (contentType && contentType.includes("text/")) {
      data = await clonedResponse.text();
    } else {
      const blob = await clonedResponse.blob();
      data = {
        type: "blob",
        blob: blob,
        contentType: contentType,
      };
    }

    const cacheKey = getCacheKey(url);
    await cache.setItem(cacheKey, {
      data: data,
      timestamp: Date.now(),
    }); //................................................
  } catch (e) {
    console.warn("Failed to save to cache:", e);
  }
}

function createResponseFromCache(cachedData) {
  if (!cachedData || !cachedData.data) return null;

  const { data, timestamp } = cachedData;

  if (Date.now() - timestamp > 36500 * 24 * 60 * 60 * 1000) {
    return null;
  }

  try {
    if (typeof data === "object" && data.type === "blob") {
      return new Response(data.blob, {
        headers: { "content-type": data.contentType },
      });
    } else if (typeof data === "object") {
      return new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return new Response(data, {
        headers: { "content-type": "text/plain" },
      });
    }
  } catch (e) {
    console.warn("Failed to create response from cache:", e);
    return null;
  }
}

let originalFetch = null;

function initOfflineCache() {
  if (originalFetch) {
    return;
  }

  originalFetch = window.fetch;

  window.fetch = async function (resource, options) {
    const url = typeof resource === "string" ? resource : resource.url;

    if (isOfflineMode() && isCacheable(url)) {
      const cachedData = await getFromCache(url);
      if (cachedData) {
        const response = createResponseFromCache(cachedData);
        if (response) {
          return response;
        }
      }
    }

    try {
      const response = await originalFetch(resource, options);

      if (response.ok && !isOfflineMode() && isCacheable(url)) {
        saveToCache(url, response);
      }

      return response;
    } catch (error) {
      if (isCacheable(url)) {
        const cachedData = await getFromCache(url);
        if (cachedData) {
          const response = createResponseFromCache(cachedData);
          if (response) {
            return response;
          }
        }
      }

      throw error;
    }
  };
  console.log("🔄 Offline cache system initialized");
  console.log("📶 Offline mode:", isOfflineMode() ? "ON" : "OFF");
}

async function clearCache() {
  const cache = await localforage.createInstance({
    name: CACHE_NAME,
    storeName: "assets",
  });
  await cache.clear();
  console.log("🗑️ Cache cleared");
}

export { initOfflineCache, isOfflineMode, clearCache };
