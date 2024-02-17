import { jsonResponse } from "@/http/response";
import { consola } from "consola";
import { Context } from "hono";

export async function metadata(c: Context) {
  return jsonResponse(c, "Returns the saml 20 metadata xml");
}

export async function acs(c: Context) {
  return jsonResponse(c, "Saml 20 assertion consumer service acs endpoint");
}
