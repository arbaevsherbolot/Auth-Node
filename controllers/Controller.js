const db = require("../connections/db");
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
            res.status(401).json({ message: "User is doesn't exist!" });
          } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
              if (result === false) {
                res
                  .status(401)
                  .json({ error: err, message: "Incorrect password!" });
              } else {
                res.status(201).json({
                  data: user,
                  message: "User is successfully logged in!",
                });
              }
            });
          }
        });
    } catch {
      res.status(401).json({ message: "Login ERROR!" });
    }
  },
};

module.exports = controller;
