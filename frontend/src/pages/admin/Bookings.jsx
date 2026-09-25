import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarCheck,
  CalendarDays,
  Building2,
  BedDouble,
  Users,
  Mail,
  Wallet,
  Trash2,
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CheckCheck,
  XCircle,
} from "lucide-react";
import api from "../../services/api";
import "./Bookings.css";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS = ["Pending", "Confirmed", "Cancelled", "Completed"];

// Handles both a raw array response and a wrapped { bookings: [...] } shape.
const extractList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.bookings)) return data.bookings;
  return [];
};

const getGuestName = (booking) => {
  const user = booking?.user;
  if (user && typeof user === "object") return user.name || user.fullName || "Unknown Guest";
  return "Unknown Guest";
};

const getGuestEmail = (booking) => {
  const user = booking?.user;
  if (user && typeof user === "object") return user.email || "—";
  return "—";
};

const getHotelName = (booking) => {
  const hotel = booking?.hotel;
  if (hotel && typeof hotel === "object") return hotel.name || "Unknown Hotel";
  return "Unknown Hotel";
};

const getRoomLabel = (booking) => {
  const room = booking?.room;
  if (room && typeof room === "object") {
    const number = room.roomNumber ?? "";
    const type = room.type ? ` · ${room.type}` : "";
    const label = `${number}${type}`.trim();
    return label || "—";
  }
  return "—";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return "—";
  return `PKR ${Number(amount).toLocaleString()}`;
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Confirmed":
      return CheckCircle2;
    case "Completed":
      return CheckCheck;
    case "Cancelled":
      return XCircle;
    default:
      return Clock;
  }
};

/* -------------------------------------------------------------------------- */
/* Status badge + selector                                                    */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const Icon = getStatusIcon(status);
  const statusClass = (status || "pending").toLowerCase();

  return (
    <span className={`booking-status ${statusClass}`}>
      <Icon size={14} aria-hidden="true" />
      {status || "Pending"}
    </span>
  );
}

