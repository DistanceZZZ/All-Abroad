import React from "react";
import { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import { Link, useParams } from "react-router";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import "../css/journal.css";

export default function JournalHomePage() {
  const { studyAbroadId } = useParams();
  const [journalEntries, setJournalEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [locations, setLocations] = useState([]);
  const [studyAbroadTitle, setStudyAbroadTitle] = useState("");

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

    const unsubscribeTrips = onValue(tripsRef, (snapshot) => {
      const trips = snapshot.val();
      const entries = [];
      const locations = [];

      if (trips) {
        Object.entries(trips).forEach(([tripId, trip]) => {
          locations.push(trip.location);
          if (trip.journalEntries) {
            Object.entries(trip.journalEntries).forEach(([entryId, entry]) => {
              entries.push({
                ...entry,
                entryId,
                tripId,
                location: trip.location,
                color: trip.color || "",
              });
            });
          }
        });
      }
      setJournalEntries(entries);
      setLocations(locations);
    });

    function cleanup() {
      unsubscribeStudyAbroad();
      unsubscribeTrips();
    }
    return cleanup;
  }, [studyAbroadId]);

  useEffect(() => {
    let filtered = [...journalEntries];
    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (entry) => entry.location === selectedLocation
      );
    }
    setFilteredEntries(filtered);
  }, [journalEntries, selectedLocation]);

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
            <h1>Journal</h1>
          </div>
          <Link
            to={`/study-abroad/${studyAbroadId}/new-journal-entry`}
            className="plus-button"
          >
            +
          </Link>
        </div>

        <div className="filters-container">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedLocation("all");
            }}
            className="clear-date-button"
          >
            Clear All
          </button>
        </div>

        <div className="journal-card-list">
          {filteredEntries.length === 0 ? (
            <div className="no-entries-message">
              <p>
                {journalEntries.length === 0
                  ? "No journal entries yet. Click the + button to add your first entry!"
                  : "No entries match the selected filters."}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div className="journal-card" key={entry.entryId}>
                  {entry.imageData && (
                  <img
                    className="journal-card-image"
                    src={entry.imageData}
                    alt={entry.title}
                  />
                )}
                <div className="journal-card-header">
                  <span className="card-title">{entry.title}</span>
                  <span className={`location-bubble ${entry.color}`}>
                    {entry.location}
                  </span>
                </div>
                <div className="icon-group">
                  <img
                    className="icon"
                    src="/img/icons/calendar.svg"
                    alt="calendar icon"
                  />
                  <span className="icon-label">
                    {(() => {
                      const [year, month, day] = entry.date.split("-");
                      const localDate = new Date(year, month - 1, day);
                      return localDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                    })()}
                  </span>
                </div>
                <div className="journal-content">
                  {entry.entry.length > 100
                    ? entry.entry.substring(0, 100) + "..."
                    : entry.entry}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
