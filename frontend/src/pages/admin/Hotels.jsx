import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Star,
  MapPin,
  AlertTriangle,
  ImageOff,
  ArrowLeft,
  BedDouble,
} from "lucide-react";
import api from "../../services/api";
import "./Hotels.css";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const EMPTY_FORM = {
  name: "",
  description: "",
  location: "",
  images: "",
  rating: "",
  amenities: [],
};

const toFormValues = (hotel) => ({
  name: hotel?.name ?? "",
  description: hotel?.description ?? "",
  location: hotel?.location ?? "",
  images: Array.isArray(hotel?.images) ? hotel.images.join(", ") : "",
  rating: hotel?.rating ?? "",
  amenities: Array.isArray(hotel?.amenities)
    ? hotel.amenities.map((amenity) =>
        typeof amenity === "object" ? amenity._id : amenity
      )
    : [],
});

const validateForm = (data) => {
  const errors = {};

  if (!data.name.trim()) errors.name = "Hotel name is required.";
  if (!data.location.trim()) errors.location = "Location is required.";
  if (!data.description.trim()) errors.description = "Description is required.";

  if (data.rating === "" || data.rating === null || data.rating === undefined) {
    errors.rating = "Rating is required.";
  } else {
    const ratingNum = Number(data.rating);
    if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      errors.rating = "Rating must be a number between 0 and 5.";
    }
  }

  return errors;
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/* -------------------------------------------------------------------------- */
/* Generic modal shell                                                        */
/* -------------------------------------------------------------------------- */

function Modal({ title, onClose, children, closeDisabled = false, size = "md" }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !closeDisabled) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, closeDisabled]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) onClose();
      }}
    >
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Delete confirmation dialog                                                 */
/* -------------------------------------------------------------------------- */

function ConfirmDeleteDialog({ hotel, isDeleting, onCancel, onConfirm }) {
  return (
    <Modal title="Delete hotel" onClose={onCancel} closeDisabled={isDeleting} size="sm">
      <div className="modal-body">
        <div className="confirm-icon">
          <AlertTriangle size={22} aria-hidden="true" />
        </div>
        <p>
          Are you sure you want to delete <strong>{hotel.name}</strong>? This action
          cannot be undone.
        </p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <Loader2 size={16} className="spin" aria-hidden="true" />
              Deleting...
            </>
          ) : (
            "Delete Hotel"
          )}
        </button>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/* Add / edit hotel form modal                                                */
/* -------------------------------------------------------------------------- */

function HotelFormModal({ hotel, amenities, isSaving, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => toFormValues(hotel));
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(hotel);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      images: formData.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      rating: Number(formData.rating),
      amenities: formData.amenities,
    });
  };

  return (
    <Modal
      title={isEditing ? "Edit Hotel" : "Add Hotel"}
      onClose={onClose}
      closeDisabled={isSaving}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="hotel-name">Hotel name</label>
            <input
              id="hotel-name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="e.g. The Ivory Residence"
              disabled={isSaving}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="hotel-location">Location</label>
            <input
              id="hotel-location"
              type="text"
              value={formData.location}
              onChange={handleChange("location")}
              placeholder="e.g. Islamabad, Pakistan"
              disabled={isSaving}
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="hotel-description">Description</label>
            <textarea
              id="hotel-description"
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="A short, appealing description of the property"
              disabled={isSaving}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hotel-rating">Rating (0–5)</label>
              <input
                id="hotel-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange("rating")}
                placeholder="e.g. 4.5"
                disabled={isSaving}
              />
              {errors.rating && <p className="form-error">{errors.rating}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="hotel-amenities">Amenities</label>
              <select
                id="hotel-amenities"
                multiple
                value={formData.amenities}
                onChange={(event) => {
                  const selectedIds = Array.from(
                    event.target.selectedOptions,
                    (option) => option.value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    amenities: selectedIds,
                  }));
                }}
                disabled={isSaving}
                className="amenities-select"
              >
                {amenities.length === 0 ? (
                  <option disabled>No amenities available</option>
                ) : (
                  amenities.map((amenity) => (
                    <option key={amenity._id} value={amenity._id}>
                      {amenity.name}
                    </option>
                  ))
                )}
              </select>
              <p className="form-hint">
                Hold Ctrl (Windows) or Command (Mac) to select multiple amenities.
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="hotel-images">Image URLs</label>
            <input
              id="hotel-images"
              type="text"
              value={formData.images}
              onChange={handleChange("images")}
              placeholder="https://example.com/room1.jpg, https://example.com/room2.jpg"
              disabled={isSaving}
            />
            <p className="form-hint">Separate multiple image URLs with commas.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 size={16} className="spin" aria-hidden="true" />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Hotel"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/* Small display helpers                                                      */
/* -------------------------------------------------------------------------- */

function HotelThumbnail({ hotel }) {
  const src = Array.isArray(hotel.images) ? hotel.images[0] : null;

  if (!src) {
    return (
      <div className="hotel-thumb hotel-thumb--placeholder" aria-hidden="true">
        <ImageOff size={18} />
      </div>
    );
  }

  return <img className="hotel-thumb" src={src} alt={hotel.name} />;
}

