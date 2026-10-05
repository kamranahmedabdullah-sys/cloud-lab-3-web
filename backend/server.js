const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!"
  });
});

app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required"
    });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  db.run(sql, [name, email], function (err) {
    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }

    res.status(201).json({
      id: this.lastID,
      name,
      email
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
