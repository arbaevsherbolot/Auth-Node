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
            res
              .status(401)
              .json({ auth: false, message: "User is doesn't exist!" });
          } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
              if (result === false) {
                res.status(401).json({
                  auth: false,
                  message: "Incorrect password!",
                });
              } else {
                const userId = user[0].id;
                const token = jwt.sign(
                  { userId: userId },
                  process.env.JWT_ACCESS_SECRET_KEY,
                  {
                    expiresIn: "1h",
                  }
                );

                req.session.user = user;

                res.status(201).json({
                  token: token,
                  auth: true,
                  data: user,
                  message: "User is successfully logged in!",
                });
              }
            });
          }
        });
    } catch {
      res.status(401).json({ auth: false, message: "Login ERROR!" });
    }
  },

  profileUser: async (req, res) => {
    try {
      res.status(201).json({ message: "User Profile" });
    } catch {
      res.status(401).json({ message: "No DATA!" });
    }
  },

  // updateUsernameById: async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  //     const { username } = req.body;

  //     await db("all_users")
  //       .where({
  //         id: userId,
  //       })
  //       .update({
  //         username: username,
  //       });

  //     const user = await db("all_users").where({
  //       id: userId,
  //     });

  //     res.status(201).json({
  //       data: user,
  //       message: "Username successfully updated!",
  //     });
  //   } catch {
  //     res.status(201).json({ message: "Unable to change Username!" });
  //   }
  // },
};

module.exports = controller;
