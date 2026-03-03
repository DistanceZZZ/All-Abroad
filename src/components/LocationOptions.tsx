export default function LocationOptions({
  trips,
  handleSelectLocation,
  selectedLocation,
}) {
  return (
    <fieldset>
      <legend>Location</legend>
      {trips.map((trip) => (
        <label htmlFor={trip.tripId} key={trip.firebaseKey}>
          <input
            id={trip.tripId}
            type="radio"
            name="location"
            className="hidden"
            value={trip.location}
            onChange={handleSelectLocation}
            checked={selectedLocation === trip.location}
          />
          <span className={`color-btn ${trip.color}`}>{trip.location}</span>
        </label>
      ))}
    </fieldset>
  );
}
