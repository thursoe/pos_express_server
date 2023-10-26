require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/utils/db");

const HTTP_PORT = process.env.HTTP_PORT || 8080;

const start = () => {
    try {
      connectDB();
      app.listen(HTTP_PORT, () => console.log(`Server running on port on ${HTTP_PORT}..`));
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  
start();