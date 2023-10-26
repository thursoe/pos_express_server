
const { faker } = require("@faker-js/faker");
const generate = () => ({ name: faker.commerce.productAdjective() });
module.exports = (num) => Array.from({ length: num }, generate);
  