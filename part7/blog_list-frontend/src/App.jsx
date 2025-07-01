import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import loginService from "./services/login";
import NotificationMessage from "./components/NotificationMessage";
import BlogForm from "./components/BlogForm";
import { useNotificationDispatch } from "./contexts/NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  createBlog,
  setToken,
  updateBlog,
  deleteBlog,
} from "./services/blogs";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogFormVisible, setBlogFormVisible] = useState(false);

  const notificationDispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: {
          message: `A new blog "${newBlog.title}" by ${newBlog.author} added!`,
          type: "success",
        },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
      setBlogFormVisible(false);
    },
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
    onSuccess: (_, deletedBlogId) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Blog deleted successfully", type: "success" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setToken(user.token);
    }
  }, []);

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.error) {
    return <div>blog service not available due to problems in server</div>;
  }

  const blogs = result.data;

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      console.log("Login response:", user);
      console.log("Token received:", user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: `logged in as ${user.username}`, type: "success" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    } catch (exception) {
      console.error("Login failed:", exception);
      notificationDispatch({
        type: "SET_NOTIFICATION",
        payload: { message: "Wrong username or password", type: "error" },
      });
      setTimeout(
        () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
        4000,
      );
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setToken(null);
    notificationDispatch({
      type: "SET_NOTIFICATION",
      payload: { message: "logged out", type: "success" },
    });
    setTimeout(
      () => notificationDispatch({ type: "CLEAR_NOTIFICATION" }),
      4000,
    );
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const handleLike = (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
    };
    likeBlogMutation.mutate({ id: blog.id, updatedBlog });
  };

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <NotificationMessage />
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <NotificationMessage />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <div style={{ display: blogFormVisible ? "none" : "" }}>
        <button onClick={() => setBlogFormVisible(true)}>
          create new blog
        </button>
      </div>
      <div style={{ display: blogFormVisible ? "" : "none" }}>
        <BlogForm createBlog={addBlog} />
        <button onClick={() => setBlogFormVisible(false)}>cancel</button>
      </div>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
    </div>
  );
};

export default App;
