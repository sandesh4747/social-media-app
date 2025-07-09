import { cloudinary } from "../lib/cloudinary.js";
import { commentSchema, postSchema } from "../middleware/validator.js";
import { Post } from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePic")
      .populate("likes", "username profilePic")
      .populate("comments.author", "username profilePic");
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log("Error in getAllPosts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "username profilePic")
      .populate("likes", "username profilePic")
      .populate("comments.author", "username profilePic");

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log("Error in getUserPosts controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = await postSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    if (!content)
      return res.status(400).json({ message: "Post content is required" });

    const images =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    const post = await Post.create({
      content,
      author: userId,
      images,
    });

    await post.populate("author", "username profilePic");
    res
      .status(201)
      .json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log("Error in createPost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profilePic")
      .populate("comments.author", "username profilePic");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log("Error in getSinglePost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content, existingImages } = req.body;
    if (!content)
      return res.status(400).json({ message: "Post content is required" });

    // Parse existing image URLs from frontend
    const preservedImages = JSON.parse(existingImages || "[]");

    // Delete only the images that are not in preservedImages
    const imagesToDelete = post.images.filter(
      (img) => !preservedImages.includes(img.url)
    );

    for (const img of imagesToDelete) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // New uploaded images
    const newUploadedImages =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    // Combine preserved + new images
    const finalImages = [
      ...post.images.filter((img) => preservedImages.includes(img.url)),
      ...newUploadedImages,
    ];

    post.content = content;
    post.images = finalImages;

    await post.save();
    await post.populate("author", "username profilePic");

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log("Error in updatePost controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const toogleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likesCount: post.likes.length,
      message: post.likes.includes(userId) ? "Post liked" : "Post unliked",
    });
  } catch (error) {
    console.log("Error in toogleLike controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = await commentSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = {
      text,
      author: req.user._id,
    };

    post.comments.push(comment);
    await post.save();

    await post.populate("comments.author", "username profilePic");
    res.status(201).json({
      success: true,
      comments: post.comments,
      message: "Comment added successfully",
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log("Error in addComment controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const commentId = req.params.commentId;
  const comment = post.comments.id(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }
  comment.text = text;
  await post.save();
  await post.populate("comments.author", "username profilePic");
  res.status(200).json({
    success: true,
    comments: post.comments,
    message: "Comment edited successfully",
  });
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentId = req.params.commentId;
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // cannot delete comment if user is not the author or post author
    if (
      comment.author.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteComment controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // deleting old images from cloudinary
    if (post.images && post.images.length > 0) {
      for (const img of post.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await post.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller", error);
    res.status(500).json({ message: error.message });
  }
};
