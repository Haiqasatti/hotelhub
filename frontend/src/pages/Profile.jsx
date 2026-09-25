import { useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import api from "../services/api";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/users/profile", {
        name: name.trim(),
      });

      const updatedUser = response.data.user || response.data;

      dispatch({
        type: "auth/updateUser",
        payload: updatedUser,
      });

      localStorage.setItem(
        "hotelhub_user",
        JSON.stringify(updatedUser)
      );

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="container">
          <span className="section-eyebrow">YOUR ACCOUNT</span>
          <h1>Profile</h1>
          <p>
            Manage your personal information and account details.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="profile-layout">
            <aside className="profile-intro">
              <div className="profile-avatar">
                <User size={38} />
              </div>

              <h2>{user?.name || "HotelHub User"}</h2>

              <p>{user?.email}</p>

              <span className="profile-role">
                <Shield size={14} />
                {user?.role || "USER"}
              </span>
            </aside>

            <div className="profile-card">
              <div className="profile-card-header">
                <span className="section-eyebrow">
                  PERSONAL INFORMATION
                </span>

                <h2>Account details</h2>

                <p>
                  Keep your information up to date for a better
                  booking experience.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-field">
                  <label htmlFor="name">Full Name</label>

                  <div className="profile-input-wrapper">
                    <User size={18} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="email">Email Address</label>

                  <div className="profile-input-wrapper disabled">
                    <Mail size={18} />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                    />
                  </div>

                  <small>
                    Your registered email address cannot be changed
                    here.
                  </small>
                </div>

                <div className="profile-security">
                  <Shield size={20} />

                  <div>
                    <strong>Account security</strong>
                    <p>
                      Your account is protected using authenticated
                      access.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary profile-save"
                  disabled={loading}
                >
                  <Save size={17} />

                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;