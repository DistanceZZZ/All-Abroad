import { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { Link } from "react-router";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import "../css/home.css";
import LoadingPage from "./LoadingPage.jsx";

export default function HomePage() {
  const [studyAbroadProgramsArray, setStudyAbroadProgramsArray] =
    useState(null);

  function handleDelete(firebaseKey) {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser.uid;

    if (!window.confirm("Delete this program?")) return;

    const programRef = ref(db, `users/${userId}/studyAbroads/${firebaseKey}`);
    remove(programRef).catch((err) => {
      console.error("Delete failed:", err);
      alert("Could not delete. Try again.");
    });
  }

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser.uid;
    const studyAbroadsRef = ref(db, `users/${userId}/studyAbroads`);
    const unsubscribe = onValue(studyAbroadsRef, function (snapshot) {
      const studyAbroadProgramsObject = snapshot.val();
      const studyAbroadProgramsArray =
        studyAbroadProgramsObject === null
          ? []
          : Object.keys(studyAbroadProgramsObject).map((key) => {
              return { firebaseKey: key, ...studyAbroadProgramsObject[key] };
            });
      setStudyAbroadProgramsArray(studyAbroadProgramsArray);
    });

    function cleanup() {
      unsubscribe();
    }
    return cleanup;
  }, []);

  if (!studyAbroadProgramsArray) return <LoadingPage />;

  return (
    <div className="home page-container">
      <HeaderBar />
      <main>
        <div className="index-header">
          <h1>My Study Abroads</h1>
          <Link to="/new-study-abroad" className="plus-button">
            +
          </Link>
        </div>
        <section className="study-abroad-list">
          {studyAbroadProgramsArray.length === 0
            ? "You haven't created any study abroad programs yet. Click the + button above to get started!"
            : studyAbroadProgramsArray.map(({ firebaseKey, title, img }) => (
                <Link to={`study-abroad/${firebaseKey}`} key={firebaseKey}>
                  <div className="study-abroad-card">
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(firebaseKey);
                      }}
                    >
                      Delete
                    </button>
                    <img src={img} alt={title} />
                    <h2>{title}</h2>
                  </div>
                </Link>
              ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
