const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.nif8o3t.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Conectou-se com o banco de dados.");
    return dbConn;
  } catch (error) {
    console.log(error);
  }
};
conn();
module.exports = conn;
