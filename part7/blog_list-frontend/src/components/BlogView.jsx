import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogs, updateBlog, deleteBlog } from "../services/blogs";
import { useUserValue } from "../contexts/UserContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import { useState } from "react";
import { addComment } from "../services/blogs";

const BlogView = () => {
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const user = useUserValue();
  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => updateBlog(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: {
          message: `You liked "${updatedBlog.title}"`,
          type: "success",
        },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    },
    onError: () => {
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Failed to like blog", type: "error" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Blog deleted successfully", type: "success" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
      window.location.href = "/";
    },
    onError: () => {
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Failed to delete blog", type: "error" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ id, comment }) => addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setComment("");
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Comment added successfully", type: "success" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    },
    onError: () => {
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Failed to add comment", type: "error" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    },
  });

  const handleAddComment = (event) => {
    event.preventDefault();
    if (comment.trim()) {
      addCommentMutation.mutate({ id: blog.id, comment });
    }
  };

  if (result.isLoading) {
    return <div>loading...</div>;
  }

  if (result.error) {
    return <div>blog service not available due to problems in server</div>;
  }

  const blogs = result.data;
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  const isOwner = user && blog.user && blog.user.username === user.username;

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    likeBlogMutation.mutate({ id: blog.id, updatedBlog });
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  const blogStyle = {
    margintop: 10,
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {isOwner && <button onClick={handleDelete}>delete</button>}
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">add comment</button>
      </form>
      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
};

export default BlogView;
