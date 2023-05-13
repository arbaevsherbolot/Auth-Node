const db = require("../connections/db");

const controller = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const users = await db("users").insert({
        username: username,
        email: email,
        password: password,
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

      const user = await db("users").where({
        username: username,
        password: password,
      });

      if (user.length === 0) {
        res.status(401).json({ message: "Incorrect username or password!" });
      } else {
        res
          .status(201)
          .json({ data: user, message: "User is successfully logged in!" });
      }
    } catch {
      res.status(401).json({ message: "Login ERROR!" });
    }
  },
};

module.exports = controller;
