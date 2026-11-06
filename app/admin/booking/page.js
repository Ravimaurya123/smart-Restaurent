"use client";

import { useEffect, useState } from "react";
import AdminGuard from "../../../components/AdminGuard";

const statuses = [
  "Pending",
  "Confirmed",
  "Cancelled",
];

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/bookings"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch bookings"
        );
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(
        "FETCH BOOKINGS ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings =
    bookings.filter((booking) => {
      const searchText =
        search.toLowerCase();

      return (
        booking.name
          ?.toLowerCase()
          .includes(searchText) ||
        booking.phone?.includes(
          searchText
        ) ||
        booking._id
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  const totalBookings =
    bookings.length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Pending"
    ).length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Confirmed"
    ).length;

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "Cancelled"
    ).length;

  const updateBookingStatus = async (
    id,
    status
  ) => {
    try {
      const response = await fetch(
        "/api/bookings/" + id,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update booking"
        );
      }

      setBookings(
        (currentBookings) =>
          currentBookings.map(
            (booking) =>
              booking._id === id
                ? {
                    ...booking,
                    status:
                      data.booking
                        .status,
                  }
                : booking
          )
      );

      alert(
        "Booking status updated successfully"
      );
    } catch (error) {
      console.error(
        "UPDATE BOOKING STATUS ERROR:",
        error
      );

      alert(error.message);
    }
  };

  return (
    <AdminGuard>

      <main className="admin-booking-page">

        <div className="admin-booking-header">

          <div>

            <p>
              RESTAURANT MANAGEMENT
            </p>

            <h1>
              Table Bookings
            </h1>

            <span>
              Manage customer table
              reservations from one place.
            </span>

          </div>

        </div>

        <section className="booking-stats">

          <div className="booking-stat-card">

            <span>
              Total Bookings
            </span>

            <strong>
              {totalBookings}
            </strong>

          </div>

          <div className="booking-stat-card">

            <span>
              Pending
            </span>

            <strong>
              {pendingBookings}
            </strong>

          </div>

          <div className="booking-stat-card">

            <span>
              Confirmed
            </span>

            <strong>
              {confirmedBookings}
            </strong>

          </div>

          <div className="booking-stat-card">

            <span>
              Cancelled
            </span>

            <strong>
              {cancelledBookings}
            </strong>

          </div>

        </section>

        <section className="admin-booking-card">

          <div className="admin-booking-toolbar">

            <div>

              <h2>
                All Reservations
              </h2>

              <p>
                Review customer reservations.
              </p>

            </div>

            <input
              type="text"
              placeholder="Search booking..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {loading && (

            <div className="no-bookings">
              Loading bookings...
            </div>

          )}

          {error && !loading && (

            <div className="no-bookings">

              <p>
                {error}
              </p>

              <button
                className="booking-btn"
                style={{
                  maxWidth: "200px",
                  marginTop: "10px",
                }}
                onClick={fetchBookings}
              >
                Try Again
              </button>

            </div>

          )}

          {!loading && !error && (

            <div className="booking-table-wrapper">

              <table className="booking-table">

                <thead>

                  <tr>

                    <th>
                      Booking
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Date & Time
                    </th>

                    <th>
                      Guests
                    </th>

                    <th>
                      Request
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredBookings.map(
                    (booking) => (

                      <tr
                        key={booking._id}
                      >

                        <td>

                          <strong>
                            {booking._id.slice(
                              -8
                            )}
                          </strong>

                        </td>

                        <td>

                          <div className="booking-customer">

                            <strong>
                              {booking.name}
                            </strong>

                            <span>
                              {booking.phone}
                            </span>

                          </div>

                        </td>

                        <td>

                          <div className="booking-date">

                            <strong>
                              {booking.date}
                            </strong>

                            <span>
                              {booking.time}
                            </span>

                          </div>

                        </td>

                        <td>

                          <span className="guest-count">
                            {booking.guests} Guests
                          </span>

                        </td>

                        <td>

                          <span className="booking-request">

                            {booking.request ||
                              "No special request"}

                          </span>

                        </td>

                        <td>

                          <select
                            value={
                              booking.status
                            }
                            onChange={(e) =>
                              updateBookingStatus(
                                booking._id,
                                e.target.value
                              )
                            }
                            className={`booking-status ${booking.status
                              .toLowerCase()
                              .replace(
                                " ",
                                "-"
                              )}`}
                          >

                            {statuses.map(
                              (status) => (

                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>

                              )
                            )}

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                  {filteredBookings.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="no-bookings"
                      >
                        No bookings found.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </AdminGuard>
  );
}