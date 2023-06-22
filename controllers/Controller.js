require("dotenv").config();

const db = require("../connections/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

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
    const { username } = req.body;

    await db("users")
      .where({
        username: username,
      })
      .then((result) => {
        res.json({ auth: true, userinfo: result[0] });
      })
      .catch(() => {
        res.json({ auth: false, message: "User is not defind!" });
      });
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
        password: "wedevx2023Sherbolot30092006",
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
    const posts = await db("all_my_posts");

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

      const post = await db("all_my_posts").where({ id: id });

      res.json({ status: 200, post: post });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  },

  createPost: async (req, res) => {
    try {
      const {
        img,
        img2,
        subtitle,
        subtitle2,
        subtitle3,
        title,
        short_desc,
        description,
        description2,
        description3,
        description4,
        date,
        type,
        likes,
      } = req.body;

      const newPost = await db("all_my_posts").insert({
        img: img,
        img2: img2,
        title: title,
        subtitle: subtitle,
        subtitle2: subtitle2,
        subtitle3: subtitle3,
        short_desc: short_desc,
        description: description,
        description2: description2,
        description3: description3,
        description4: description4,
        date: date,
        type: type,
        likes_post: likes,
      });

      res.json({ status: 200, post: newPost });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        img,
        img2,
        subtitle,
        subtitle2,
        subtitle3,
        title,
        short_desc,
        description,
        description2,
        description3,
        description4,
        date,
        type,
        likes,
      } = req.body;

      const updatePost = await db("all_my_posts").where({ id: id }).update({
        img: img,
        img2: img2,
        title: title,
        subtitle: subtitle,
        subtitle2: subtitle2,
        subtitle3: subtitle3,
        short_desc: short_desc,
        description: description,
        description2: description2,
        description3: description3,
        description4: description4,
        date: date,
        type: type,
        likes_post: likes,
      });

      res.json({ status: 200, post: updatePost });
    } catch (err) {
      res.json({ status: 400, message: err.message });
    }
  },

  sendNotification: async (req, res) => {
    try {
      const emails = await db("users").select("email");
      const { subject, text } = req.body;

      const notification = {
        to: emails,
        from: "sherbolot@wedevx.co",
        subject: `${subject}`,
        text: `${text}`,
        html: `<h1>${subject}</h1>`,
      };

      sendGrid.send(notification);

      res.send(`Notification successfully sent! ${emails.length}guys`);
    } catch {
      console.log("SENDGRID ERROR!!!");
    }
  },

  getInterns: async (req, res) => {
    try {
      const interns = await db("interns_wedevx");

      res.status(201).json({ interns: interns });
    } catch (e) {
      console.log(e.message);
    }
  },

  createIntern: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        specialty,
        phoneNumber,
        email,
        location,
        remote,
      } = req.body;

      await db("interns_wedevx").insert({
        firstName: firstName,
        lastName: lastName,
        specialty: specialty,
        phoneNumber: phoneNumber,
        email: email,
        location: location,
        remote: remote,
      });

      res.status(201).json({
        message: "New intern has been successfully added to the database...",
      });
    } catch (e) {
      console.log(e.message);
    }
  },

  getIntern: async (req, res) => {
    try {
      const intern = await db("interns_wedevx").where({ id: req.params.id });

      res.status(201).json({ intern: intern });
    } catch (e) {
      console.log(e.message);
    }
  },

  updateIntern: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        specialty,
        phoneNumber,
        email,
        location,
        remote,
      } = req.body;

      await db("interns_wedevx").where({ id: req.params.id }).update({
        firstName: firstName,
        lastName: lastName,
        specialty: specialty,
        phoneNumber: phoneNumber,
        email: email,
        location: location,
        remote: remote,
      });

      res.status(201).json({
        message: "Intern has been successfully updated to the database...",
      });
    } catch (e) {
      console.log(e.message);
    }
  },

  editProfile: async (req, res) => {
    try {
      const { username, userinfo } = req.body;

      await db("users")
        .where({
          username: username,
        })
        .update({
          photo: userinfo.photo,
          FirstName: userinfo.FirstName,
          LastName: userinfo.LastName,
        });
    } catch (e) {
      res.status(404).json({ message: "ERROR" });
    }
  },
};

module.exports = controller;
