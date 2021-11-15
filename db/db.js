const mongoose = require("mongoose");

const database = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db is connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = database;
