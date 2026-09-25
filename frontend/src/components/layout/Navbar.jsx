import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Hotel, Menu, X, User, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Hotel size={28} />
          <span>HotelHub</span>
        </Link>

        <nav className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/hotels" onClick={closeMenu}>
            Hotels
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/my-bookings" onClick={closeMenu}>
                My Bookings
              </NavLink>

              <NavLink to="/profile" onClick={closeMenu}>
                Profile
              </NavLink>
            </>
          )}

          <div className="navbar-mobile-actions">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="navbar-login"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="navbar-book"
                  onClick={closeMenu}
                >
                  Create Account
                </Link>
              </>
            ) : (
              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar-login">
                Sign In
              </Link>

              <Link to="/register" className="navbar-book">
                Create Account
              </Link>
            </>
          ) : (
            <div className="navbar-user">
              <User size={18} />
              <span>{user?.name || "Account"}</span>

              <button
                className="navbar-logout"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={17} />
              </button>
            </div>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;