function StatusSelect({ booking, isUpdating, onChange }) {
  const id = booking._id ?? booking.id;

  return (
    <select
      className="admin-bookings-status-select"
      value={booking.status || "Pending"}
      onChange={(event) => onChange(booking, event.target.value)}
      disabled={isUpdating}
      aria-label={`Update status for booking ${id}`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function BookingsSkeleton() {
  return (
    <div className="admin-bookings-skeleton-list" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="admin-bookings-skeleton-card" key={index}>
          <div className="admin-bookings-skeleton-line admin-bookings-skeleton-line--wide" />
          <div className="admin-bookings-skeleton-line" />
          <div className="admin-bookings-skeleton-line admin-bookings-skeleton-line--short" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                   */
/* -------------------------------------------------------------------------- */

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/bookings/admin/all");
      setBookings(extractList(res.data));
    } catch (error) {
      setFetchError(error.response?.data?.message || "Unable to load bookings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const summary = useMemo(() => {
    const counts = { total: bookings.length, Pending: 0, Confirmed: 0, Cancelled: 0, Completed: 0 };
    bookings.forEach((booking) => {
      if (counts[booking.status] !== undefined) counts[booking.status] += 1;
    });
    return counts;
  }, [bookings]);

  const handleStatusChange = async (booking, newStatus) => {
    if (newStatus === booking.status) return;
    const id = booking._id ?? booking.id;
    setUpdatingId(id);
    try {
      await api.put(`/bookings/${id}/status`, { status: newStatus });
      toast.success("Booking status updated.");
      await fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (booking) => {
    const id = booking._id ?? booking.id;
    const confirmed = window.confirm(
      `Are you sure you want to delete the booking for ${getGuestName(booking)}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking deleted successfully.");
      await fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete booking.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-bookings-page">
      <div className="container">
        <div className="admin-bookings-header">
          <span className="admin-bookings-eyebrow">HOTELHUB MANAGEMENT</span>
          <h1>Manage Bookings</h1>
          <p className="admin-bookings-description">
            Review reservations, manage booking status and oversee guest stays.
          </p>
        </div>

        {!isLoading && !fetchError && bookings.length > 0 && (
          <div className="admin-bookings-summary">
            <div className="admin-bookings-summary-card">
              <span className="admin-bookings-summary-label">Total Bookings</span>
              <span className="admin-bookings-summary-value">{summary.total}</span>
            </div>
            <div className="admin-bookings-summary-card admin-bookings-summary-card--pending">
              <span className="admin-bookings-summary-label">Pending</span>
              <span className="admin-bookings-summary-value">{summary.Pending}</span>
            </div>
            <div className="admin-bookings-summary-card admin-bookings-summary-card--confirmed">
              <span className="admin-bookings-summary-label">Confirmed</span>
              <span className="admin-bookings-summary-value">{summary.Confirmed}</span>
            </div>
            <div className="admin-bookings-summary-card admin-bookings-summary-card--completed">
              <span className="admin-bookings-summary-label">Completed</span>
              <span className="admin-bookings-summary-value">{summary.Completed}</span>
            </div>
            <div className="admin-bookings-summary-card admin-bookings-summary-card--cancelled">
              <span className="admin-bookings-summary-label">Cancelled</span>
              <span className="admin-bookings-summary-value">{summary.Cancelled}</span>
            </div>
          </div>
        )}

        {isLoading && <BookingsSkeleton />}

        {!isLoading && fetchError && (
          <div className="admin-bookings-state admin-bookings-state--error">
            <AlertTriangle size={28} aria-hidden="true" />
            <p>{fetchError}</p>
            <button type="button" className="admin-bookings-btn-outline" onClick={fetchBookings}>
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !fetchError && bookings.length === 0 && (
          <div className="admin-bookings-state">
            <CalendarCheck size={28} aria-hidden="true" />
            <h2>No bookings found</h2>
            <p>Once guests start reserving rooms, their bookings will show up here.</p>
          </div>
        )}

        {!isLoading && !fetchError && bookings.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="admin-bookings-table-wrapper">
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="admin-bookings-actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const id = booking._id ?? booking.id;
                    const isUpdating = updatingId === id;
                    const isDeleting = deletingId === id;

                    return (
                      <tr className="admin-booking-row" key={id}>
                        <td>
                          <div className="admin-bookings-guest">
                            <span className="admin-bookings-guest-name">
                              {getGuestName(booking)}
                            </span>
                            <span className="admin-bookings-guest-email">
                              <Mail size={13} aria-hidden="true" />
                              {getGuestEmail(booking)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-bookings-inline">
                            <Building2 size={14} aria-hidden="true" />
                            {getHotelName(booking)}
                          </span>
                        </td>
                        <td>
                          <span className="admin-bookings-inline">
                            <BedDouble size={14} aria-hidden="true" />
                            {getRoomLabel(booking)}
                          </span>
                        </td>
                        <td>{formatDate(booking.checkIn)}</td>
                        <td>{formatDate(booking.checkOut)}</td>
                        <td>
                          <span className="admin-bookings-inline">
                            <Users size={14} aria-hidden="true" />
                            {booking.guests ?? "—"}
                          </span>
                        </td>
                        <td>
                          <span className="admin-bookings-inline">
                            <Wallet size={14} aria-hidden="true" />
                            {formatCurrency(booking.totalPrice)}
                          </span>
                        </td>
                        <td>
                          <div className="admin-bookings-status-cell">
                            <StatusBadge status={booking.status} />
                            <StatusSelect
                              booking={booking}
                              isUpdating={isUpdating}
                              onChange={handleStatusChange}
                            />
                            {isUpdating && (
                              <Loader2 size={14} className="admin-bookings-spin" aria-hidden="true" />
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="admin-booking-actions">
                            <button
                              type="button"
                              className="admin-bookings-icon-btn admin-bookings-icon-btn--danger"
                              onClick={() => handleDelete(booking)}
                              disabled={isDeleting}
                              aria-label={`Delete booking for ${getGuestName(booking)}`}
                            >
                              {isDeleting ? (
                                <Loader2 size={16} className="admin-bookings-spin" aria-hidden="true" />
                              ) : (
                                <Trash2 size={16} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="admin-bookings-cards">
              {bookings.map((booking) => {
                const id = booking._id ?? booking.id;
                const isUpdating = updatingId === id;
                const isDeleting = deletingId === id;

                return (
                  <div className="admin-booking-card" key={id}>
                    <div className="admin-booking-card-top">
                      <div className="admin-bookings-guest">
                        <span className="admin-bookings-guest-name">
                          {getGuestName(booking)}
                        </span>
                        <span className="admin-bookings-guest-email">
                          <Mail size={13} aria-hidden="true" />
                          {getGuestEmail(booking)}
                        </span>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="admin-booking-card-body">
                      <span className="admin-bookings-inline">
                        <Building2 size={14} aria-hidden="true" />
                        {getHotelName(booking)}
                      </span>
                      <span className="admin-bookings-inline">
                        <BedDouble size={14} aria-hidden="true" />
                        {getRoomLabel(booking)}
                      </span>
                      <span className="admin-bookings-inline">
                        <CalendarDays size={14} aria-hidden="true" />
                        {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                      </span>
                      <span className="admin-bookings-inline">
                        <Users size={14} aria-hidden="true" />
                        {booking.guests ?? "—"} guests
                      </span>
                      <span className="admin-bookings-inline admin-bookings-inline--price">
                        <Wallet size={14} aria-hidden="true" />
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>

                    <div className="admin-booking-card-footer">
                      <StatusSelect
                        booking={booking}
                        isUpdating={isUpdating}
                        onChange={handleStatusChange}
                      />
                      <button
                        type="button"
                        className="admin-bookings-icon-btn admin-bookings-icon-btn--danger"
                        onClick={() => handleDelete(booking)}
                        disabled={isDeleting}
                        aria-label={`Delete booking for ${getGuestName(booking)}`}
                      >
                        {isDeleting ? (
                          <Loader2 size={16} className="admin-bookings-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;