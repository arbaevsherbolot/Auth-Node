require("dotenv").config();

const router = require("express").Router();
const controller = require("../controllers/Controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/admin-login", controller.admin);
router.post("/profile", controller.profile);

router.post("/notification", controller.sendNotification);

router.post("/posts/create", controller.createPost);

router.put("/posts/update/:id", controller.updatePost);

router.get("/users", controller.users);

router.get("/interns", controller.getInterns);
router.post("/interns/new", controller.createIntern);
router.get("/intern/:id", controller.getIntern);
router.put("/intern/update/:id", controller.updateIntern);

router.get("/posts", controller.posts);
router.get("/post/:id", controller.getPost);

module.exports = router;
