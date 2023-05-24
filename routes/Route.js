require("dotenv").config();

const router = require("express").Router();
const controller = require("../controllers/Controller");

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/users", controller.users);

module.exports = router;
