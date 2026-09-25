import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  BedDouble,
  Users,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [form, setForm] = useState({
    roomNumber: "",
    hotel: "",
    type: "",
    price: "",
    capacity: "",
    description: "",
    image: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [roomsResponse, hotelsResponse] = await Promise.all([
        api.get("/rooms"),
        api.get("/hotels"),
      ]);

      const roomsData =
        roomsResponse.data.rooms || roomsResponse.data || [];

      const hotelsData =
        hotelsResponse.data.hotels || hotelsResponse.data || [];

      setRooms(roomsData);
      setHotels(hotelsData);
    } catch (error) {
      console.error("Failed to load rooms:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      roomNumber: "",
      hotel: "",
      type: "",
      price: "",
      capacity: "",
      description: "",
      image: "",
    });

    setEditingRoom(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);

    setForm({
      roomNumber: room.roomNumber || "",
      hotel:
        typeof room.hotel === "object"
          ? room.hotel._id
          : room.hotel || "",
      type: room.type || "",
      price: room.price || "",
      capacity: room.capacity || "",
      description: room.description || "",
      image: room.image || "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.roomNumber ||
      !form.hotel ||
      !form.type ||
      !form.price ||
      !form.capacity
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      Number(form.price) <= 0 ||
      Number(form.capacity) <= 0
    ) {
      toast.error("Price and capacity must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        hotel: form.hotel,
        roomNumber: form.roomNumber,
        roomType: form.type,
        pricePerNight: Number(form.price),
        capacity: Number(form.capacity),
        description: form.description || "",
        images: form.image ? [form.image] : [],
        amenities: [],
      };

      if (editingRoom) {
        await api.put(
          `/rooms/${editingRoom._id}`,
          payload
        );

        toast.success("Room updated successfully.");
      } else {
        await api.post("/rooms", payload);

        toast.success("Room created successfully.");
      }

      setIsModalOpen(false);
      resetForm();

      await fetchData();
    } catch (error) {
      console.error("Failed to save room:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save room."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Room ${room.roomNumber}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/rooms/${room._id}`);

      toast.success("Room deleted successfully.");

      await fetchData();
    } catch (error) {
      console.error("Failed to delete room:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete room."
      );
    }
  };

  const getHotelName = (room) => {
    if (typeof room.hotel === "object") {
      return room.hotel?.name || "Unknown Hotel";
    }

    const hotel = hotels.find(
      (item) => item._id === room.hotel
    );

    return hotel?.name || "Unknown Hotel";
  };

  return (
    <main className="admin-rooms-page">
      <section className="admin-rooms-header">
        <div className="container">
          <div className="admin-rooms-header-content">
            <div>
              <span className="section-eyebrow">
                HOTELHUB MANAGEMENT
              </span>

              <h1>Manage Rooms</h1>

              <p>
                Manage room inventory, pricing and
                availability across your HotelHub properties.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary admin-rooms-add"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Room
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="admin-rooms-loading">
              <div className="admin-room-skeleton"></div>
              <div className="admin-room-skeleton"></div>
              <div className="admin-room-skeleton"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="admin-rooms-empty">
              <BedDouble size={42} />

              <h3>No rooms found</h3>

              <p>
                Start by adding the first room to your
                HotelHub properties.
              </p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={openAddModal}
              >
                <Plus size={18} />
                Add First Room
              </button>
            </div>
          ) : (
            <div className="admin-rooms-list">
              {rooms.map((room) => (
                <article
                  className="admin-room-row"
                  key={room._id}
                >
                  <div className="admin-room-image">
                    <img
                      src={
                        room.image ||
                        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85"
                      }
                      alt={`Room ${room.roomNumber}`}
                    />
                  </div>

                  <div className="admin-room-info">
                    <span className="admin-room-type">
                      {room.type || "Room"}
                    </span>

                    <h3>
                      Room {room.roomNumber}
                    </h3>

                    <div className="admin-room-hotel">
                      <Building2 size={15} />
                      <span>
                        {getHotelName(room)}
                      </span>
                    </div>
                  </div>

                  <div className="admin-room-detail">
                    <span>Price</span>
                    <strong>
                      PKR{" "}
                      {Number(
                        room.price || 0
                      ).toLocaleString()}
                    </strong>
                    <small>/ night</small>
                  </div>

                  <div className="admin-room-detail">
                    <span>Capacity</span>
                    <strong>
                      <Users size={15} />
                      {room.capacity || 0}
                    </strong>
                    <small>guests</small>
                  </div>

                  <div className="admin-room-status">
                    {room.available ? (
                      <span className="room-status available">
                        <CheckCircle size={15} />
                        Available
                      </span>
                    ) : (
                      <span className="room-status unavailable">
                        <XCircle size={15} />
                        Unavailable
                      </span>
                    )}
                  </div>

                  <div className="admin-room-actions">
                    <button
                      type="button"
                      className="admin-icon-button"
                      onClick={() =>
                        openEditModal(room)
                      }
                      title="Edit room"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="admin-icon-button delete"
                      onClick={() =>
                        handleDelete(room)
                      }
                      title="Delete room"
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
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <span className="section-eyebrow">
                  {editingRoom
                    ? "UPDATE ROOM"
                    : "NEW ROOM"}
                </span>

                <h2>
                  {editingRoom
                    ? "Edit room"
                    : "Add a room"}
                </h2>

                <p>
                  Add accurate room information for
                  your property.
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
                <div className="admin-form-field">
                  <label htmlFor="roomNumber">
                    Room Number *
                  </label>

                  <input
                    id="roomNumber"
                    name="roomNumber"
                    type="text"
                    placeholder="e.g. 101"
                    value={form.roomNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="hotel">
                    Hotel *
                  </label>

                  <select
                    id="hotel"
                    name="hotel"
                    value={form.hotel}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select a hotel
                    </option>

                    {hotels.map((hotel) => (
                      <option
                        key={hotel._id}
                        value={hotel._id}
                      >
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-field">
                  <label htmlFor="type">
                    Room Type *
                  </label>

                  <input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="e.g. Deluxe"
                    value={form.type}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="price">
                    Price Per Night *
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    placeholder="e.g. 12000"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="capacity">
                    Capacity *
                  </label>

                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={form.capacity}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor="image">
                    Image URL
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    placeholder="https://..."
                    value={form.image}
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
                    : editingRoom
                    ? "Update Room"
                    : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Rooms;