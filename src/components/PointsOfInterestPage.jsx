import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import "../css/points-of-interest.css";
import LoadingPage from "./LoadingPage.jsx";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

export default function PointsOfInterestPage() {
  const [tripsArray, setTripsArray] = useState();
  const [studyAbroadTitle, setStudyAbroadTitle] = useState("");
  const { studyAbroadId } = useParams();

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const studyAbroadRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}`
    );
    const unsubscribeStudyAbroad = onValue(studyAbroadRef, (snapshot) => {
      const studyAbroad = snapshot.val();
      if (studyAbroad) {
        setStudyAbroadTitle(studyAbroad.title || "");
      }
    });

    const tripsRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}/trips`
    );
    const unsubscribeTrips = onValue(tripsRef, function (snapshot) {
      const tripsObject = snapshot.val();
      const tripsArray =
        tripsObject === null
          ? []
          : Object.keys(tripsObject).map((key) => {
              return { firebaseKey: key, ...tripsObject[key] };
            });
      setTripsArray(tripsArray);
    });

    function cleanup() {
      unsubscribeStudyAbroad();
      unsubscribeTrips();
    }
    return cleanup;
  }, []);

  if (!tripsArray) return <LoadingPage />;

  return (
    <div className="page-container">
      <HeaderBar />
      <main>
        <div className="page-header">
          <Link to={`/study-abroad/${studyAbroadId}`}>
            <img src="/img/icons/left-chevron.svg" alt="back icon" />
          </Link>
          <div>
            <p className="subtext">{studyAbroadTitle}</p>
            <h1>Points of Interest</h1>
          </div>
          <div>
            <Link
              to={`/study-abroad/${studyAbroadId}/new-point-of-interest`}
              className="plus-button"
            >
              +
            </Link>
          </div>
        </div>
        {tripsArray.map((trip) => {
          return <TripSection key={trip.location} trip={trip} />;
        })}
      </main>
      <Footer />
    </div>
  );
}

function TripSection({ trip }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pointsOfInterest, location, color } = trip;

  const keyArray = pointsOfInterest ? Object.keys(pointsOfInterest) : [];
  const pois = keyArray.map((key) => {
    const poi = pointsOfInterest[key];
    poi.firebaseKey = key;
    return poi;
  });

  return (
    <div className={`accordion-item ${color}`}>
      <button className="accordion-button" onClick={() => setIsOpen(!isOpen)}>
        {location}
        <span className="accordion-icon">{isOpen ? "▾" : "▸"}</span>
      </button>

      {isOpen && (
        <div className="accordion-body">
          {pois && pois.length > 0 ? (
            <div className="city-details">
              {pois.map((poi) => (
                <POICard key={poi.firebaseKey} poiData={poi} color={color} />
              ))}
            </div>
          ) : (
            <div className={`no-pois ${color}`}>
              <p>No POIs added yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function POICard({ poiData, color }) {
  const { title, address, notes } = poiData;
  return (
    <div className={`poi-card ${color}`}>
      <div className="card-content">
        <p className="poi-title">{title}</p>
        <div className="poi-address">
          <img
            className="pin-icon"
            src="/img/icons/map-pin.svg"
            alt="Map pin"
          />
          {address}
        </div>
        <p className="poi-notes">{notes}</p>
      </div>
    </div>
  );
}
