import { Link } from "react-router-dom";
import { Hotel } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div className="footer-brand">
              <span className="footer-logo">
                <Hotel size={20} />
              </span>

              <span>HotelHub</span>
            </div>

            <p className="footer-description">
              Discover exceptional stays and unforgettable experiences
              with HotelHub.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3>Explore</h3>

            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/hotels">Hotels</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3>Support</h3>

            <div className="footer-links">
              <a href="#">Help Center</a>
              <a href="#">Booking Guide</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3>Contact</h3>

            <div className="footer-contact">
              <p>Islamabad, Pakistan</p>
              <p>support@hotelhub.com</p>
              <p>+92 300 0000000</p>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 HotelHub. All rights reserved.</p>
          <p>Premium stays. Memorable experiences.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;