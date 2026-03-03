import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { getDatabase, ref, push as firebasePush } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function NewTripPage(props) {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const navigate = useNavigate();
  const { studyAbroadId } = useParams();

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location || !startDate || !endDate || !selectedColor) {
      alert("Please fill in all fields");
      return;
    }

    const newTrip = {
      location: location,
      startDate: startDate,
      endDate: endDate,
      color: selectedColor,
    };

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const tripsRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}/trips`
    );
    firebasePush(tripsRef, newTrip);

    navigate(`/study-abroad/${studyAbroadId}`);
  };

  const handleCancel = (e) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All changes will be lost."
    );
    if (confirmCancel) {
      navigate(`/study-abroad/${studyAbroadId}`);
    }
  };

  const colorOptions = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
  ];

  return (
    <div className="page-container form-page">
      <HeaderBar />
      <main className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="page-header-simple">
            <p className="subtext">Italy Summer 2025</p>
            <h1>Add Trip</h1>
          </div>
          <label htmlFor="locationInput">Location</label>
          <input
            id="locationInput"
            type="text"
            name="locationInput"
            value={location}
            onChange={handleLocationChange}
          />

          <div className="date-range">
            <label htmlFor="start">Start Date:</label>
            <input
              type="date"
              id="start"
              name="start"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <div></div>
            <label htmlFor="end">End Date:</label>
            <input
              type="date"
              id="end"
              name="end"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>

          <div className="trip-color-picker">
            <label className="input-label">
              <h2>Trip Color</h2>
            </label>
            <div className="color-options-container">
              {colorOptions.map((color) => (
                <label key={color}>
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={selectedColor === color}
                    onChange={handleColorChange}
                    hidden
                  />
                  <span
                    className={`color-btn ${color} ${
                      selectedColor === color ? "selected" : ""
                    }`}
                  ></span>
                </label>
              ))}
            </div>
          </div>

          <div className="button-container">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
