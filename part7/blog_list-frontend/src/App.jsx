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
import { useUserValue, useUserDispatch } from "./contexts/UserContext";
import Users from "./components/Users";
import { Routes, Route } from "react-router-dom";
import User from "./components/User";
import BlogView from "./components/BlogView";
import Navigation from "./components/Navigation";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useUserValue();
  const userDispatch = useUserDispatch();
  const [blogFormVisible, setBlogFormVisible] = useState(false);
  const [view, setView] = useState("blogs");

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

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "INITIALIZE", payload: user });
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
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      userDispatch({ type: "LOGIN", payload: user });
      setToken(user.token);
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
    userDispatch({ type: "LOGOUT" });
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

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <h1>Blog app</h1>
      <NotificationMessage />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>

              <div style={{ display: blogFormVisible ? "none" : "" }}>
                <button onClick={() => setBlogFormVisible(true)}>
                  create new blog
                </button>
              </div>
              <div style={{ display: blogFormVisible ? "" : "none" }}>
                <BlogForm createBlog={addBlog} />
                <button onClick={() => setBlogFormVisible(false)}>
                  cancel
                </button>
              </div>

              {blogs
                .slice()
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <Blog key={blog.id} blog={blog} />
                ))}
            </div>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  );
};

export default App;
