const express = require("express");
const router = new express.Router();
const authenticate = require("../middleware/authantication");
const controller = require("../controllers/controllers");
const postControllers = require("../controllers/postsController");

// User authentication routes
router.post("/signup", controller.signup);
router.post("/verify-user", controller.verifyUser);
router.post("/login", controller.loginUser);
router.get("/validateuser", authenticate, controller.validateUser );
router.get("/logout", authenticate, controller.logoutUser);
router.post("/reset-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
router.get("/fetch-user", controller.fetchUser);


//Post Routes
router.post("/posts", authenticate, postControllers.makePosts);
router.get("/fetch-posts", authenticate, postControllers.fetchPosts);
router.delete("/delete-posts", authenticate, postControllers.deletePost);
router.patch("/update-posts", authenticate, postControllers.updatePost);
router.get("/fetch-all-posts", postControllers.fetchAllPosts);
router.post("/like", authenticate, postControllers.likeAPost);
router.post("/comment", authenticate, postControllers.commetOnAPost);
router.get("/liked-commented", authenticate, postControllers.fetchLikedAndCommentedPosts);
router.get("/fetchAsinglePost", postControllers.fetchASinglePost);
router.post("/search-post", postControllers.searchPost), 

module.exports = router;