import axios from "axios";
const baseUrl = "http://localhost:3003/api/blogs";

let token = null;

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

export const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

export const getBlogs = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};
export const updateBlog = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
  return response.data;
};

export const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// export default {
//   getAll: getBlogs,
//   setToken,
//   create: createBlog,
//   update,
//   remove,
// };
