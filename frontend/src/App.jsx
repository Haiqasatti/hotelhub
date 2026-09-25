import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminHotels from "./pages/admin/Hotels";
import AdminRooms from "./pages/admin/Rooms";
import AdminAmenities from "./pages/admin/Amenities";
import AdminBookings from "./pages/admin/Bookings";

import { logout } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(logout());

      toast.error(
        "Your session has expired. Please sign in again."
      );

      navigate("/login", { replace: true });
    };

    window.addEventListener(
      "hotelhub-auth-expired",
      handleAuthExpired
    );

    return () => {
      window.removeEventListener(
        "hotelhub-auth-expired",
        handleAuthExpired
      );
    };
  }, [dispatch, navigate]);

  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/hotels"
            element={<Hotels />}
          />

          <Route
            path="/hotels/:id"
            element={<HotelDetails />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/my-bookings"
              element={<MyBookings />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/booking"
              element={<Booking />}
            />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/hotels"
              element={<AdminHotels />}
            />

            <Route
              path="/admin/rooms"
              element={<AdminRooms />}
            />

            <Route
              path="/admin/amenities"
              element={<AdminAmenities />}
            />

            <Route
              path="/admin/bookings"
              element={<AdminBookings />}
            />
             

          </Route>

          {/* 404 Route — MUST be inside Routes */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;