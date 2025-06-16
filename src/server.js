import app from "./app.js";
import { PORT } from "./config/envConfig.js";
import connectDB from "./db/connectDB.js";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
