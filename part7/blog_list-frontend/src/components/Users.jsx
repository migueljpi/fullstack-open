import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/users";
import { Link } from "react-router-dom";

const Users = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (result.isLoading) {
    return <div>loading users...</div>;
  }

  if (result.error) {
    return <div>users service not available due to problems in server</div>;
  }

  const users = result.data;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
