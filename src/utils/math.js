const crypto = require("crypto");

const generateRandomString = (length = 10) => {
  // Use the current timestamp to ensure uniqueness
  const timestamp = Date.now().toString();

  // Generate a random string using crypto
  const randomString = crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);

  // Combine timestamp and random string for uniqueness
  const uniqueString = timestamp + randomString;

  return uniqueString;
};

function generateNumberPattern() {
  let pattern = "";
  for (let i = 0; i < 3; i++) {
    const part = Math.floor(Math.random() * 9000) + 1000; // Generate a random 4-digit number
    pattern += part;
    if (i < 2) {
      pattern += "-";
    }
  }
  return pattern;
}

const isPositiveNumber = (n) => (n >= 0 ? true : false);

module.exports = {
  isPositiveNumber,
  generateRandomString,
  generateNumberPattern,
};
