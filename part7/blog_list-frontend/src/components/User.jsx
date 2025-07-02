import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/users";

const User = () => {
  const { id } = useParams();

  const result = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (result.isLoading) {
    return <div>loading...</div>;
  }

  if (result.error) {
    return <div>user service not available due to problems in server</div>;
  }

  const users = result.data;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
