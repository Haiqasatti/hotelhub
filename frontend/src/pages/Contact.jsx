import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import "./Contact.css";

const initialFormState = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        nextErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.subject.trim()) {
      nextErrors.subject = "Please enter a subject.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please enter your message.";
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    toast.success("Thank you! Your message has been received.");
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <div className="contact-page">
      <section className="contact-hero section">
        <div className="container contact-hero-inner">
          <span className="section-eyebrow">GET IN TOUCH</span>
          <h1>We're here to help.</h1>
          <p>
            Have a question about a stay, reservation, or HotelHub? Send us a
            message and we'll be happy to help.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-info-panel">
            <span className="section-eyebrow">CONTACT HOTELHUB</span>
            <h2>Let's talk about your stay.</h2>
            <p>
              Whether you have a question about a reservation, need help finding
              the right hotel, or want more information before booking, our team
              is here to assist.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <Mail size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <span className="contact-item-label">Email</span>
                  <a href="mailto:support@hotelhub.com">support@hotelhub.com</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <MapPin size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <span className="contact-item-label">Location</span>
                  <p>Islamabad, Pakistan</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <Headphones size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <span className="contact-item-label">Support</span>
                  <p>We're here to help with your HotelHub experience.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && (
                    <span className="field-error">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  aria-invalid={Boolean(errors.subject)}
                />
                {errors.subject && (
                  <span className="field-error">{errors.subject}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us a little more about your question..."
                  aria-invalid={Boolean(errors.message)}
                ></textarea>
                {errors.message && (
                  <span className="field-error">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary contact-submit">
                Send Message
                <ArrowRight size={16} strokeWidth={1.8} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section contact-help">
        <div className="container">
          <div className="contact-help-box">
            <div>
              <span className="section-eyebrow">NEED TO KNOW</span>
              <h2>Looking for your reservation?</h2>
              <p>
                You can manage your existing reservations from your My Bookings
                page after signing in.
              </p>
            </div>

            <Link to="/my-bookings" className="btn btn-outline">
              View My Bookings
            </Link>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container">
          <div className="contact-cta-box">
            <div>
              <span className="section-eyebrow">READY WHEN YOU ARE</span>
              <h2>Ready to find your next stay?</h2>
              <p>
                Explore HotelHub and discover a room that fits your plans.
              </p>
            </div>

            <Link to="/hotels" className="btn btn-primary">
              Explore Hotels
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
