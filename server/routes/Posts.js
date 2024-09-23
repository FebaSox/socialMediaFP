const express = require("express");
const router = express.Router();
const { Posts } = require("../models");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll(); //Allows us to view a list of every post ever made
  res.json(listOfPosts);
});


router.post("/", async (req, res) => {
  const post = req.body; //Allows us to create post from the server side 
  await Posts.create(post);
  res.json(post);
}); 



module.exports = router;