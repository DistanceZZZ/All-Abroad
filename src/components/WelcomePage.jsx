import React from "react";
import { useNavigate, Link } from "react-router";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import "../css/onboarding.css";

export default function WelcomePage(props) {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/login");
  }

  function handleCreateAccountClick() {
    navigate("/create-account");
  }

  return (
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <form>
          <h2 className="welcome-message">Welcome to All Abroad!</h2>
          <div className="welcome-images">
            <img src="/img/denmark.jpeg" alt="A castle in Denmark" />
            <img src="/img/peru.jpg" alt="Machu Picchu in Peru" />
            <img src="/img/japan.jpg" alt="Cherry blossoms in Japan" />
          </div>
          <p>
            The all-in-one platform for study abroad students to organize trips,
            capture memories, and connect with friends during their
            international journey.
          </p>
          <button type="button" className="teal" onClick={handleLoginClick}>
            Login
          </button>
          <button
            type="button"
            className="teal"
            onClick={handleCreateAccountClick}
          >
            Create Account
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
