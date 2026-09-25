import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85";

const formatDate = (dateValue) => {
  if (!dateValue) return "—";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getNights = (booking) => {
  if (Number.isFinite(Number(booking?.numberOfNights))) {
    const parsed = Number(booking.numberOfNights);
    if (parsed > 0) return parsed;
  }

  const checkIn = booking?.checkIn ? new Date(booking.checkIn) : null;
  const checkOut = booking?.checkOut ? new Date(booking.checkOut) : null;

  if (!checkIn || !checkOut || Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return null;
  }

  const diffMs = checkOut.getTime() - checkIn.getTime();
  if (diffMs <= 0) return 1;

  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
};

const getStatusClass = (status) => {
  const normalized = String(status || "Pending").toLowerCase();
  return `booking-status booking-status--${normalized}`;
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.bookings || [];

      setBookings(data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to load your bookings.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully.");
      await fetchBookings();
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to cancel this booking.";

      toast.error(message);
    }
  };

  if (loading) {
    return (
      <main className="my-bookings-page">
        <div className="my-bookings-shell">
          <div className="my-bookings-header">
            <span className="section-eyebrow">YOUR JOURNEY</span>
            <h1>My Bookings</h1>
            <p>Manage your reservations and keep track of your upcoming stays.</p>
          </div>

          <div className="my-bookings-skeleton-list" aria-label="Loading bookings">
            {[1, 2].map((item) => (
              <div key={item} className="my-bookings-skeleton-card">
                <div className="my-bookings-skeleton-image" />
                <div className="my-bookings-skeleton-content">
                  <div className="my-bookings-skeleton-line my-bookings-skeleton-line--wide" />
                  <div className="my-bookings-skeleton-line my-bookings-skeleton-line--medium" />
                  <div className="my-bookings-skeleton-line my-bookings-skeleton-line--short" />
                  <div className="my-bookings-skeleton-grid">
                    <div className="my-bookings-skeleton-line" />
                    <div className="my-bookings-skeleton-line" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error && !loading) {
    return (
      <main className="my-bookings-page">
        <div className="my-bookings-shell">
          <section className="my-bookings-header">
            <span className="section-eyebrow">YOUR JOURNEY</span>
            <h1>My Bookings</h1>
            <p>Manage your reservations and keep track of your upcoming stays.</p>
          </section>

          <div className="my-bookings-error" role="alert">
            <AlertTriangle size={40} />
            <h2>We couldn’t load your bookings</h2>
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={fetchBookings}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-shell">
        <section className="my-bookings-header">
          <span className="section-eyebrow">YOUR JOURNEY</span>
          <h1>My Bookings</h1>
          <p>Manage your reservations and keep track of your upcoming stays.</p>
        </section>

        {bookings.length === 0 ? (
          <div className="my-bookings-empty">
            <CalendarDays size={44} />
            <h2>No bookings yet</h2>
            <p>Your next memorable stay is waiting to be discovered.</p>
            <Link to="/hotels" className="btn btn-primary">
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="my-bookings-list">
            {bookings.map((booking) => {
              const hotel = booking.hotel || {};
              const room = booking.room || {};
              const status = booking.status || "Pending";
              const nights = getNights(booking);
              const isCancellable = !["Cancelled", "Completed"].includes(status);

              return (
                <article className="booking-card" key={booking._id || booking.id}>
                  <div className="booking-card-image">
                    <img
                      src={hotel.images?.[0] || FALLBACK_IMAGE}
                      alt={hotel.name || "Hotel room"}
                    />
                  </div>

                  <div className="booking-card-content">
                    <div className="booking-card-header">
                      <div className="booking-card-intro">
                        <span className="booking-section-label">Hotel</span>
                        <h2>{hotel.name || "Hotel stay"}</h2>

                        {hotel.location && (
                          <div className="booking-location">
                            <MapPin size={15} />
                            <span>{hotel.location}</span>
                          </div>
                        )}
                      </div>

                      <span className={getStatusClass(status)}>{status}</span>
                    </div>

                    <div className="booking-detail-grid">
                      <div className="booking-detail-tile">
                        <span className="booking-detail-label">
                          <BedDouble size={14} />
                          Room
                        </span>
                        <strong>
                          {room.type || "Room"}
                          {room.roomNumber ? ` · ${room.roomNumber}` : ""}
                        </strong>
                      </div>

                      <div className="booking-detail-tile">
                        <span className="booking-detail-label">
                          <CalendarDays size={14} />
                          Check-in
                        </span>
                        <strong>{formatDate(booking.checkIn)}</strong>
                      </div>

                      <div className="booking-detail-tile">
                        <span className="booking-detail-label">
                          <CalendarDays size={14} />
                          Check-out
                        </span>
                        <strong>{formatDate(booking.checkOut)}</strong>
                      </div>

                      <div className="booking-detail-tile">
                        <span className="booking-detail-label">
                          <Users size={14} />
                          Guests
                        </span>
                        <strong>
                          {Number(booking.guests || 0)} {Number(booking.guests || 0) === 1 ? "Guest" : "Guests"}
                        </strong>
                      </div>
                    </div>

                    <div className="booking-card-footer">
                      <div className="booking-price-box">
                        <div className="booking-price-topline">
                          <Wallet size={14} />
                          Total stay
                        </div>
                        <strong>PKR {Number(booking.totalPrice || 0).toLocaleString()}</strong>
                        {nights ? (
                          <small>{nights} night{nights > 1 ? "s" : ""}</small>
                        ) : null}
                      </div>

                      {isCancellable && (
                        <button
                          type="button"
                          className="booking-cancel-button"
                          onClick={() => handleCancel(booking._id)}
                        >
                          <XCircle size={16} />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyBookings;