import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  ArrowLeft,
} from "lucide-react";
import api from "../services/api";

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [hotelResponse, roomsResponse] =
          await Promise.all([
            api.get(`/hotels/${id}`),
            api.get(`/rooms?hotel=${id}`),
          ]);

        setHotel(hotelResponse.data);
        setRooms(
          roomsResponse.data.rooms ||
            roomsResponse.data
        );
      } catch (err) {
        console.error(
          "Failed to fetch hotel details:",
          err
        );

        setError(
          "Unable to load this hotel. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="details-page">
        <div className="container details-loading">
          <div className="details-loading-image"></div>

          <div className="details-loading-content">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !hotel) {
    return (
      <main className="details-page">
        <div className="container details-error">
          <h1>Hotel unavailable</h1>
          <p>
            {error ||
              "We couldn't find this hotel."}
          </p>

          <Link
            to="/hotels"
            className="btn btn-primary"
          >
            Back to Hotels
          </Link>
        </div>
      </main>
    );
  }

  const hotelImage =
    hotel.images &&
    hotel.images.length > 0
      ? hotel.images[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85";

  return (
    <main className="details-page">
      <section className="details-hero">
        <img
          src={hotelImage}
          alt={hotel.name}
        />

        <div className="details-hero-overlay">
          <div className="container">
            <Link
              to="/hotels"
              className="details-back"
            >
              <ArrowLeft size={17} />
              Back to hotels
            </Link>

            <div className="details-hero-info">
              <div className="details-location">
                <MapPin size={16} />
                {hotel.location}
              </div>

              <h1>{hotel.name}</h1>

              <div className="details-rating">
                <Star
                  size={16}
                  fill="currentColor"
                />

                <span>
                  {hotel.rating > 0
                    ? hotel.rating
                    : "New"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section details-content">
        <div className="container">
          <div className="details-layout">

            <div className="details-main">
              <span className="section-eyebrow">
                ABOUT THE HOTEL
              </span>

              <h2>Stay somewhere special.</h2>

              <p className="details-description">
                {hotel.description}
              </p>

              {hotel.amenities?.length > 0 && (
                <section className="hotel-amenities">
                  <h2>Amenities</h2>

                  <div className="amenities-grid">
                    {hotel.amenities.map((amenity) => (
                      <div
                        className="amenity-item"
                        key={
                          amenity._id ||
                          amenity.name
                        }
                      >
                        <div className="amenity-icon">
                          ✓
                        </div>

                        <div>
                          <h3>
                            {typeof amenity ===
                            "object"
                              ? amenity.name
                              : amenity}
                          </h3>

                          {typeof amenity ===
                            "object" &&
                            amenity.description && (
                              <p>
                                {amenity.description}
                              </p>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="details-side-card">
              <span>
                READY FOR YOUR STAY?
              </span>

              <h3>
                Find your perfect room.
              </h3>

              <p>
                Explore available rooms and
                choose the option that suits
                your trip.
              </p>

              <a
                href="#rooms"
                className="btn btn-primary"
              >
                View Rooms
              </a>
            </aside>

          </div>
        </div>
      </section>

      <section
        id="rooms"
        className="section rooms-section"
      >
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">
              ACCOMMODATION
            </span>

            <h2>Choose your room.</h2>

            <p>
              Select from the rooms available at{" "}
              {hotel.name}.
            </p>
          </div>

          {rooms.length === 0 ? (
            <div className="hotel-empty-state">
              <h3>No rooms available</h3>

              <p>
                There are currently no rooms
                available for this property.
              </p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <article
                  className="room-card"
                  key={room._id}
                >
                  <div className="room-card-image">
                    <img
                      src={
                        (Array.isArray(room.images) && room.images.length > 0
                          ? room.images[0]
                          : room.image) ||
                        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"
                      }
                      alt={`${room.roomType || room.type || "Room"} room`}
                    />
                  </div>

                  <div className="room-card-content">
                    <span className="room-type">
                      {room.roomType || room.type || "Room"}
                    </span>

                    <h3>
                      Room {room.roomNumber}
                    </h3>

                    <p>
                      Comfortable accommodation
                      designed for a relaxing stay.
                    </p>

                    <div className="room-card-footer">
                      <div>
                        <strong>
                          PKR{" "}
                          {Number(
                            room.pricePerNight ?? room.price ?? 0
                          ).toLocaleString()}
                        </strong>

                        <span>
                          {" "}
                          / night
                        </span>
                      </div>

                      <button
                        type="button"
                        className="room-book-button"
                        onClick={() =>
                          navigate("/booking", {
                            state: {
                              hotel,
                              room,
                            },
                          })
                        }
                      >
                        Book This Room
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default HotelDetails;