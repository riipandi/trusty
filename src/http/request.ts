import { jsonResponse } from "@/http/response";
import { vValidator } from "@hono/valibot-validator";

export function validateJsonRequest(schema: any) {
  return vValidator("json", schema, (result, c) => {
    if (!result.success) {
      const issues = result.issues.map(({ path, expected, input }) => {
        return {
          paths: path?.map((p) => p.key),
          message: `Expected ${expected}, but got ${typeof input}`,
        };
      });
      return jsonResponse(c, "Invalid request", { issues }, 400);
    }
  });
}
