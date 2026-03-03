import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import HeaderBar from "./HeaderBar.jsx";
import Footer from "./Footer.jsx";
import "../css/study-abroad-home.css";
import "../css/calendar.css";
import LoadingPage from "./LoadingPage.jsx";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function StudyAbroadHome() {
  const [studyAbroad, setStudyAbroad] = useState();
  const [tripsArray, setTripsArray] = useState([]);
  const [date, setDate] = useState(new Date());
  const { studyAbroadId } = useParams();

  // Subscribe to changes to the database
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userId = auth.currentUser.uid;
    const studyAbroadRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}`
    );
    const tripsRef = ref(
      db,
      `users/${userId}/studyAbroads/${studyAbroadId}/trips`
    );

    const unsubscribeStudyAbroad = onValue(studyAbroadRef, function (snapshot) {
      const studyAbroad = snapshot.val();
      setStudyAbroad(studyAbroad);
    });

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
  }, [studyAbroadId]);

  if (!studyAbroad) return <LoadingPage />;

  const events = tripsArray.map((trip) => ({
    id: trip.firebaseKey,
    title: trip.location,
    start: new Date(trip.startDate),
    end: new Date(trip.endDate),
    allDay: true,
    resource: trip,
  }));

  return (
    <div className="study-abroad-home page-container">
      <HeaderBar />
      <main>
        <div className="page-header">
          <Link to="/">
            <img src="/img/icons/left-chevron.svg" alt="back icon" />
          </Link>
          <div>
            <h1>{studyAbroad.title}</h1>
          </div>
          <div></div>
        </div>
        <div className="calendar-container">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            views={["month"]}
            defaultView="month"
            date={date}
            onNavigate={(newDate) => {
              setDate(newDate);
            }}
            components={{
              toolbar: CustomToolbar,
            }}
            eventPropGetter={(event) => ({
              className: "calendar-event",
              style: {
                backgroundColor: `var(--${event.resource.color})`,
                borderRadius: "4px",
              },
            })}
          />
        </div>
        <Link className="no-link-styling" to={`points-of-interest`}>
          <div className="study-abroad-info">
            <img src="/img/icons/sparkle.svg" alt="sparkle icon" />
            <p>Points of Interest</p>
            <img src="/img/icons/right-chevron.svg" alt="right-chevron" />
          </div>
        </Link>
        <Link className="no-link-styling" to={`journal-home`}>
          <div className="study-abroad-info">
            <img src="/img/icons/journal.svg" alt="journal icon" />
            <p>Journal</p>
            <img src="/img/icons/right-chevron.svg" alt="right-chevron" />
          </div>
        </Link>
      </main>
      <Footer />
    </div>
  );
}

// Custom Toolbar for Calendar
const CustomToolbar = ({ date, onNavigate }) => {
  const formattedDate = format(date, "MMMM yyyy");
  const { studyAbroadId } = useParams();

  return (
    <div className="calendar-header">
      <div className="month-section">
        <button onClick={() => onNavigate("PREV")} className="nav-button">
          <img src="/img/icons/left-chevron.svg" alt="previous month" />
        </button>
        <h2>{formattedDate}</h2>
        <button onClick={() => onNavigate("NEXT")} className="nav-button">
          <img src="/img/icons/right-chevron.svg" alt="next month" />
        </button>
      </div>
      <Link
        to={`/study-abroad/${studyAbroadId}/new-trip`}
        className="add-trip plus-button no-link-styling"
      >
        Add Trip +
      </Link>
    </div>
  );
};
