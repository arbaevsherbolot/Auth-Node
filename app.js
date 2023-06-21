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
  res.json({ ip: ip });
});

const badRequest = (app) => {
  app.all("*", (req, res) => {
    res.status(404).json({
      request: req.method,
      status: 404,
      path: req.path,
      message: "Invalid request",
    });
  });
};
badRequest(app);

const PORT = process.env.PORT || 2006;
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
