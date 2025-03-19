const userDb = require("../Schemas/UserSchema");
const poemsDb = require("../Schemas/poemSchema");
const mongoose = require("mongoose");

//Create a post
exports.makePosts = async (req, res) => {
  try {
    const userId = req.userID;
    const useremail = req.rootUser.useremail;
    const username = req.rootUser.username;
    const { title, author, poem, tags, description } = req.body;

    if (!title || !poem || !description) {
      throw new Error("Please Fill the required fields");
    }

    const findTheUser = await userDb.findOne({ _id: userId });

    if (!findTheUser) {
      throw new Error("Please log in to make a post");
    }

    const newPost = await new poemsDb({
      username,
      userId,
      useremail,
      title,
      author: author || username,
      poem,
      description,
      tags: tags || "Unknown",
    });

    await newPost.save();
    const poems = await poemsDb.find();

    res
      .status(200)
      .json({ success: true, newPost, poems, message: "Post created Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//Fetch all the posts from a specific user
exports.fetchPosts = async (req, res) => {
  try {
    const userId = req.userID;

    if (!userId) {
      throw new Error("Unauthorized access");
    }

    const allPost = await poemsDb.find({ userId });

    res
      .status(200)
      .json({ success: true, allPost, message: "All Posts fetched" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//Delete a post
exports.deletePost = async (req, res) => {
  try {
    const userId = req.userID;
    const { postId } = req.body;
    console.log("Line 62.");

    if (!postId || !userId) {
      throw new Error("Deletion Unsuccessful, please try again");
    }

    const findThePostAndDelete = await poemsDb.findOneAndDelete({
      _id: postId,
      userId,
    });

    if (!findThePostAndDelete) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Post Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//Update a post
exports.updatePost = async (req, res) => {
  try {
    const userId = req.userID;
    const { newTitle, newPoem, postId, newAuthor, newTags } = req.body;

    if (!newTitle || !newPoem) {
      throw new Error("Please enter the new title and body");
    }

    const findThePost = await poemsDb.findOne({ _id: postId, userId });

    if (!findThePost) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const updateData = {};

    if (newTitle) updateData.title = newTitle;
    if (newAuthor) updateData.author = newAuthor;
    if (newTags) updateData.tags = newTags;
    if (newPoem) updateData.poem = newPoem;

    findThePost.edited = true;
    await findThePost.save();

    const newPost = await poemsDb.findByIdAndUpdate(
      { _id: findThePost._id },
      updateData,
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, newPost, message: "Post updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//fetch all of the posts
exports.fetchAllPosts = async (req, res) => {
  try {
    const showAllPosts = await poemsDb.find();

    if (!showAllPosts || showAllPosts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found" });
    }

    res.status(200).json({
      success: true,
      posts: showAllPosts,
      message: "Fetched successfully",
    });
  } catch (error) {
    console.error("Error in fetchAllPosts:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

//Like a post
exports.likeAPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userID;

    const findTheUser = await userDb.findOne({ _id: userId });
    const findThePost = await poemsDb.findOne({ _id: postId });

    if (!findTheUser) {
      throw new Error("Please log in to like a post");
    } else if (findThePost && findTheUser) {
      const isLiked = findThePost.likes.some(
        (likeID) => likeID.toString() === userId.toString()
      );
      if (!isLiked) {
        findThePost.likes.push(userId);
        findTheUser.likedPosts.push(postId);
      } else {
        findThePost.likes = findThePost.likes.filter(
          (likeID) => likeID.toString() !== userId.toString()
        );
        findTheUser.likedPosts = findTheUser.likedPosts.filter(
          (likedPostID) => likedPostID.toString() !== postId.toString()
        );
      }
    } else {
      throw new Error("Some Error occured or cannot finde the post.");
    }

    await findThePost.save();
    await findTheUser.save();

    const totalLikes = findThePost.likes.length;

    res
      .status(200)
      .json({
        success: true,
        post: findThePost.likes,
        totalLikes,
        message: "Liked the post",
        findTheUser,
      });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//Comment on a post
exports.commetOnAPost = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.userID;
    const username = req.rootUser.username;

    const findThePost = await poemsDb.findOne({ _id: postId });
    const findTheUser = await userDb.findOne({ _id: userId });
    if (!userId) {
      throw new Error("Please log in to comment on a post");
    } else if (!postId) {
      throw new Error("Some error occured");
    } else {
      findThePost.comments.push({
        userId,
        comment,
        username,
      });

      if (!findTheUser.commentedPost.includes(postId)) {
        findTheUser.commentedPost.push(postId);
      }
      
    }

    await findTheUser.save();
    await findThePost.save();

    res
      .status(200)
      .json({
        success: true,
        comment,
        message: "Commented on the post",
        findThePost,
        commented: findTheUser.commentedPost,
      });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//All liked posts
exports.fetchLikedAndCommentedPosts = async (req, res) => {
  try {
    const userId = req.userID;

    if (!userId) {
      throw new Error("User not logged in");
    } else {
      const findUser = await userDb.findOne({ _id: userId });
      if (findUser) {
        const likedPosts = await poemsDb.find({ _id: findUser.likedPosts });
        const commentedPosts = await poemsDb.find({
          _id: findUser.commentedPost,
        });

        res.status(200).json({ success: true, likedPosts, commentedPosts });
      }
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};


//Fetch a single post
exports.fetchASinglePost = async (req, res)=>{
  try {
    const postId = req.body

    if(!postId){
      throw new Error("No ID provided");
    }

    const post = await userDb.findOne({_id : postId})

    if(post){
      res.status(200).json({success : true, post, message : "Post fetched successfully"});
    }

  } catch (error) {
    return res.status(400).json({success : false, error : error.message})
  }
}

//Search for a post

exports.searchPost = async(req, res)=>{
  try {
      const {data} = req.body

      if(!data){
        const error = new Error("No data provided");
        error.status = 404;
        throw error;
      }

      const findAllPost = await poemsDb.find()

      const result = findAllPost.filter((poem) => 
        poem.title.toLowerCase().includes(data.toLowerCase()) ||
        (poem.author && poem.author.toLowerCase().includes(data.toLowerCase())) ||
        (poem.username && poem.username.toLowerCase().includes(data.toLowerCase())) ||
        (poem.tags && poem.tags.toLowerCase().includes(data.toLowerCase()))
      );
      
      if(!result || result.length == 0){
        const error = new Error("Desired Post not found")
        error.status = 404
        throw error
      }

      res.status(200).json({success : true, result })

  } catch (error) {

    const status = error.status

    return res.status(status).json({success : false, error: error.message});
  }
}