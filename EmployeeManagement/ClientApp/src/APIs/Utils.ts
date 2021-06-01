import authService from "../components/api-authorization/AuthorizeService";

const base = window.location.origin;

export function BuildRequest(path: string, params: any = {}): string {
  const url: URL = new URL(path, base);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  return url.href;
}

export async function fetchWrapper(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const options: RequestInit = { ...init, credentials: "omit" };

  let bearer = null;

  const token = await authService.getAccessToken();
  bearer = `bearer ${token}`;

  options.headers = {
    ...options.headers,
    Authorization: bearer,
    Origin: base,
  };

  return fetch(input, options);
}

export async function Get<T>(url: string, urlParams: any = {}) {
  const request: string = BuildRequest(url, urlParams);
  let response: Response;

  try {
    response = await fetchWrapper(request);
  } catch (ex) {
    throw "Network not available";
  }

  if (!response.ok) {
    throw await response.json();
  }

  return (await Promise.resolve(response.json())) as Promise<T>;
}

export async function Post<T>(
  url: string,
  data: any,
  urlParams: any = {},
  signal: AbortSignal = null
) {
  const request: string = BuildRequest(url, urlParams);

  let response: Response;
  try {
    response = await fetchWrapper(request, {
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (ex) {
    throw "Network not available";
  }

  if (!response.ok) {
    throw await response.json();
  }

  return (await Promise.resolve(response.json())) as Promise<T>;
}

export async function Put<T>(url: string, data: any, urlParams: any = {}) {
  const request: string = BuildRequest(url, urlParams);

  let response: Response;
  try {
    response = await fetchWrapper(request, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch (ex) {
    throw "Network not available";
  }

  if (!response.ok) {
    throw await response.json();
  }

  return (await Promise.resolve(response.json())) as Promise<T>;
}
