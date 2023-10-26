const mongoose = require("mongoose");

module.exports = async (DB_HOST, SEEDS) => {
  if (!DB_HOST || !SEEDS) {
    console.error(
      "Unable to Proceed. Please check your configuration in the config.js file"
    );
    process.exit(1);
  }

  try {
    // await mongoose.connect(DB_HOST);
    console.log("Database Connected");

    await seed(SEEDS);
    console.log("Database Seeding Completed Successfully");

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

async function seed(models) {
  try {
    for (const [m,f] of models) {
      console.log(`Deleting data from model ${m.modelName}`);
      await m.deleteMany({});
      console.log(`Inserting data into model ${m.modelName}`);
      await m.insertMany(f);
    }
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Database seeding completed sucessfully.");
    mongoose.connection.close();
  }
}

// If duplicates are found, the seeding will fail.
// Database models should be imported implicitly from the models folder.