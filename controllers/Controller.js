require("dotenv").config();

const db = require("../connections/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const controller = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);

      await db("users").insert({
        username: username,
        email: email,
        password: hashPassword,
      });

      res.status(201).json({ message: "User is successfully registered!" });
    } catch {
      res.status(404).json({ message: "Username already exists!" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      await db("users")
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

  profile: async (req, res) => {
    console.log(req.body);
  },

  users: async (req, res) => {
    try {
      const users = await db("users");

      res.status(200).json(users);
    } catch {
      res.status(404).json({
        message: "No data in the database!",
      });
    }
  },

  admin: async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = {
        username: "thearbaev",
        email: "sherbolot@wedevx.co",
        password: "wedevx2023s",
      };

      if (username === admin.username && password === admin.password) {
        const token = jwt.sign(
          { username: admin.username, email: admin.email },
          process.env.JWT_ACCESS_SECRET_KEY
        );

        return res.json({
          auth: true,
          token: token,
          data: admin,
          message: "Admin is successfully logged in!",
        });
      } else {
        return res.json({
          auth: false,
          message: "Failed to log in!",
        });
      }
    } catch {
      res.json({
        auth: false,
        message: "Login ERROR!",
      });
    }
  },

  posts: async (req, res) => {
    const posts = await db("myposts");

    try {
      res.status(200).json({
        posts: posts,
      });
    } catch {
      res.json({
        auth: false,
        message: "The posts don't exist!",
      });
    }
  },

  getPost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await db("myposts").where({ id: id });

      res.json({ status: 200, post: post });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  },

  createPost: async (req, res) => {
    try {
      const { img, title, short_desc, description, date, type } = req.body;

      const newPost = await db("myposts").insert({
        img: img,
        title: title,
        short_desc: short_desc,
        description: description,
        date: date,
        type: type,
      });

      res.json({ status: 200, post: newPost });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { img, title, short_desc, description, date, type } = req.body;

      const updatePost = await db("myposts").where({ id: id }).update({
        img: img,
        title: title,
        short_desc: short_desc,
        description: description,
        date: date,
        type: type,
      });

      res.json({ status: 200, post: updatePost });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  },
};

module.exports = controller;
