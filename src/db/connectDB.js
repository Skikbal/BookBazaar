import mongoose from "mongoose";
import { NODE_ENV, DB_CONFIG } from "../config/envConfig.js";
const connectDB = async () => {
  console.log(NODE_ENV);
  try {
    const connectionInstance = await mongoose.connect(DB_CONFIG.DBURI);
    console.log("Database connection successfull with host",connectionInstance.connection.host);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
