import "dotenv/config";

const env = process.env;

const envars = {
  NODE_ENV: env.NODE_ENV || "production",
  HOSTNAME: env.HOSTNAME || "127.0.0.1",
  PORT: parseInt(env.PORT as string) || 8030,
  APP_BASE_URL: env.APP_BASE_URL as string,
  APP_SECRET_KEY: env.APP_SECRET_KEY as string,
  LIBSQL_CLIENT_URL: env.LIBSQL_CLIENT_URL as string,
  LIBSQL_CLIENT_TOKEN: env.LIBSQL_CLIENT_TOKEN as string,
};

export default envars;
