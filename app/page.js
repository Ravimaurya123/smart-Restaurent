export default function Home() {
  return (
    <main>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO SMART RESTAURANT
          </p>

          <h1>
            Delicious Food.
            <br />
            <span>Smart Experience.</span>
          </h1>

          <p className="hero-description">
            Discover delicious meals, order your favorite food,
            and enjoy a smarter restaurant experience.
          </p>

          <div className="hero-buttons">
            <a href="/menu" className="primary-btn">
              Explore Menu
            </a>

            <a href="/booking" className="secondary-btn">
              Book a Table
            </a>
          </div>

        </div>

      </section>


      {/* Popular Food Section */}
      <section className="popular">

        <div className="section-heading">
          <p>OUR SPECIALS</p>
          <h2>Popular Dishes</h2>
          <span>
            Try some of our most loved dishes.
          </span>
        </div>


        <div className="food-grid">

          <div className="food-card">
            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
              alt="Italian Pizza"
            />

            <h3>Italian Pizza</h3>
            <p>Fresh vegetables, cheese and delicious toppings.</p>
            <strong>₹249</strong>
          </div>


          <div className="food-card">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
              alt="Classic Burger"
            />

            <h3>Classic Burger</h3>
            <p>Juicy burger with fresh vegetables and cheese.</p>
            <strong>₹199</strong>
          </div>


          <div className="food-card">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80"
              alt="Chicken Biryani"
            />

            <h3>Chicken Biryani</h3>
            <p>Fragrant rice with delicious spices and chicken.</p>
            <strong>₹299</strong>
          </div>

        </div>

      </section>


      {/* Why Choose Us */}
      <section className="why-us">

        <div className="section-heading">
          <p>WHY US</p>
          <h2>Why Choose Smart Restaurant?</h2>
        </div>

        <div className="features">

          <div className="feature">
            <div>🍽️</div>
            <h3>Quality Food</h3>
            <p>
              Fresh ingredients and delicious meals prepared
              with care.
            </p>
          </div>

          <div className="feature">
            <div>⚡</div>
            <h3>Fast Service</h3>
            <p>
              Quick ordering and real-time order tracking.
            </p>
          </div>

          <div className="feature">
            <div>🤖</div>
            <h3>Smart Experience</h3>
            <p>
              Smart recommendations based on your preferences.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}