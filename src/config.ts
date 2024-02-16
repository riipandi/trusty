import "dotenv/config";

const env = process.env;

const envars = {
  NODE_ENV: env.NODE_ENV || "production",
  HOSTNAME: env.HOSTNAME || "127.0.0.1",
  PORT: parseInt(env.PORT as string) || 3080,
  APP_BASE_URL: env.APP_BASE_URL as string,
  APP_SECRET_KEY: env.APP_SECRET_KEY as string,
  DATABASE_URL: env.DATABASE_URL as string,
  DATABASE_TOKEN: env.DATABASE_TOKEN as string,
};

export default envars;
