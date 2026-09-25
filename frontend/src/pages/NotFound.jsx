import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <SearchX size={34} />
          </div>

          <span className="section-eyebrow">
            HOTELHUB
          </span>

          <h1>Page not found</h1>

          <p>
            The page you're looking for doesn't exist
            or may have been moved.
          </p>

          <div className="not-found-actions">
            <Link
              to="/"
              className="btn btn-primary"
            >
              <Home size={18} />
              Back to Home
            </Link>

            <Link
              to="/hotels"
              className="btn btn-outline"
            >
              Browse Hotels
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;