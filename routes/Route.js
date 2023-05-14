require("dotenv").config();

const router = require("express").Router();
const controller = require("../controllers/Controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/", (req, res) => {
  res.json({
    cookies: req.cookies,
  });
});

module.exports = router;
