import { Link } from "react-router-dom";
import {
  Compass,
  CalendarCheck,
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import "./About.css";

const FEATURES = [
  {
    icon: Compass,
    title: "Curated Stays",
    description:
      "A thoughtfully selected range of hotels, so every option you see is worth considering.",
  },
  {
    icon: CalendarCheck,
    title: "Simple Booking",
    description:
      "Check availability and reserve a room in just a few steps, without any unnecessary friction.",
  },
  {
    icon: ClipboardCheck,
    title: "Clear Reservations",
    description:
      "See exactly what you've booked, when, and where — all in one clear, organized view.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful Experience",
    description:
      "From search to stay, every detail is designed to feel calm, considered and easy to use.",
  },
];

const EXPERIENCE_ITEMS = [
  "Discover hotels that match what you're looking for",
  "Explore rooms with clear details and pricing",
  "Check real-time availability before you commit",
  "Make reservations in a few simple steps",
  "Manage your bookings from a single dashboard",
];

function About() {
  return (
    <div className="about-page">
      {/* 1. Hero */}
      <section className="about-hero section">
        <div className="container about-hero-grid">
          <div className="about-hero-text">
            <span className="section-eyebrow">ABOUT HOTELHUB</span>
            <h1>A better way to stay.</h1>
            <p className="about-hero-lead">
              HotelHub makes it simple to discover comfortable stays, explore
              rooms and manage every reservation in one place.
            </p>
          </div>

          <div className="about-hero-image">
            <img
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"
              alt="Elegant hotel lobby with warm lighting and modern furnishings"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="about-story section">
        <div className="container about-story-inner">
          <span className="section-eyebrow">OUR STORY</span>
          <h2>Designed around the way you travel.</h2>
          <p>
            HotelHub is a hotel booking and management platform built to make
            three things simple: discovering hotels, choosing the right room
            and keeping track of your reservations. Rather than adding more
            steps to the process, HotelHub focuses on clarity — clean
            listings, straightforward availability and a booking flow that
            gets out of your way.
          </p>
          <p>
            Whether you're planning ahead or booking at the last minute, the
            goal is the same: a calm, dependable way to go from searching to
            confirmed, without the guesswork.
          </p>
        </div>
      </section>

      {/* 3. Why HotelHub */}
      <section className="about-features section">
        <div className="container">
          <div className="section-heading center">
            <span className="section-eyebrow">WHY HOTELHUB</span>
            <h2>Built around what matters when you travel.</h2>
          </div>

          <div className="about-features-grid">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div className="about-feature-card" key={title}>
                <div className="about-feature-icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience Section */}
      <section className="about-experience section">
        <div className="container about-experience-grid">
          <div className="about-experience-image">
            <img
              src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"
              alt="Modern hotel room with a made bed and city view"
              loading="lazy"
            />
          </div>

          <div className="about-experience-text">
            <span className="section-eyebrow">THE HOTELHUB EXPERIENCE</span>
            <h2>Everything you need for a comfortable stay.</h2>

            <ul className="about-checklist">
              {EXPERIENCE_ITEMS.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="booking-cta">
        <div className="container">
          <div className="booking-cta-content">
            <div>
              <span className="section-eyebrow">START YOUR SEARCH</span>
              <h2>Ready to find your next stay?</h2>
              <p>Explore our hotels and discover a room that fits your plans.</p>

              <div className="booking-cta-actions">
                <Link to="/hotels" className="btn btn-outline">
                  Explore Hotels
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="booking-cta-decoration" aria-hidden="true">
              <span>HotelHub</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;