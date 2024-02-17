import { jsonResponse, throwResponse } from "@/http/response";
import { Context } from "hono";

export async function listSSOProviders(c: Context) {
  return jsonResponse(c, "Fetch a list of all registered sso providers");
}

export async function registerSSSOProvider(c: Context) {
  return jsonResponse(c, "Register a new sso provider");
}

export async function getSSOProviderDetails(c: Context) {
  return jsonResponse(c, "Fetch sso provider details");
}

export async function updateSSOProvider(c: Context) {
  return jsonResponse(c, "Update details about a sso provider");
}

export async function deleteSSOProvider(c: Context) {
  return jsonResponse(c, "Remove an sso provider");
}
