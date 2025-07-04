const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

// blogsRouter.get('/', (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs)
//   })
// })

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: "title and url are required" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  await savedBlog.populate("user", { username: 1, name: 1 });
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  } else {
    return response
      .status(403)
      .json({ error: "only the creator can delete this blog" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes, user } = request.body;

  console.log("title before update:", title);

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, user },
    { new: true, runValidators: true, context: "query" }
  ).populate("user", { username: 1, name: 1 });

  console.log("title after update:", updatedBlog.title);

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const { comment } = request.body;

  if (!comment || comment.trim() === "") {
    return response.status(400).json({ error: "comment content is required" });
  }

  try {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    blog.comments = blog.comments.concat(comment);
    const updatedBlog = await blog.save();

    await updatedBlog.populate("user", { username: 1, name: 1 });
    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = blogsRouter;
