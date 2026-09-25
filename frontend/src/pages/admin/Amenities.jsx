import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

function Amenities() {
  const [amenities, setAmenities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchAmenities = async () => {
    try {
      setLoading(true);

      const response = await api.get("/amenities");

      const data =
        response.data.amenities ||
        response.data ||
        [];

      setAmenities(data);
    } catch (error) {
      console.error("Failed to load amenities:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load amenities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });

    setEditingAmenity(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (amenity) => {
    setEditingAmenity(amenity);

    setForm({
      name: amenity.name || "",
      description: amenity.description || "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Amenity name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      };

      if (editingAmenity) {
        await api.put(
          `/amenities/${editingAmenity._id}`,
          payload
        );

        toast.success(
          "Amenity updated successfully."
        );
      } else {
        await api.post("/amenities", payload);

        toast.success(
          "Amenity created successfully."
        );
      }

      setIsModalOpen(false);
      resetForm();

      await fetchAmenities();
    } catch (error) {
      console.error(
        "Failed to save amenity:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to save amenity."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (amenity) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${amenity.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/amenities/${amenity._id}`
      );

      toast.success(
        "Amenity deleted successfully."
      );

      await fetchAmenities();
    } catch (error) {
      console.error(
        "Failed to delete amenity:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete amenity."
      );
    }
  };

  return (
    <main className="admin-amenities-page">
      <section className="admin-amenities-header">
        <div className="container">
          <div className="admin-amenities-header-content">
            <div>
              <span className="section-eyebrow">
                HOTELHUB MANAGEMENT
              </span>

              <h1>Manage Amenities</h1>

              <p>
                Create and organize the amenities
                available across your HotelHub
                properties.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary admin-amenities-add"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Amenity
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="admin-amenities-loading">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : amenities.length === 0 ? (
            <div className="admin-amenities-empty">
              <Sparkles size={42} />

              <h3>No amenities found</h3>

              <p>
                Add amenities such as Wi-Fi,
                breakfast, parking or a swimming
                pool.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddModal}
              >
                <Plus size={18} />
                Add First Amenity
              </button>
            </div>
          ) : (
            <div className="admin-amenities-grid">
              {amenities.map((amenity) => (
                <article
                  className="admin-amenity-card"
                  key={amenity._id}
                >
                  <div className="admin-amenity-icon">
                    <Sparkles size={22} />
                  </div>

                  <div className="admin-amenity-content">
                    <h3>{amenity.name}</h3>

                    <p>
                      {amenity.description ||
                        "Available at selected HotelHub properties."}
                    </p>
                  </div>

                  <div className="admin-amenity-actions">
                    <button
                      type="button"
                      className="admin-icon-button"
                      onClick={() =>
                        openEditModal(amenity)
                      }
                      title="Edit amenity"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="admin-icon-button delete"
                      onClick={() =>
                        handleDelete(amenity)
                      }
                      title="Delete amenity"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <span className="section-eyebrow">
                  {editingAmenity
                    ? "UPDATE AMENITY"
                    : "NEW AMENITY"}
                </span>

                <h2>
                  {editingAmenity
                    ? "Edit amenity"
                    : "Add an amenity"}
                </h2>

                <p>
                  Provide clear information about
                  this hotel amenity.
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="admin-modal-form"
              onSubmit={handleSubmit}
            >
              <div className="admin-form-grid">
                <div className="admin-form-field full">
                  <label htmlFor="name">
                    Amenity Name *
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Free Wi-Fi"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field full">
                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe this amenity..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingAmenity
                    ? "Update Amenity"
                    : "Create Amenity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Amenities;