import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [error, setError] = useState();

  const handleSubmit = (event) => {
    //Prevents website from reloading
    event.preventDefault();

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter your password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
  };

  return (
    <div>
      <h1>Welcome Back!</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />

        <div>
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          {/*<Link to="">Forgot Password?</Link>*/}
          <a href="">Forgot Password?</a>
        </div>
        <button type="submit">Log In</button>

        <div>
          <p>
            Don't have an account?
            {/*<Link to="">Register</Link>*/}
            <a href="">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
