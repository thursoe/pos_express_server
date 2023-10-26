require("dotenv").config();
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_OPTION = {
  // (1hour) × 60minutes × 60seconds × 1000milliseconds = 3,600,000milliseconds
  expires: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRE * 60 * 60 * 1000), 
  maxAge: process.env.ACCESS_TOKEN_EXPIRE * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const REFRESH_TOKEN_OPTION = {
  // (3days) × 24hour × 60minutes × 60seconds × 1000milliseconds = 3,600,000milliseconds
  expires: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRE * 24 * 60 * 60 * 1000), 
  maxAge: process.env.REFRESH_TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const generateToken = async (user) => {
  const accessToken = await user.signAccessToken();
  const refreshToken = await user.signRefreshToken();

  return {accessToken, refreshToken};
};

module.exports = { generateToken, ACCESS_TOKEN_OPTION, REFRESH_TOKEN_OPTION, jwt };
