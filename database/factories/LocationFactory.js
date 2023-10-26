
const { faker } = require("@faker-js/faker");
const generate = () => ({ name: faker.location.streetAddress() });
module.exports = (num) => Array.from({ length: num }, generate);
  