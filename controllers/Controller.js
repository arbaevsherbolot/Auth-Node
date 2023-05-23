require("dotenv").config();

const db = require("../connections/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const controller = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      await db("all_users").insert({
        username: username,
        email: email,
        password: hashPassword,
      });

      res.status(201).json({ message: "User is successfully registered!" });
    } catch {
      res.status(401).json({ message: "Username already exists!" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      await db("all_users")
        .where({
          username: username,
        })
        .then((user) => {
          if (user.length === 0) {
            return res.json({ auth: false, message: "User is doesn't exist!" });
          } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
              if (result === false) {
                return res.json({
                  auth: false,
                  message: "Incorrect password!",
                });
              } else {
                const token = jwt.sign(
                  { username: user[0].username, email: user[0].email },
                  process.env.JWT_ACCESS_SECRET_KEY
                );

                return res.json({
                  auth: true,
                  token: token,
                  data: user[0],
                  message: "User is successfully logged in!",
                });
              }
            });
          }
        });
    } catch {
      res.json({ auth: false, message: "Login ERROR!" });
    }
  },
};

module.exports = controller;
