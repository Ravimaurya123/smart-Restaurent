"use client";

import { useState } from "react";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    request: "",
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const generatedBookingId =
      "BK" + Math.floor(100000 + Math.random() * 900000);

    setBookingId(generatedBookingId);
    setBookingConfirmed(true);
  };

  if (bookingConfirmed) {
    return (
      <main className="booking-page">
        <section className="booking-success">
          <div className="booking-success-icon">✓</div>

          <p className="booking-label">RESERVATION CONFIRMED</p>

          <h1>Your Table is Booked!</h1>

          <p className="booking-success-text">
            Thank you, <strong>{formData.name}</strong>. Your table
            reservation has been successfully confirmed.
          </p>

          <div className="booking-details">
            <div className="booking-detail">
              <span>Booking ID</span>
              <strong>{bookingId}</strong>
            </div>

            <div className="booking-detail">
              <span>Date</span>
              <strong>{formData.date}</strong>
            </div>

            <div className="booking-detail">
              <span>Time</span>
              <strong>{formData.time}</strong>
            </div>

            <div className="booking-detail">
              <span>Guests</span>
              <strong>{formData.guests}</strong>
            </div>

            <div className="booking-detail">
              <span>Phone</span>
              <strong>{formData.phone}</strong>
            </div>
          </div>

          <p className="booking-note">
            Please arrive 10 minutes before your reservation time.
          </p>

          <button
            className="booking-btn"
            onClick={() => {
              setBookingConfirmed(false);
              setBookingId("");
              setFormData({
                name: "",
                phone: "",
                date: "",
                time: "",
                guests: "2",
                request: "",
              });
            }}
          >
            Book Another Table
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <section className="booking-header">
        <p>RESERVE YOUR TABLE</p>

        <h1>Book a Table</h1>

        <span>
          Enjoy delicious food and a great dining experience with us.
        </span>
      </section>

      <section className="booking-container">
        <div className="booking-info">
          <div className="booking-info-card">
            <div className="booking-info-icon">🍽️</div>

            <h2>Perfect Dining Experience</h2>

            <p>
              Reserve your table in advance and enjoy a comfortable
              dining experience without waiting.
            </p>
          </div>

          <div className="booking-info-card">
            <div className="booking-info-icon">⏰</div>

            <h2>Flexible Timing</h2>

            <p>
              Choose your preferred date and time according to your
              schedule.
            </p>
          </div>

          <div className="booking-info-card">
            <div className="booking-info-icon">👨‍👩‍👧‍👦</div>

            <h2>For Everyone</h2>

            <p>
              Whether you are dining alone, with friends, or with
              family, we have a place for you.
            </p>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-card">
            <h2>Reservation Details</h2>

            <div className="booking-form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="booking-form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
              />
            </div>

            <div className="booking-form-row">
              <div className="booking-form-group">
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="booking-form-group">
                <label>Time</label>

                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select time</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>

                  <option value="06:00 PM">06:00 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                  <option value="08:00 PM">08:00 PM</option>
                  <option value="08:30 PM">08:30 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                  <option value="09:30 PM">09:30 PM</option>
                </select>
              </div>
            </div>

            <div className="booking-form-group">
              <label>Number of Guests</label>

              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="7">7 Guests</option>
                <option value="8">8 Guests</option>
                <option value="9">9 Guests</option>
                <option value="10">10 Guests</option>
              </select>
            </div>

            <div className="booking-form-group">
              <label>Special Request</label>

              <textarea
                name="request"
                placeholder="Birthday, anniversary, window seat, etc. (optional)"
                value={formData.request}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <button type="submit" className="booking-btn">
              Confirm Reservation
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}