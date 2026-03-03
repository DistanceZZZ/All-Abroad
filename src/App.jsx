import { Routes, Route, Navigate } from "react-router";
import HomePage from "./components/HomePage.jsx";
import NewStudyAbroadPage from "./components/NewStudyAbroadPage.jsx";
import WelcomePage from "./components/WelcomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import CreateAccountPage from "./components/CreateAccountPage.jsx";
import StudyAbroadHomePage from "./components/StudyAbroadHomePage.jsx";
import NewTripPage from "./components/NewTripPage.jsx";
import PointsOfInterestPage from "./components/PointsOfInterestPage.jsx";
import NewPointOfInterestPage from "./components/NewPointOfInterestPage.jsx";
import JournalHomePage from "./components/JournalHomePage.jsx";
import NewJournalEntryPage from "./components/NewJournalEntryPage.jsx";
import MainMenu from "./components/MainMenu.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import LoadingPage from "./components/LoadingPage.jsx";

function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    function cleanup() {
      unsubscribe();
    }
    return cleanup;
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}

export default function App(props) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unregisterFunction = onAuthStateChanged(auth, (firebaseUserObj) => {
      if (firebaseUserObj === null) {
        setCurrentUser(null);
      } else {
        setCurrentUser(firebaseUserObj);
      }
    });

    function cleanup() {
      unregisterFunction();
    }
    return cleanup;
  }, []);

  return (
    <Routes>
      <Route path="/welcome" element={<WelcomePage></WelcomePage>}></Route>
      <Route path="/login" element={<LoginPage></LoginPage>}></Route>
      <Route
        path="/create-account"
        element={<CreateAccountPage></CreateAccountPage>}
      ></Route>

      <Route
        index
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/main-menu"
        element={
          <PrivateRoute>
            <MainMenu />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/new-study-abroad"
        element={
          <PrivateRoute>
            <NewStudyAbroadPage />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/study-abroad/:studyAbroadId"
        element={
          <PrivateRoute>
            <StudyAbroadHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/study-abroad/:studyAbroadId/points-of-interest"
        element={
          <PrivateRoute>
            <PointsOfInterestPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/study-abroad/:studyAbroadId/new-point-of-interest"
        element={
          <PrivateRoute>
            <NewPointOfInterestPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/study-abroad/:studyAbroadId/new-trip"
        element={
          <PrivateRoute>
            <NewTripPage />
          </PrivateRoute>
        }
      ></Route>
      <Route
        path="/study-abroad/:studyAbroadId/journal-home"
        element={
          <PrivateRoute>
            <JournalHomePage />
          </PrivateRoute>
        }
      ></Route>

      <Route
        path="/study-abroad/:studyAbroadId/new-journal-entry"
        element={
          <PrivateRoute>
            <NewJournalEntryPage />
          </PrivateRoute>
        }
      ></Route>

      <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
    </Routes>
  );
}
