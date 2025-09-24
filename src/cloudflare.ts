import type { Config } from "./config";

export async function kvGet(key: string, cloudflare: Config["cloudflare"]): Promise<any> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflare.accountId}/storage/kv/namespaces/${cloudflare.namespaceId}/values/${encodeURIComponent(key)}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${cloudflare.apiToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!resp.ok) {
    throw new Error(`Error fetching KV: ${resp.status} ${await resp.text()}`);
  }

  const text = await resp.text();
  // 如果你知道存的就是 JSON，可以尝试 parse：
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
