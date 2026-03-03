import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  push as firebasePush,
  onValue,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useParams, useNavigate } from "react-router";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import LocationOptions from "./LocationOptions.jsx";
import "../css/journal.css";
import LoadingPage from "./LoadingPage.jsx";


export default function NewJournalEntryPage() {
  const { studyAbroadId } = useParams();
  const [studyAbroadTitle, setStudyAbroadTitle] = useState("");

  useEffect(() => {
    const auth = getAuth(); 
    const userId = auth.currentUser.uid;
    const db = getDatabase(); 
    const studyAbroadRef = ref(db, `users/${userId}/studyAbroads/${studyAbroadId}`);

    const unsubscribeStudyAbroad = onValue(studyAbroadRef, (snapshot) => {
      const studyAbroad = snapshot.val();
      if (studyAbroad) {
        setStudyAbroadTitle(studyAbroad.title || "");
      }
    });

    function cleanup() {
      unsubscribeStudyAbroad();
    }
    return cleanup;
  }, [studyAbroadId]);

  return (
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <JournalEntryForm
          studyAbroadId={studyAbroadId}
          studyAbroadTitle={studyAbroadTitle}
        />
      </main>
      <Footer />
    </div>
  );
}

function JournalEntryForm({ studyAbroadId, studyAbroadTitle }) {
  const [tripsArray, setTripsArray] = useState();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState();
  const [entry, setEntry] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser.uid;
    const tripsRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}/trips`
    );
    const unsubscribe = onValue(tripsRef, function (snapshot) {
      const tripsObject = snapshot.val();
      const tripsArray =
        tripsObject === null
          ? []
          : Object.keys(tripsObject).map((key) => ({
              firebaseKey: key,
              ...tripsObject[key],
            }));
      setTripsArray(tripsArray);
    });

    function cleanup() {
      unsubscribe();
    }
    return cleanup;
  }, []);

  if (!tripsArray) return <LoadingPage />;

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Cancel this journal entry? All changes will be lost."
    );
    if (confirmCancel) {
      navigate(`/study-abroad/${studyAbroadId}/journal-home`);
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();

    const selectedTrip = tripsArray.find((t) => t.location === location);
    const tripId = selectedTrip ? selectedTrip.firebaseKey : null;

    if (!title || !date || !location || !entry) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!tripId) {
      alert("Please select a valid location.");
      return;
    }
    
    let imageData = null;
    if (imageFile) {
      imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }

    const newEntry = {
      title,
      date,
      location,
      entry,
      ...(imageData && { imageData }),  // embed directly (AI Generated)
    };

    const journalRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}/trips/${tripId}/journalEntries`
    );

    await firebasePush(journalRef, newEntry)
      .then(() => {
        navigate(`/study-abroad/${studyAbroadId}/journal-home`);
      })
      .catch((error) => {
        alert("Error saving journal entry: " + error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="page-header-simple">
        <p className="subtext">{studyAbroadTitle}</p>
        <h1>New Journal Entry</h1>
      </div>

      <label htmlFor="journalTitle">Title</label>
      <input
        id="journalTitle"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="journalDate">Date</label>
      <input
        id="journalDate"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <LocationOptions
        trips={tripsArray}
        handleSelectLocation={handleLocationChange}
        selectedLocation={location}
      />

      <label htmlFor="journalText">Journal</label>
      <textarea
        id="journalText"
        className="input-notes"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <label htmlFor="journalImage">Add Image</label>
      <input
        id="journalImage"
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
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
