import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ErrorBoundary from "./pages/ErrorBoundary"; // Ensure correct import path

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar"; // Importing Avatar for the profile icon

// Navbar component with Avatar
const Navbar = ({ authState, logout, navigate }) => (
  <div className="navbar">
    <div className="links">
      {!authState.status ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/registration">Registration</Link>
        </>
      ) : (
        <>
          <Link to="/">Home Page</Link>
          <Link to="/createpost">Create A Post</Link>
        </>
      )}
    </div>
    <div className="loggedInContainer">
      {/* Display username and avatar when logged in */}
      {authState.status && (
        <>
          <h1>{authState.username}</h1>
          {/* Avatar as the profile picture */}
          <Avatar
            alt={authState.username}
            src={`/path/to/profile-pictures/${authState.username}.jpg`} // Placeholder for the profile picture
            onClick={() => navigate(`/profile/${authState.id}`)} // Navigate to profile on click
            style={{ cursor: "pointer", marginLeft: "10px" }} // Style the avatar
          />
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  </div>
);

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthState({ ...authState, status: false });
      }
    };

    fetchAuthData();
  }, []);

  const AppContent = () => {
    const navigate = useNavigate();

    const logout = () => {
      localStorage.removeItem("accessToken");
      setAuthState({ username: "", id: 0, status: false });
      navigate("/login");
    };

    return (
      <>
        {/* Pass navigate to Navbar for avatar click */}
        <Navbar authState={authState} logout={logout} navigate={navigate} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </>
    );
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
