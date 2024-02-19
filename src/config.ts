import { Context } from 'hono/mod.ts';
import { env as HonoEnv } from 'hono/helper/adapter/index.ts';

const envars = {
  NODE_ENV: Deno.env.get('NODE_ENV') || 'production',
  HOSTNAME: Deno.env.get('HOSTNAME') || '127.0.0.1',
  PORT: parseInt(Deno.env.get('PORT') as string) || 3080,
  APP_BASE_URL: Deno.env.get('APP_BASE_URL') as string,
  APP_SECRET_KEY: Deno.env.get('APP_SECRET_KEY') as string,
  DATABASE_URL: Deno.env.get('DATABASE_URL') as string,
  DATABASE_TOKEN: Deno.env.get('DATABASE_TOKEN') as string,
};

export const AppConfig = (c: Context) => HonoEnv<typeof envars>(c);

export default envars;
