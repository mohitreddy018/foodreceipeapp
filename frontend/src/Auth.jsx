import { useState } from "react";
import "./Auth.css";

const API_URL = "http://localhost:5000/api/auth";

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(isSignup ? { name } : {}),
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isSignup) {
        setMessage("Account created! Please log in.");
        setIsSignup(false);
        setPassword("");
      } else {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        onLogin(data.user);
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>🍴 Food Recipe App</h1>
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p>
          {isSignup
            ? "Create an account to explore recipes."
            : "Log in to continue to your recipes."}
        </p>

        {isSignup && (
          <input
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {message && <p className="auth-message">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isSignup
            ? "Sign Up"
            : "Log In"}
        </button>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New to the app?"}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;