import React from "react";
import { Link } from "react-router";
import { getAuth } from "firebase/auth";

export default function HeaderBar() {
  // Don't show header bar if user is not logged in
  const auth = getAuth();
  const isLoggedIn = auth.currentUser !== null;
  if (!isLoggedIn) {
    return null;
  }

  return (
    <header>
      <div className="nav-bar">
        <Link to="/">
          <img
            className="icon all-abroad-icon"
            src="/img/icons/all-abroad-icon.svg"
            alt="all abroad icon"
          />
        </Link>
        <Link to="/main-menu">
          <img
            className="icon menu-icon"
            src="/img/icons/menu.svg"
            alt="menu icon"
          />
        </Link>
      </div>
    </header>
  );
}
