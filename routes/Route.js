require("dotenv").config();

const router = require("express").Router();
const controller = require("../controllers/Controller");

const multer = require("multer");

const imageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.${file.originalname}`);
  },
});

const isImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, Error("Only images can be uploaded!"));
  }
};

const upload = multer({
  storage: imageConfig,
  fileFilter: isImage,
});

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/admin-login", controller.admin);

router.post("/profile", controller.profile);
router.post("/uploadPhoto", upload.single("photo"), controller.uploadPhoto);

router.post("/posts/create", controller.createPost);

router.put("/posts/update/:id", controller.updatePost);

router.get("/users", controller.users);

router.put("/posts/update/:id", controller.updatePost);
router.get("/posts", controller.posts);
router.get("/post/:id", controller.getPost);

module.exports = router;
