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

export { DB_CONFIG, NODE_ENV, PORT, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY };
