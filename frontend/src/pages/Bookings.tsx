import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BookingRecord } from "../types";

const API_BASES = ["http://localhost:5000/api", "http://127.0.0.1:5000/api"];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    for (const base of API_BASES) {
      try {
        const response = await axios.get<BookingRecord[]>(`${base}/bookings`);
        setBookings(response.data);
        setLoading(false);
        return;
      } catch (fetchError) {
        console.error(`Failed to fetch bookings from ${base}`, fetchError);
      }
    }

    setError("Could not load bookings. Start backend with: cd backend && node server.js");
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId: string) => {
    setActiveId(bookingId);
    setError("");

    for (const base of API_BASES) {
      try {
        const response = await axios.patch<{ booking: BookingRecord }>(`${base}/bookings/${bookingId}/cancel`);
        setBookings((current) => current.map((booking) => (booking._id === bookingId ? response.data.booking : booking)));
        setActiveId("");
        return;
      } catch (requestError) {
        console.error(`Failed to cancel booking via ${base}`, requestError);
        if (axios.isAxiosError(requestError) && requestError.response?.data?.message) {
          setError(String(requestError.response.data.message));
          setActiveId("");
          return;
        }
      }
    }

    setError("Could not connect to backend. Start backend with: cd backend && node server.js");
    setActiveId("");
  };

  const filteredBookings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.bookingCode.toLowerCase().includes(q) ||
        booking.busName.toLowerCase().includes(q) ||
        booking.route.toLowerCase().includes(q) ||
        booking.passengerDetails.some((p) => p.name.toLowerCase().includes(q))
      );
    });
  }, [bookings, query]);

  const totalRevenue = useMemo(() => bookings.filter((booking) => booking.status === "Confirmed").reduce((sum, booking) => sum + booking.totalPrice, 0), [bookings]);
  const todaysBookings = useMemo(() => {
    const today = new Date().toDateString();
    return bookings.filter((booking) => new Date(booking.bookedAt).toDateString() === today).length;
  }, [bookings]);
  const cancelledCount = useMemo(() => bookings.filter((booking) => booking.status === "Cancelled").length, [bookings]);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-r from-ink via-ocean-900 to-brand-700 px-6 py-7 text-white shadow-ticket sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-100">Ticket archive</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">My Bookings</h2>
            <p className="mt-2 text-sm text-slate-100/85">Track confirmed trips, inspect ticket details, and cancel journeys from one page.</p>
          </div>
          <button type="button" onClick={fetchBookings} className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Total bookings</p>
            <p className="mt-2 text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Today</p>
            <p className="mt-2 text-2xl font-bold">{todaysBookings}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Confirmed revenue</p>
            <p className="mt-2 text-2xl font-bold">INR {totalRevenue}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Cancelled</p>
            <p className="mt-2 text-2xl font-bold">{cancelledCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-travel backdrop-blur">
        <input
          type="text"
          placeholder="Search by booking ID, bus, route, passenger"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-ocean-700"
        />
      </div>

      {loading ? <p className="text-slate-600">Loading bookings...</p> : null}
      {!loading && error ? <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-travel">{error}</div> : null}
      {!loading && !error && filteredBookings.length === 0 ? (
        <div className="rounded-[28px] border border-white/70 bg-white/85 p-8 text-center text-slate-600 shadow-travel backdrop-blur">No bookings found.</div>
      ) : null}

      <div className="grid gap-5">
        {filteredBookings.map((booking) => (
          <article key={booking._id} className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-travel backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{booking.bookingCode}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink">{booking.busName}</h3>
                <p className="mt-1 text-sm text-slate-600">{booking.route}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "Cancelled" ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>
                  {booking.status}
                </span>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{booking.paymentMethod}</span>
              </div>
            </div>

            <div className="grid gap-5 px-6 py-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                <p><span className="font-semibold text-ink">Boarding:</span> {booking.boardingPoint}</p>
                <p><span className="font-semibold text-ink">Dropping:</span> {booking.droppingPoint}</p>
                <p><span className="font-semibold text-ink">Travel Date:</span> {booking.travelDate}</p>
                <p><span className="font-semibold text-ink">Seats:</span> {booking.selectedSeats.join(", ")}</p>
                <p><span className="font-semibold text-ink">Passengers:</span> {booking.passengerDetails.map((p) => p.name).join(", ")}</p>
                <p><span className="font-semibold text-ink">Total:</span> INR {booking.totalPrice}</p>
                <p className="md:col-span-2"><span className="font-semibold text-ink">Booked At:</span> {new Date(booking.bookedAt).toLocaleString()}</p>
              </div>

              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Passengers</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {booking.passengerDetails.map((passenger) => (
                    <div key={`${booking._id}-${passenger.seatNumber}`} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                      <span>{passenger.name}</span>
                      <span className="text-xs text-slate-500">Seat {passenger.seatNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={() => cancelBooking(booking._id)}
                disabled={booking.status === "Cancelled" || activeId === booking._id}
                className="rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              >
                {activeId === booking._id ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Bookings;
