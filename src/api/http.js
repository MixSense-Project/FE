const RAW_BASE = import.meta.env.VITE_API_BASE_URL;

export const API_BASE = (RAW_BASE || "").replace(/\/+$/, "");

if (!API_BASE) {
  console.warn(
    "[API] VITE_API_BASE_URL is missing. Check .env.local and restart `npm run dev`."
  );
}

export function buildQuery(paramsObj = {}) {
  const params = new URLSearchParams();

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === null) return;
        params.append(key, String(v));
      });
    } else {
      params.set(key, String(value));
    }
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  console.log("[API] Request:", options.method || "GET", url);

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    console.error("[API] Error status:", res.status, "CT:", contentType);
    console.error("[API] Body head:", text.slice(0, 200));
    const err = new Error(`HTTP ${res.status}`);
    err.response = { status: res.status, body: text, contentType };
    throw err;
  }

  if (!contentType.includes("application/json")) {
    console.error("[API] Non-JSON response CT:", contentType);
    console.error("[API] Body head:", text.slice(0, 200));
    throw new Error("Response is not JSON (check URL / proxy / ngrok page)");
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("[API] JSON parse failed. Body head:", text.slice(0, 200));
    throw e;
  }
}