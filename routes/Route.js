require("dotenv").config();

const router = require("express").Router();
const controller = require("../controllers/Controller");
const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      res.status(403).json({ message: "Failed to get access token!" });
    } else {
      jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).json({
            auth: false,
            message: "Failure authenticating!",
          });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    }
  } catch {
    res.status(401).json({
      auth: false,
      message: "Failure verifying access token!",
    });
  }
};

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/profile", verify, controller.profileUser);

// router.put("/users/:userId", controller.updateUsernameById);

module.exports = router;
