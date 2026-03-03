import { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { useNavigate, useParams } from "react-router";
import LocationOptions from "./LocationOptions.jsx";
import {
  getDatabase,
  ref,
  push as firebasePush,
  onValue,
} from "firebase/database";
import LoadingPage from "./LoadingPage.jsx";
import { getAuth } from "firebase/auth";

export default function NewPointOfInterestPage(props) {
  const [tripsArray, setTripsArray] = useState(null);
  const [studyAbroadTitle, setStudyAbroadTitle] = useState("");
  const { studyAbroadId } = useParams();

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser.uid;

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
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <POIForm
          studyAbroadId={studyAbroadId}
          trips={tripsArray}
          studyAbroadTitle={studyAbroadTitle}
        />
      </main>
      <Footer />
    </div>
  );
}

function POIForm({ studyAbroadId, trips, studyAbroadTitle }) {
  const [poiTitle, setPoiTitle] = useState("");
  const [selectedLocation, setselectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setPoiTitle(newTitle);
    console.log("POI Title changed:", newTitle);
  };

  const handleSelectLocation = (event) => {
    const location = event.target.value;
    setselectedLocation(location);
    console.log("Selected location:", location);
  };

  const handleAddressChange = (event) => {
    const newAddress = event.target.value;
    setAddress(newAddress);
    console.log("Address changed:", newAddress);
  };

  const handleNotesChange = (event) => {
    const newNotes = event.target.value;
    setNotes(newNotes);
    console.log("Notes changed:", newNotes);
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All changes will be lost."
    );
    if (confirmCancel) {
      navigate(`/study-abroad/${studyAbroadId}/points-of-interest`);
    }
  };

  const handleSumbit = (event) => {
    event.preventDefault();

    const trip = trips.find((t) => t.location === selectedLocation);
    const tripId = trip ? trip.firebaseKey : null;

    if (!poiTitle || !address || !notes) {
      alert("Please fill in all fields");
      return;
    }

    if (!tripId) {
      alert("Please select a location");
      return;
    }

    const newPoi = {
      title: poiTitle,
      address: address,
      notes: notes,
    };

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const poisRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}/trips/${tripId}/pointsOfInterest`
    );
    firebasePush(poisRef, newPoi);

    navigate(`/study-abroad/${studyAbroadId}/points-of-interest`);
  };

  return (
    <form onSubmit={handleSumbit}>
      <div className="page-header-simple">
        <p className="subtext">{studyAbroadTitle}</p>
        <h1>Add Point of Interest</h1>
      </div>

      <label htmlFor="titleInput">Title</label>
      <input
        id="titleInput"
        type="text"
        name="titleInput"
        value={poiTitle}
        onChange={handleTitleChange}
      />

      <LocationOptions
        trips={trips}
        selectedLocation={selectedLocation}
        handleSelectLocation={handleSelectLocation}
      />

      <label htmlFor="addressInput">Address</label>
      <input
        id="addressInput"
        type="text"
        name="addressInput"
        value={address}
        onChange={handleAddressChange}
      />

      <label htmlFor="notes">Notes</label>
      <textarea
        id="notes"
        name="notes"
        className="input-notes"
        value={notes}
        onChange={handleNotesChange}
      />
      <div className="button-container">
        <button
          type="button"
          className="button cancel-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className="button save-button">
          Save
        </button>
      </div>
    </form>
  );
}
