import React from "react";
import { useNavigate } from "react-router-dom";
import { Bus } from "../types";

type Props = {
  bus: Bus;
  travelDate?: string;
};

const BusCard: React.FC<Props> = ({ bus, travelDate }) => {
  const navigate = useNavigate();
  const departureDate = new Date(bus.departureTime);
  const arrivalDate = new Date(bus.arrivalTime);
  const seats = Array.isArray(bus.seats) ? bus.seats : [];
  const amenities = Array.isArray(bus.amenities) ? bus.amenities : [];
  const boardingPoints = Array.isArray(bus.boardingPoints) ? bus.boardingPoints : [];
  const droppingPoints = Array.isArray(bus.droppingPoints) ? bus.droppingPoints : [];
  const availableSeats = seats.filter((seat) => seat.isAvailable).length;

  const durationMs = Math.max(arrivalDate.getTime() - departureDate.getTime(), 0);
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const ratingLabel = bus.rating >= 4.4 ? "Top Rated" : bus.rating >= 4.0 ? "Very Good" : "Reliable";

  return (
    <article className="overflow-hidden rounded-[28px] bg-white/90 shadow-travel ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:shadow-ticket">
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-brand-50 via-white to-ocean-50 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">{bus.operatorName}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{availableSeats} seats left</span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-600">{bus.departureCity} to {bus.arrivalCity}</p>
          </div>

          <div className="text-right">
            <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {bus.rating.toFixed(1)} {ratingLabel}
            </p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ocean-900">INR {bus.price}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">per seat</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <p className="text-3xl font-bold tracking-tight text-ink">{departureDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            <p className="mt-1 text-sm text-slate-500">{boardingPoints[0] || bus.departureCity}</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">{durationHours}h {durationMinutes}m</p>
            <div className="mt-2 h-px min-w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <p className="mt-2 text-xs font-medium text-slate-500">{bus.seatType} | {bus.isAC ? "AC" : "Non AC"}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl font-bold tracking-tight text-ink">{arrivalDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            <p className="mt-1 text-sm text-slate-500">{droppingPoints[0] || bus.arrivalCity}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {amenities.slice(0, 4).map((amenity) => (
            <span key={amenity} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-dashed border-slate-200 pt-4">
          <div className="space-y-1 text-xs text-slate-500">
            <p>Boarding options: {boardingPoints.slice(0, 2).join(", ") || "Main Boarding Point"}</p>
            <p>Dropping options: {droppingPoints.slice(0, 2).join(", ") || "Main Dropping Point"}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/seats/${bus.id}${travelDate ? `?date=${encodeURIComponent(travelDate)}` : ""}`)}
            className="rounded-full bg-gradient-to-r from-ocean-900 via-ocean-700 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-ticket transition hover:brightness-110"
          >
            View Seats
          </button>
        </div>
      </div>
    </article>
  );
};

export default BusCard;
