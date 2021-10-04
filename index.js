import express from "express";
import { Low, JSONFile } from "lowdb";

// Prepare Mock Database
const adapter = new JSONFile("./data.json");
const db = new Low(adapter);
await db.read();

db.data = db.data || { logs: [] };

// Prepare Express application
const app = express();

const loggingMiddleware = async (req, res, next) => {
  const datetime = new Date().toISOString();
  const url = "/foo";

  db.data.logs.push(`[${datetime}] ${req.url} accessed`);
  await db.write();
  next();
};

app.use(loggingMiddleware);

app.get("/foo", (req, res) => {
  res.send("Hi? This is Foo");
});

app.get("/something", (req, res) => {
  res.send("What am I doing?!");
});

app.post("/post", (req, res) => {
  res.send("This is post");
});

app.post("/login", (req, res) => {
  res.send("Logging in");
});

const port = 3301;
app.listen(port, () => {
  console.log("App listening on http://localhost:" + port);
});