function RatingBadge({ rating }) {
  const value = Number(rating);
  return (
    <span className="rating-badge">
      <Star size={14} aria-hidden="true" />
      {Number.isFinite(value) ? value.toFixed(1) : "—"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Main page                                                                   */
/* -------------------------------------------------------------------------- */

function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const [hotelsResponse, amenitiesResponse] = await Promise.all([
        api.get("/hotels"),
        api.get("/amenities"),
      ]);

      const hotelsData = hotelsResponse.data;
      const amenitiesData = amenitiesResponse.data;

      const hotelList = Array.isArray(hotelsData)
        ? hotelsData
        : hotelsData?.hotels ?? [];

      const amenityList = Array.isArray(amenitiesData)
        ? amenitiesData
        : amenitiesData?.amenities ?? [];

      setHotels(hotelList);
      setAmenities(amenityList);
    } catch (error) {
      console.error("Failed to load hotels/amenities:", error);

      setFetchError(
        getErrorMessage(error, "Failed to load hotels and amenities.")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const openAddModal = () => {
    setEditingHotel(null);
    setIsModalOpen(true);
  };

  const openEditModal = (hotel) => {
    setEditingHotel(hotel);
    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingHotel(null);
  };

  const handleFormSubmit = async (payload) => {
    setIsSaving(true);
    try {
      if (editingHotel) {
        const id = editingHotel._id ?? editingHotel.id;
        await api.put(`/hotels/${id}`, payload);
        toast.success("Hotel updated successfully.");
      } else {
        await api.post("/hotels", payload);
        toast.success("Hotel created successfully.");
      }
      setIsModalOpen(false);
      setEditingHotel(null);
      await fetchHotels();
    } catch (error) {
      toast.error(getErrorMessage(error, "Something went wrong while saving the hotel."));
    } finally {
      setIsSaving(false);
    }
  };

  const askDelete = (hotel) => setDeleteTarget(hotel);
  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const id = deleteTarget._id ?? deleteTarget.id;
      await api.delete(`/hotels/${id}`);
      toast.success("Hotel deleted successfully.");
      setDeleteTarget(null);
      await fetchHotels();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete the hotel."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <Link to="/admin" className="admin-back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Dashboard
        </Link>

        <div className="admin-page-header">
          <div>
            <h1>Manage Hotels</h1>
            <p className="admin-page-subtitle">
              Create and manage the properties listed on HotelHub.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} aria-hidden="true" />
            Add Hotel
          </button>
        </div>

        {isLoading && (
          <div className="admin-state">
            <Loader2 size={28} className="spin" aria-hidden="true" />
            <p>Loading hotels...</p>
          </div>
        )}

        {!isLoading && fetchError && (
          <div className="admin-state admin-state--error">
            <AlertTriangle size={28} aria-hidden="true" />
            <p>{fetchError}</p>
            <button type="button" className="btn btn-outline" onClick={fetchHotels}>
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !fetchError && hotels.length === 0 && (
          <div className="admin-state">
            <BedDouble size={28} aria-hidden="true" />
            <p>No hotels have been added yet.</p>
            <button type="button" className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} aria-hidden="true" />
              Add Your First Hotel
            </button>
          </div>
        )}

        {!isLoading && !fetchError && hotels.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Description</th>
                    <th>Amenities</th>
                    <th className="admin-table-actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel) => {
                    const id = hotel._id ?? hotel.id;
                    const amenitiesCount = Array.isArray(hotel.amenities)
                      ? hotel.amenities.length
                      : 0;
                    return (
                      <tr key={id}>
                        <td>
                          <HotelThumbnail hotel={hotel} />
                        </td>
                        <td className="admin-table-name">{hotel.name}</td>
                        <td>
                          <span className="admin-table-location">
                            <MapPin size={14} aria-hidden="true" />
                            {hotel.location}
                          </span>
                        </td>
                        <td>
                          <RatingBadge rating={hotel.rating} />
                        </td>
                        <td className="admin-table-description" title={hotel.description}>
                          {hotel.description}
                        </td>
                        <td>{amenitiesCount} amenities</td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => openEditModal(hotel)}
                              aria-label={`Edit ${hotel.name}`}
                            >
                              <Pencil size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              onClick={() => askDelete(hotel)}
                              aria-label={`Delete ${hotel.name}`}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="admin-hotel-cards">
              {hotels.map((hotel) => {
                const id = hotel._id ?? hotel.id;
                const amenitiesCount = Array.isArray(hotel.amenities)
                  ? hotel.amenities.length
                  : 0;
                return (
                  <div className="hotel-card" key={id}>
                    <HotelThumbnail hotel={hotel} />
                    <div className="hotel-card-body">
                      <div className="hotel-card-top">
                        <h3>{hotel.name}</h3>
                        <RatingBadge rating={hotel.rating} />
                      </div>
                      <span className="admin-table-location">
                        <MapPin size={14} aria-hidden="true" />
                        {hotel.location}
                      </span>
                      <p className="hotel-card-description">{hotel.description}</p>
                      <p className="hotel-card-amenities">{amenitiesCount} amenities</p>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => openEditModal(hotel)}
                        >
                          <Pencil size={15} aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => askDelete(hotel)}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <HotelFormModal
          hotel={editingHotel}
          amenities={amenities}
          isSaving={isSaving}
          onClose={closeFormModal}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteDialog
          hotel={deleteTarget}
          isDeleting={isDeleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default AdminHotels;