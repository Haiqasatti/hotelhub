import { useEffect, useState } from "react";
import {
  Hotel,
  BedDouble,
  CalendarCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    amenities: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          hotelsResponse,
          roomsResponse,
          amenitiesResponse,
          bookingsResponse,
        ] = await Promise.all([
          api.get("/hotels"),
          api.get("/rooms"),
          api.get("/amenities"),
          api.get("/bookings/admin/all"),
        ]);

        const hotels =
          hotelsResponse.data.hotels || hotelsResponse.data || [];

        const rooms =
          roomsResponse.data.rooms || roomsResponse.data || [];

        const amenities =
          amenitiesResponse.data.amenities ||
          amenitiesResponse.data ||
          [];

        const bookings =
          bookingsResponse.data.bookings ||
          bookingsResponse.data ||
          [];

        setStats({
          hotels: hotels.length,
          rooms: rooms.length,
          amenities: amenities.length,
          bookings: bookings.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Hotels",
      value: stats.hotels,
      icon: Hotel,
      link: "/admin/hotels",
    },
    {
      title: "Total Rooms",
      value: stats.rooms,
      icon: BedDouble,
      link: "/admin/rooms",
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: CalendarCheck,
      link: "/admin/bookings",
    },
    {
      title: "Total Amenities",
      value: stats.amenities,
      icon: Sparkles,
      link: "/admin/amenities",
    },
  ];

  if (loading) {
    return (
      <main className="admin-dashboard-page">
        <div className="container admin-loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard-page">
        <div className="container admin-error">
          <h1>Dashboard unavailable</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-header">
        <div className="container">
          <span className="section-eyebrow">
            HOTELHUB MANAGEMENT
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Manage your properties, rooms, amenities and bookings
            from one place.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="admin-stats-grid">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  to={card.link}
                  className="admin-stat-card"
                  key={card.title}
                >
                  <div className="admin-stat-icon">
                    <Icon size={22} />
                  </div>

                  <div className="admin-stat-content">
                    <span>{card.title}</span>
                    <strong>{card.value}</strong>
                  </div>

                  <ArrowUpRight
                    className="admin-stat-arrow"
                    size={19}
                  />
                </Link>
              );
            })}
          </div>

          <div className="admin-welcome-card">
            <div>
              <span className="section-eyebrow">
                QUICK MANAGEMENT
              </span>

              <h2>Everything in one place.</h2>

              <p>
                Use the management sections to create, update and
                organize HotelHub's properties and reservations.
              </p>
            </div>

            <div className="admin-quick-actions">
              <Link
                to="/admin/hotels"
                className="btn btn-primary"
              >
                Manage Hotels
              </Link>

              <Link
                to="/admin/bookings"
                className="admin-secondary-button"
              >
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;