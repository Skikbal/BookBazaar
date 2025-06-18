import mongoose from "mongoose";
import { DB_CONFIG } from "../config/envConfig.js";

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(DB_CONFIG.DBURI);
    console.log("Database connection successfull with host", connectionInstance.connection.host);
  }
  catch (error) {
    console.log("Error in database connection: ", error);
    process.exit(1);
  }
}

export default connectDB;
