import { useState } from "react";
import { useNavigate, Link } from "react-router";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set as firebaseSet } from "firebase/database";
import "../css/onboarding.css";

export default function CreateAccountPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleCreateAccount(e) {
    e.preventDefault();
    // Validate form fields
    if (!firstName || !lastName || !email || !password || !verifyPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Add new user account
    try {
      // Add user to Firebase Authentication
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");

      // Add user to Firebase Realtime Database
      const newUser = {
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const db = getDatabase();
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      firebaseSet(userRef, newUser);
    } catch (firebaseError) {
      setError(firebaseError.message);
    }
  };

  return (
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <form onSubmit={handleCreateAccount}>
          <h1>Create Account</h1>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            className="textbox"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            className="textbox"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="textbox"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="textbox"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="verify-password">Verify Password</label>
          <input
            type="password"
            id="verify-password"
            className="textbox"
            placeholder="Verify Password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
          <button type="submit" className="teal">
            Create Account
          </button>
          {error && <p className="error-text">{error}</p>}
          <Link to="/login">Already have an account? Login</Link>
        </form>
      </main>
      <Footer />
    </div>
  );
}
