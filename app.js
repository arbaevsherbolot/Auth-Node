require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require("./routes/Route");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(cookieParser());

app.use("/auth", route);

app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const device = req.headers["user-agent"];
  res.json({ ip: ip, device: device });
});

const PORT = process.env.PORT || 2006;
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
