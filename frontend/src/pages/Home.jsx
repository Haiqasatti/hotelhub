import HotelCard from "../components/hotel/HotelCard";

function Home() {
  const featuredHotels = [
    {
      id: 1,
      name: "HotelHub Grand",
      location: "Islamabad, Pakistan",
      rating: 4.9,
      price: 12000,
      description:
        "A refined urban retreat offering elegant rooms, exceptional service, and a peaceful atmosphere.",
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 2,
      name: "Serenity Palace",
      location: "Lahore, Pakistan",
      rating: 4.8,
      price: 14500,
      description:
        "Experience sophisticated comfort with beautifully designed spaces and thoughtful hospitality.",
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 3,
      name: "The Royal Retreat",
      location: "Murree, Pakistan",
      rating: 4.9,
      price: 18000,
      description:
        "A tranquil mountain escape combining panoramic views, luxurious rooms, and memorable experiences.",
      image:
        "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  const destinations = [
    {
      id: 1,
      name: "Islamabad",
      country: "Pakistan",
      hotels: "24 properties",
      image:
        "https://images.unsplash.com/photo-1567602901358-5ba51e0f3f0c?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 2,
      name: "Lahore",
      country: "Pakistan",
      hotels: "31 properties",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 3,
      name: "Murree",
      country: "Pakistan",
      hotels: "18 properties",
      image:
        "https://images.unsplash.com/photo-1626014303757-0e5a7c7b5e8c?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 4,
      name: "Hunza",
      country: "Pakistan",
      hotels: "16 properties",
      image:
        "https://images.unsplash.com/photo-1590642916589-592f2d2c7d7b?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container home-hero-content">
          <div className="home-hero-text">
            <span className="home-hero-eyebrow">
              ELEVATED STAYS. MEMORABLE MOMENTS.
            </span>

            <h1>
              Stay somewhere
              <br />
              <span>extraordinary.</span>
            </h1>

            <p>
              Discover thoughtfully selected hotels and unforgettable
              stays in destinations worth exploring.
            </p>
          </div>

          {/* Search Card */}
          <div className="home-search-card">
            <div className="search-field">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Where are you going?"
              />
            </div>

            <div className="search-field">
              <label>Check in</label>
              <input type="date" />
            </div>

            <div className="search-field">
              <label>Check out</label>
              <input type="date" />
            </div>

            <div className="search-field">
              <label>Guests</label>
              <select defaultValue="">
                <option value="" disabled>
                  Guests
                </option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>

            <button className="btn btn-primary search-button">
              Search Hotels
            </button>
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">HANDPICKED FOR YOU</span>

            <h2>Featured stays</h2>

            <p>
              Explore some of our most sought-after properties, selected for
              comfort, character, and exceptional hospitality.
            </p>
          </div>

          <div className="hotel-grid">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">WHY HOTELHUB</span>
            <h2>Everything you need for a better stay.</h2>
            <p>
              From trusted properties to a seamless booking experience,
              HotelHub makes finding your next stay simple and enjoyable.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-number">01</div>
              <h3>Verified Properties</h3>
              <p>
                Discover carefully selected hotels with reliable information
                and quality standards.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">02</div>
              <h3>Easy Booking</h3>
              <p>
                Search, compare, and reserve your room through a simple and
                intuitive booking experience.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">03</div>
              <h3>Secure Experience</h3>
              <p>
                Your account and booking information are protected with secure
                authentication and trusted technology.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">04</div>
              <h3>Exceptional Support</h3>
              <p>
                Manage your bookings easily and get the information you need
                throughout your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section destinations-section">
        <div className="container">
          <div className="section-heading destinations-heading">
            <span className="section-eyebrow">EXPLORE PAKISTAN</span>
            <h2>Popular destinations</h2>
            <p>
              Discover beautiful places and find a stay that makes your
              journey unforgettable.
            </p>
          </div>

          <div className="destination-grid">
            {destinations.map((destination) => (
              <article className="destination-card" key={destination.id}>
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="destination-image"
                />

                <div className="destination-overlay">
                  <div>
                    <span>{destination.country}</span>
                    <h3>{destination.name}</h3>
                    <p>{destination.hotels}</p>
                  </div>

                  <button type="button" className="destination-button">
                    Explore
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="booking-cta">
        <div className="container">
          <div className="booking-cta-content">
            <div>
              <span className="section-eyebrow">YOUR NEXT STAY AWAITS</span>

              <h2>
                Make your next journey
                <br />
                <span>extraordinary.</span>
              </h2>

              <p>
                Find a place that feels right, book with confidence, and enjoy
                a stay worth remembering.
              </p>

              <div className="booking-cta-actions">
                <button type="button" className="btn btn-primary">
                  Explore Hotels
                </button>

                <button type="button" className="btn btn-outline">
                  Create Account
                </button>
              </div>
            </div>

            <div className="booking-cta-decoration">
              <span>HOTELHUB</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;