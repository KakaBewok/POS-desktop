const sqlite = require("sqlite3").verbose();
const path = require("path");

// const db = new sqlite.Database("../../data/db/mycashier.db");
// "../../System/db/mycashier.db"

// module.exports = db;

const dbPath = path.join(__dirname, "..", "..", "data", "db", "mycashier.db");

let db = new sqlite.Database(
  dbPath,
  sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      db.serialize(() => {
        const query = `SELECT * FROM product`;
        db.all(query, (err, rows) => {
          if (err) throw err;
          console.log(rows);
        });
      });
      console.log("Connected to the database");
    }
  }
);

module.exports = db;
