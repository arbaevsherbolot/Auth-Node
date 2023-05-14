require("dotenv").config();

const db = require("../connections/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const controller = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      const users = await db("all_users").insert({
        username: username,
        email: email,
        password: hashPassword,
      });

      res
        .status(201)
        .json({ data: users, message: "User is successfully registered!" });
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
                const username = user[0].username;

                const token = jwt.sign(
                  { username: username },
                  process.env.JWT_ACCESS_SECRET_KEY,
                  {
                    expiresIn: "1h",
                  }
                );

                res.cookie("token", token, {
                  httpOnly: true,
                });

                return res.json({
                  auth: true,
                  data: user,
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

  profileUser: async (req, res) => {
    try {
      res.status(201).json({ message: "User Profile" });
    } catch {
      res.status(401).json({ message: "No DATA!" });
    }
  },
};

module.exports = controller;
