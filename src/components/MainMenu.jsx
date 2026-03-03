import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

export default function MainMenu() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [studyAbroadPrograms, setStudyAbroadPrograms] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser.uid;

    const userRef = ref(db, `users/${userId}`);
    const userUnsubscribe = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setUserInfo({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email,
        });
      }
    });

    const studyAbroadsRef = ref(db, `users/${userId}/studyAbroads`);
    const programsUnsubscribe = onValue(studyAbroadsRef, (snapshot) => {
      const programs = snapshot.val();
      if (programs) {
        const programsArray = Object.entries(programs).map(([id, data]) => ({
          id,
          ...data,
        }));
        setStudyAbroadPrograms(programsArray);
      } else {
        setStudyAbroadPrograms([]);
      }
    });

    function cleanup() {
      userUnsubscribe();
      programsUnsubscribe();
    }

    return cleanup;
  }, []);

  // AI generated function
  const handleClose = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/welcome");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="page-container main-menu">
      <main>
        <div className="main-menu-header">
          <div className="menu-group">
            <div></div>
            <button onClick={handleClose} className="icon-button">
              <img
                className="icon"
                src="/img/icons/cross-out.svg"
                alt="close menu"
              />
            </button>
          </div>
          <h1>
            Hello, {userInfo.firstName} {userInfo.lastName}
          </h1>
          <p>{userInfo.email}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <div className="link-list">
          <Link to="/">Home</Link>
          {studyAbroadPrograms.length > 0 ? (
            <ul>
              {studyAbroadPrograms.map((program) => (
                <li key={program.id}>
                  <Link to={`/study-abroad/${program.id}`}>
                    {program.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-programs">No study abroad programs yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
