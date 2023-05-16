require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const route = require("./routes/Route");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["https://auth-react-node.netlify.app"],
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

app.use("/auth", route);

const PORT = process.env.PORT || 2006;
app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
