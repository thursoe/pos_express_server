
const { faker } = require("@faker-js/faker");
const generate = () => ({
    name: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    ref: faker.number.int(),
    listPrice: faker.commerce.price(),
    barcode: faker.number.int(),
    expiredAt: faker.date.future(),
  });

module.exports = (num) => Array.from({ length: num }, generate);
  