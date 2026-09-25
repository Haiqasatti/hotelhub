import { Link } from "react-router-dom";
import { MapPin, Star, ArrowUpRight } from "lucide-react";

function HotelCard({ hotel }) {
  const hotelImage =
    hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85";

  return (
    <article className="hotel-card">
      <div className="hotel-card-image-wrapper">
        <img
          src={hotelImage}
          alt={hotel.name}
          className="hotel-card-image"
        />

        <span className="hotel-card-badge">
          HotelHub
        </span>

        <Link
          to={`/hotels/${hotel._id}`}
          className="hotel-card-arrow"
          aria-label={`View ${hotel.name}`}
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>

      <div className="hotel-card-content">
        <div className="hotel-card-location">
          <MapPin size={14} />
          <span>{hotel.location}</span>
        </div>

        <div className="hotel-card-title-row">
          <h3>{hotel.name}</h3>

          <div className="hotel-card-rating">
            <Star size={14} fill="currentColor" />
            <span>
              {hotel.rating > 0 ? hotel.rating : "New"}
            </span>
          </div>
        </div>

        <p className="hotel-card-description">
          {hotel.description}
        </p>

        <div className="hotel-card-footer">
          <div>
            <strong>View rooms</strong>
            <span> & pricing</span>
          </div>

          <Link
            to={`/hotels/${hotel._id}`}
            className="hotel-card-link"
          >
            View Hotel
          </Link>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;