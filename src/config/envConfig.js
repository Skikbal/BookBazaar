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
const DB_CONFIG = config[process.env.NODE_ENV] || config["development"];

export { NODE_ENV, PORT, DB_CONFIG };
