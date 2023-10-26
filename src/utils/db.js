require("dotenv").config();
const { mongoose } = require("mongoose");

const HOST = process.env.HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_URL = `mongodb://${HOST}:${DB_PORT}/${DB_NAME}`;
const MONGO_URL = process.env.MONGO_URL;

const DATABASE_URL = process.env.NODE_ENV == "production" ? MONGO_URL : DB_URL;

const connectDB = async () => {
  try {
    await mongoose
      .connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((data) => console.log(`Database Connected`));
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;