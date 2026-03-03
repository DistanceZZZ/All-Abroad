import { useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { useNavigate, Link } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate form fields
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    // Sign into account with Firebase Authentication
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (firebaseError) {
      setError(firebaseError.message);
    }
  };

  return (
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="textbox"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="textbox"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="teal">
            Login
          </button>
          {error && <p className="error-text">{error}</p>}

          <Link to="/create-account" className="create-account-link">
            Don't have an account? Create Account
          </Link>
        </form>
      </main>
      <Footer />
    </div>
  );
}
