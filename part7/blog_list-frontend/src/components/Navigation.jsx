import { Link } from "react-router-dom";

const Navigation = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5,
  };

  const navStyle = {
    background: "lightgrey",
    padding: 10,
  };

  return (
    <div style={navStyle}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user ? (
        <>
          <span style={padding}>{user.name} logged in</span>
          <button onClick={handleLogout}>logout</button>
        </>
      ) : null}
    </div>
  );
};

export default Navigation;
