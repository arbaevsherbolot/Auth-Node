require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const route = require("./routes/Route");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use("/auth", route);

app.get("test/:name", async (req, res) => {
  const reply = (name) => `Hello ${name}!`;
  res.send(reply(req.params.name));
});

const PORT = process.env.PORT || 2006;
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
