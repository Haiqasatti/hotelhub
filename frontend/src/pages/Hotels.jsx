import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import api from "../services/api";
import HotelCard from "../components/hotel/HotelCard";
import HotelSkeleton from "../components/hotel/HotelSkeleton";
import LoadingSpinner from "../components/common/LoadingSpinner";

function Hotels() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/hotels");

        setHotels(
          response.data.hotels || response.data
        );
      } catch (err) {
        console.error(
          "Failed to fetch hotels:",
          err
        );

        setError(
          "Unable to load hotels. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels
    .filter((hotel) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        hotel.name
          ?.toLowerCase()
          .includes(searchText) ||
        hotel.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesLocation =
        !location ||
        hotel.location?.toLowerCase() ===
          location.toLowerCase();

      const matchesRating =
        !rating ||
        Number(hotel.rating || 0) >=
          Number(rating);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesRating
      );
    })
    .sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sort === "rating") {
        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    });

  const locations = [
    ...new Set(
      hotels
        .map((hotel) => hotel.location)
        .filter(Boolean)
    ),
  ];

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setRating("");
    setSort("newest");
  };

  const hasFilters =
    search ||
    location ||
    rating ||
    sort !== "newest";

  return (
    <main className="hotels-page">
      <section className="hotels-header">
        <div className="container">
          <span className="section-eyebrow">
            DISCOVER YOUR NEXT STAY
          </span>

          <h1>Find your perfect hotel.</h1>

          <p>
            Explore carefully selected properties and
            find a stay that matches your journey.
          </p>
        </div>
      </section>

      <section className="hotels-content section">
        <div className="container">

          {/* Search Toolbar */}

          <div className="hotels-toolbar">
            <div className="hotels-search">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search hotels or destinations..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="filter-button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Filters */}

          {showFilters && (
            <div className="hotel-filters">
              <div className="filter-field">
                <label>Location</label>

                <select
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                >
                  <option value="">
                    All locations
                  </option>

                  {locations.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Minimum rating</label>

                <select
                  value={rating}
                  onChange={(event) =>
                    setRating(event.target.value)
                  }
                >
                  <option value="">
                    Any rating
                  </option>

                  <option value="4">
                    4+ stars
                  </option>

                  <option value="4.5">
                    4.5+ stars
                  </option>
                </select>
              </div>

              <div className="filter-field">
                <label>Sort by</label>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="name">
                    Name A–Z
                  </option>

                  <option value="rating">
                    Highest rating
                  </option>
                </select>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Results Header */}

          <div className="hotels-results">
            <div>
              <span className="section-eyebrow">
                HOTELHUB COLLECTION
              </span>

              <h2>Available hotels</h2>
            </div>

            {!loading && !error && (
              <span className="hotels-count">
                {filteredHotels.length}{" "}
                {filteredHotels.length === 1
                  ? "property"
                  : "properties"}
              </span>
            )}
          </div>

          {/* Loading */}

          {loading && (
            <>
              <LoadingSpinner message="Finding your perfect stay..." />

              <div className="hotel-grid">
                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <HotelSkeleton
                      key={item}
                    />
                  )
                )}
              </div>
            </>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="hotel-empty-state">
              <h3>
                Something went wrong
              </h3>

              <p>{error}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            filteredHotels.length === 0 && (
              <div className="hotel-empty-state">
                <h3>No hotels found</h3>

                <p>
                  Try changing your search or
                  filters to find available
                  properties.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

          {/* Hotels */}

          {!loading &&
            !error &&
            filteredHotels.length > 0 && (
              <div className="hotel-grid">
                {filteredHotels.map(
                  (hotel) => (
                    <HotelCard
                      key={hotel._id}
                      hotel={hotel}
                    />
                  )
                )}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

export default Hotels;