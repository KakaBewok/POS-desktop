const sqlite = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "..", "data", "db", "mycashier.db");

let db = new sqlite.Database(
  dbPath,
  sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to the database");
    }
  }
);

module.exports = db;
