import "dotenv/config";
import { Context } from "hono";
import { env as HonoEnv } from "hono/adapter";

const envars = {
  NODE_ENV: process.env.NODE_ENV || "production",
  HOSTNAME: process.env.HOSTNAME || "127.0.0.1",
  PORT: parseInt(process.env.PORT as string) || 3080,
  APP_BASE_URL: process.env.APP_BASE_URL as string,
  APP_SECRET_KEY: process.env.APP_SECRET_KEY as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  DATABASE_TOKEN: process.env.DATABASE_TOKEN as string,
};

export const AppConfig = (c: Context) => HonoEnv<typeof envars>(c);

export default envars;
