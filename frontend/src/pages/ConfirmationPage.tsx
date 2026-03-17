import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookingRecord, Bus } from "../types";

type ConfirmationState = {
  booking?: BookingRecord;
  bus?: Bus;
  successMessage?: string;
};

const Confirmation: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as ConfirmationState;

  if (!state.booking || !state.bus) {
    return (
      <section className="rounded-[32px] border border-white/70 bg-white/85 p-8 text-center shadow-ticket backdrop-blur">
        <h2 className="text-2xl font-bold text-ink">No booking found</h2>
        <Link to="/" className="mt-4 inline-block rounded-full bg-gradient-to-r from-ocean-900 to-brand-700 px-5 py-2.5 text-white">
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl overflow-hidden rounded-[34px] border border-white/70 bg-white/85 shadow-ticket backdrop-blur">
      <div className="bg-gradient-to-r from-ink via-ocean-900 to-brand-700 px-8 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-100">{state.successMessage || "Booking Successful"}</p>
        <h2 className="mt-2 text-4xl font-bold tracking-tight">Your e-ticket is ready</h2>
        <p className="mt-2 text-sm text-slate-100/85">Keep this booking ID for reference and use My Bookings to cancel or review later.</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative border-b border-dashed border-slate-200 px-8 py-8 lg:border-b-0 lg:border-r">
          <div className="absolute -left-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-[var(--bg)] lg:block" />
          <div className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 rounded-full bg-[var(--bg)] lg:block" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Booking ID</p>
              <p className="mt-2 text-lg font-bold text-ink">{state.booking.bookingCode}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-bold text-emerald-600">{state.booking.status}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold text-ink">Operator:</span> {state.booking.operatorName || state.bus.operatorName}</p>
              <p><span className="font-semibold text-ink">Route:</span> {state.booking.route}</p>
              <p><span className="font-semibold text-ink">Travel Date:</span> {state.booking.travelDate}</p>
              <p><span className="font-semibold text-ink">Boarding Point:</span> {state.booking.boardingPoint}</p>
              <p><span className="font-semibold text-ink">Dropping Point:</span> {state.booking.droppingPoint}</p>
              <p><span className="font-semibold text-ink">Seat Numbers:</span> {state.booking.selectedSeats.join(", ")}</p>
              <p><span className="font-semibold text-ink">Payment Method:</span> {state.booking.paymentMethod}</p>
              <p><span className="font-semibold text-ink">Total Price:</span> INR {state.booking.totalPrice}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-ink">Passenger Details</h3>
              <div className="mt-3 space-y-3">
                {state.booking.passengerDetails.map((passenger) => (
                  <div key={`${passenger.seatNumber}-${passenger.name}`} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                    <p className="font-semibold text-ink">Seat {passenger.seatNumber}</p>
                    <p className="mt-1">{passenger.name}</p>
                    <p className="text-slate-500">Age {passenger.age} | {passenger.gender}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-50/70 px-8 py-8">
          <div className="rounded-[28px] border border-brand-100 bg-white px-6 py-6 shadow-travel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Boarding pass style</p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">Journey snapshot</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>From</span>
                <span className="font-semibold text-ink">{state.bus.departureCity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>To</span>
                <span className="font-semibold text-ink">{state.bus.arrivalCity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Travellers</span>
                <span className="font-semibold text-ink">{state.booking.passengerDetails.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Departure</span>
                <span className="font-semibold text-ink">{new Date(state.bus.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Ticket reference</p>
              <p className="mt-2 font-mono text-2xl font-bold tracking-[0.18em] text-ink">{state.booking.bookingCode}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-8 py-6">
        <Link to="/" className="rounded-full bg-gradient-to-r from-ocean-900 to-brand-700 px-5 py-2.5 font-semibold text-white shadow-ticket transition hover:brightness-110">
          Back to Home
        </Link>
        <Link to="/my-bookings" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50">
          View My Bookings
        </Link>
      </div>
    </section>
  );
};

export default Confirmation;
