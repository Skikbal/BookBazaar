import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const config = {
  development: {
    DBURI: process.env.DEV_MONGO_URI,
    debug: true,
  },
  production: {
    DBURI: process.env.PROD_MONGO_URI,
    debug: false,
  },
  test: {
    DBURI: process.env.TEST_MONGO_URI,
    debug: true,
  },
};

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const DB_CONFIG = config[process.env.NODE_ENV] || config.development;

// tokens
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

// MailTrap
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;
const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = process.env.MAILTRAP_PORT;
const VERIFICATION_URL = process.env.VERIFICATION_URL;

export { DB_CONFIG, NODE_ENV, PORT, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, MAILTRAP_USER, MAILTRAP_PASS, MAILTRAP_HOST, MAILTRAP_PORT, VERIFICATION_URL };
