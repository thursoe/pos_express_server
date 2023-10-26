const { faker } = require("@faker-js/faker");
const generate = () => ({
  name: faker.person.fullName(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  phone: faker.phone.number() ,
  isCustomer: faker.datatype.boolean(),
  isCompany: faker.datatype.boolean(),
});
module.exports = (num) => Array.from({ length: num }, generate);
