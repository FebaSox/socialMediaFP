const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    res.json({ listOfPosts, likedPosts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Posts.findByPk(id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [Likes],
    });
    res.json(listOfPosts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user's posts." });
  }
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  
  try {
    const newPost = await Posts.create(post);
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post." });
  }
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  
  try {
    const updatedPost = await Posts.update({ title: newTitle }, { where: { id } });
    if (updatedPost[0] === 0) {
      res.status(404).json({ error: "Post not found." });
    } else {
      res.json(newTitle);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update post title." });
  }
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  
  try {
    const updatedPost = await Posts.update({ postText: newText }, { where: { id } });
    if (updatedPost[0] === 0) {
      res.status(404).json({ error: "Post not found." });
    } else {
      res.json(newText);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update post text." });
  }
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  
  try {
    const deleted = await Posts.destroy({ where: { id: postId } });
    if (deleted) {
      res.json("Deleted successfully.");
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post." });
  }
});

module.exports = router;
