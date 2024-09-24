import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../helpers/AuthContext';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const { setAuthState } = useContext(AuthContext);
  
  let navigate = useNavigate();

  const login = async () => {
    setErrorMessage(""); // Reset error message before new login attempt
    const data = { username, password };

    try {
      const response = await axios.post("http://localhost:3001/auth/login", data);
      if (response.data.error) {
        setErrorMessage(response.data.error); // Set error message from server
      } else {
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error); // Handle server response error
      } else if (error.request) {
        setErrorMessage("No response from server. Please try again."); // Handle no response case
      } else {
        setErrorMessage("An error occurred. Please try again."); // Handle other errors
      }
    }
  };

  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => setUsername(event.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={login}> Login </button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} {/* Display error message */}
    </div>
  );
}

export default Login;
