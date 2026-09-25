import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Users, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const { hotel, room } = location.state || {};

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [loading, setLoading] = useState(false);

  if (!hotel || !room) {
    return (
      <main className="booking-page">
        <div className="container booking-empty">
          <h2>Booking information is missing</h2>

          <p>
            Please select a room from a hotel before
            continuing with your booking.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/hotels")}
          >
            Browse Hotels
          </button>
        </div>
      </main>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateNights = () => {
    if (!form.checkIn || !form.checkOut) {
      return 0;
    }

    const checkIn = new Date(form.checkIn);
    const checkOut = new Date(form.checkOut);

    const difference =
      checkOut.getTime() - checkIn.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  const totalPrice =
    nights > 0
      ? nights * Number(room.price || 0)
      : 0;

  const validateBooking = () => {
    if (!form.checkIn || !form.checkOut) {
      toast.error(
        "Please select both check-in and check-out dates."
      );

      return false;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);

    if (checkInDate < todayDate) {
      toast.error(
        "Check-in date cannot be in the past."
      );

      return false;
    }

    if (checkOutDate <= checkInDate) {
      toast.error(
        "Check-out date must be after check-in date."
      );

      return false;
    }

    const guests = Number(form.guests);
    const capacity = Number(room.capacity);

    if (!Number.isInteger(guests) || guests < 1) {
      toast.error(
        "Guests must be at least 1."
      );

      return false;
    }

    if (guests > capacity) {
      toast.error(
        `This room can accommodate up to ${capacity} guests.`
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateBooking()) {
      return;
    }

    try {
      setLoading(true);

      await api.post("/bookings", {
        hotel: hotel._id,
        room: room._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
      });

      toast.success(
        "Booking created successfully!"
      );

      navigate("/my-bookings");
    } catch (error) {
      console.error(
        "Failed to create booking:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <section className="booking-header">
        <div className="container">
          <button
            type="button"
            className="booking-back"
            onClick={() =>
              navigate(`/hotels/${hotel._id}`)
            }
          >
            <ArrowLeft size={17} />
            Back to hotel
          </button>

          <span className="section-eyebrow">
            HOTELHUB RESERVATION
          </span>

          <h1>Complete your booking</h1>

          <p>
            Reserve your room and prepare for an
            exceptional stay.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container booking-layout">
          {/* Booking Form */}
          <div className="booking-form-card">
            <div className="booking-card-heading">
              <span className="section-eyebrow">
                YOUR STAY
              </span>

              <h2>Reservation details</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="booking-form-grid">
                {/* Check-in */}
                <div className="booking-field">
                  <label htmlFor="checkIn">
                    Check-in
                  </label>

                  <div className="booking-input-wrapper">
                    <CalendarDays size={18} />

                    <input
                      id="checkIn"
                      name="checkIn"
                      type="date"
                      value={form.checkIn}
                      onChange={handleChange}
                      min={today}
                      required
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="booking-field">
                  <label htmlFor="checkOut">
                    Check-out
                  </label>

                  <div className="booking-input-wrapper">
                    <CalendarDays size={18} />

                    <input
                      id="checkOut"
                      name="checkOut"
                      type="date"
                      value={form.checkOut}
                      onChange={handleChange}
                      min={
                        form.checkIn || today
                      }
                      required
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="booking-field full">
                  <label htmlFor="guests">
                    Guests
                  </label>

                  <div className="booking-input-wrapper">
                    <Users size={18} />

                    <input
                      id="guests"
                      name="guests"
                      type="number"
                      min="1"
                      max={room.capacity}
                      step="1"
                      value={form.guests}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <small>
                    Maximum capacity: {room.capacity}{" "}
                    guests
                  </small>
                </div>
              </div>

              {/* Price Summary */}
              <div className="booking-price-summary">
                <div>
                  <span>
                    {formatPrice(room.price)} ×{" "}
                    {nights || 0} nights
                  </span>

                  <strong>
                    {formatPrice(totalPrice)}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary booking-submit"
                disabled={loading}
              >
                {loading
                  ? "Confirming..."
                  : "Confirm Booking"}
              </button>
            </form>
          </div>

          {/* Reservation Summary */}
          <aside className="booking-summary-card">
            <img
              src={
                room.image ||
                hotel.images?.[0] ||
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85"
              }
              alt={room.type || "Hotel room"}
            />

            <div className="booking-summary-content">
              <span className="section-eyebrow">
                YOUR ROOM
              </span>

              <h2>{hotel.name}</h2>

              <p className="booking-summary-location">
                {hotel.location}
              </p>

              <div className="booking-summary-room">
                <strong>
                  Room {room.roomNumber}
                </strong>

                <span>{room.type}</span>
              </div>

              <div className="booking-summary-price">
                <strong>
                  {formatPrice(room.price)}
                </strong>

                <span>/ night</span>
              </div>

              {nights > 0 && (
                <div className="booking-summary-total">
                  <span>Total</span>

                  <strong>
                    {formatPrice(totalPrice)}
                  </strong>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function formatPrice(price) {
  return `PKR ${Number(price || 0).toLocaleString()}`;
}

export default Booking;