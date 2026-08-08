// Centralized API base URL.
//
// Every page used to define its own copy of this constant, which meant a
// single misconfigured environment variable (e.g. forgetting the trailing
// "/api" on Vercel) silently broke product/cart/order fetches on some pages
// but not others. This is now the single source of truth, and it normalizes
// whatever is provided so a missing "/api" suffix or a stray trailing slash
// can't break requests again.

const RAW_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function normalize(url) {
  // Strip any trailing slash(es)
  let clean = url.replace(/\/+$/, "");

  // Ensure the "/api" prefix is always present exactly once
  if (!/\/api$/.test(clean)) {
    clean = `${clean}/api`;
  }

  return clean;
}

export const API_URL = normalize(RAW_URL);

export default API_URL;
