require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const route = require("./routes/Route");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use("/auth", route);

app.get("/", async (req, res) => {
  try {
    res.send("Hello this is a server!");
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 2006;
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
