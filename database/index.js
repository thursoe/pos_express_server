const seeder = require("./seeders/dbSeeder");
const fsPromises = require("fs").promises;
var path = require("path");
const { DB_HOST, SEEDS } = require("./config");
const templates = {
  index: `
const { faker } = require("@faker-js/faker");
const generate = () => ({ name: faker.person.firstName() });
module.exports = (num) => Array.from({ length: num }, generate);
  `,
};

function _log(message) {
  console.log(message);
}

function _error(message) {
  console.error(message);
  process.exit(1);
}

async function _createFile(name) {
  const folderPath = path.join(__dirname, "factories");
  const fileName = `${name}Factory.js`;
  const filePath = path.join(folderPath, fileName);

  try {
    await fsPromises.stat(folderPath);
    await fsPromises.writeFile(filePath, templates.index);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fsPromises.mkdir(folderPath, { recursive: true });
      await fsPromises.writeFile(filePath, templates.index);
    } else {
      _error("Unable to create file.")
    }
  }
  _log(`File ${fileName} created successfully.`);
}

const start = async () => {
  seeder(DB_HOST, SEEDS);
  // const cmd = process.argv;

  // if (cmd[cmd.length - 1] === "seed") {
  //   // Execute the seed function
  //   seeder(DB_HOST, SEEDS);
  // } else if (cmd[cmd.length - 2] === "factory") {
  //   const name = cmd[cmd.length - 1];
  //   if (!name) {
  //     _error("Invalid cmd. Use 'seed' or 'factory'.");
  //   }
  //   // Create the factory file
  //   _createFile(name);
  // } else {
  //   _error("Invalid cmd. Use 'seed' or 'factory'.");
  // }
};

start();