import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookingDraft, BookingRecord } from "../types";
import { clearBookingDraft, loadBookingDraft } from "../utils/bookingFlow";

const API_BASES = ["http://localhost:5000/api", "http://127.0.0.1:5000/api"];

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = ((location.state as BookingDraft | null) || loadBookingDraft()) as BookingDraft | null;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canPay = useMemo(() => {
    return Boolean(
      state &&
        state.busId &&
        state.bus &&
        state.selectedSeats.length >= 1 &&
        state.selectedSeats.length <= 4 &&
        state.passengerDetails.length === state.selectedSeats.length &&
        state.passengerDetails.every((passenger) => passenger.name && passenger.age > 0 && passenger.gender) &&
        state.travelDate &&
        state.boardingPoint &&
        state.droppingPoint
    );
  }, [state]);

  useEffect(() => {
    if (state && !canPay) {
      navigate("/passenger-details", { replace: true });
    }
  }, [canPay, navigate, state]);

  const handlePayment = async () => {
    if (!canPay || !state) return;

    setLoading(true);
    setError("");

    for (const base of API_BASES) {
      try {
        const response = await axios.post<{ booking: BookingRecord }>(`${base}/bookings`, {
          busId: state.busId,
          selectedSeats: state.selectedSeats,
          passengerDetails: state.passengerDetails,
          travelDate: state.travelDate,
          boardingPoint: state.boardingPoint,
          droppingPoint: state.droppingPoint,
          paymentMethod
        });

        clearBookingDraft();
        navigate("/confirmation", {
          state: {
            booking: response.data.booking,
            bus: state.bus,
            successMessage: "Booking Successful"
          }
        });
        return;
      } catch (requestError) {
        console.error(`Payment/booking failed via ${base}`, requestError);

        if (axios.isAxiosError(requestError) && requestError.response?.data?.message) {
          setError(String(requestError.response.data.message));
          setLoading(false);
          return;
        }
      }
    }

    setError("Could not connect to backend. Start it with: cd backend && node server.js");
    setLoading(false);
  };

  if (!state) {
    return (
      <section className="rounded-[32px] border border-white/70 bg-white/85 p-8 text-center shadow-ticket backdrop-blur">
        <h2 className="text-2xl font-bold text-ink">Payment details missing</h2>
        <p className="mt-2 text-slate-600">Complete seat selection and passenger details first.</p>
        <Link to="/passenger-details" className="mt-4 inline-block rounded-full bg-gradient-to-r from-ocean-900 to-brand-700 px-5 py-2.5 text-white">
          Go to Passenger Details
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-ticket backdrop-blur">
        <div className="rounded-[28px] bg-gradient-to-r from-ink via-ocean-900 to-brand-700 px-6 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-100">Step 3 of 3</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Secure your ticket</h2>
          <p className="mt-2 text-sm text-slate-100/85">{state.bus.operatorName} | {state.bus.departureCity} to {state.bus.arrivalCity}</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Travel date</p>
            <p className="mt-2 font-semibold text-ink">{state.travelDate}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Boarding</p>
            <p className="mt-2 font-semibold text-ink">{state.boardingPoint}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dropping</p>
            <p className="mt-2 font-semibold text-ink">{state.droppingPoint}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {["UPI", "Card", "NetBanking"].map((method) => (
            <label
              key={method}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${paymentMethod === method ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"}`}
            >
              <div>
                <p className="font-semibold text-ink">{method}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Secure checkout</p>
              </div>
              <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-ocean-900 via-ocean-700 to-brand-700 px-4 py-3 font-semibold text-white shadow-ticket transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay and Confirm Booking"}
        </button>
        {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
      </div>

      <aside className="h-fit overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-ticket backdrop-blur">
        <div className="bg-brand-50 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Fare summary</p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink">Your trip snapshot</h3>
        </div>
        <div className="space-y-4 px-6 py-6 text-sm text-slate-700">
          <p><span className="font-semibold text-ink">Seats:</span> {state.selectedSeats.join(", ")}</p>
          <p><span className="font-semibold text-ink">Passengers:</span> {state.passengerDetails.length}</p>
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="font-semibold text-ink">Passengers on ticket</p>
            <div className="mt-3 space-y-2">
              {state.passengerDetails.map((passenger) => (
                <div key={`${passenger.seatNumber}-${passenger.name}`} className="flex items-center justify-between text-xs text-slate-600">
                  <span>{passenger.name}</span>
                  <span>Seat {passenger.seatNumber}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 text-lg font-bold text-ocean-900">
            <span>Total</span>
            <span>INR {state.totalPrice}</span>
          </p>
        </div>
      </aside>
    </section>
  );
};

export default Payment;
