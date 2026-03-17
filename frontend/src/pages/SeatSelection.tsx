import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bus, Seat } from "../types";
import { saveBookingDraft } from "../utils/bookingFlow";

const API_BASE = "http://localhost:5000/api";
const MAX_SEATS = 4;

const SeatSelectionPage: React.FC = () => {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bus, setBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [seatLimitMessage, setSeatLimitMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const travelDate = useMemo(() => new URLSearchParams(location.search).get("date") || "", [location.search]);

  useEffect(() => {
    const fetchBus = async () => {
      if (!busId) return;
      try {
        const suffix = travelDate ? `?date=${encodeURIComponent(travelDate)}` : "";
        const response = await axios.get<Bus>(`${API_BASE}/buses/${busId}${suffix}`);
        setBus(response.data);
        setBoardingPoint(response.data.boardingPoints[0] || "");
        setDroppingPoint(response.data.droppingPoints[0] || "");
      } catch (error) {
        console.error("Failed to fetch bus", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [busId, travelDate]);

  const seatRows = useMemo(() => {
    if (!bus) return [];
    const sorted = [...bus.seats].sort((a, b) => a.seatNumber - b.seatNumber);
    const rows: Seat[][] = [];

    for (let i = 0; i < sorted.length; i += 4) {
      rows.push(sorted.slice(i, i + 4));
    }

    return rows;
  }, [bus]);

  const totalPrice = useMemo(() => {
    if (!bus) return 0;
    return selectedSeats.length * bus.price;
  }, [bus, selectedSeats]);

  const availableSeatCount = useMemo(() => {
    return bus ? bus.seats.filter((seat) => seat.isAvailable).length : 0;
  }, [bus]);

  const canContinue = useMemo(() => {
    return selectedSeats.length >= 1 && selectedSeats.length <= MAX_SEATS && Boolean(boardingPoint) && Boolean(droppingPoint);
  }, [boardingPoint, droppingPoint, selectedSeats.length]);

  const toggleSeat = (seatNumber: number, isAvailable: boolean) => {
    if (!isAvailable) return;

    const alreadySelected = selectedSeats.includes(seatNumber);
    if (!alreadySelected && selectedSeats.length >= MAX_SEATS) {
      setSeatLimitMessage("You can book a maximum of 4 seats per booking.");
      return;
    }

    setSeatLimitMessage("");
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((item) => item !== seatNumber);
      }
      return [...prev, seatNumber].sort((a, b) => a - b);
    });
  };

  const handleContinue = () => {
    if (!bus || !busId || !canContinue) return;

    saveBookingDraft({
      busId,
      bus,
      travelDate,
      selectedSeats,
      boardingPoint,
      droppingPoint,
      totalPrice,
      passengerDetails: selectedSeats.map((seatNumber) => ({
        seatNumber,
        name: "",
        age: 0,
        gender: ""
      }))
    });

    navigate("/passenger-details");
  };

  if (loading) {
    return <p className="text-slate-600">Loading seat layout...</p>;
  }

  if (!bus) {
    return <p className="text-slate-600">Bus not found.</p>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-ticket backdrop-blur">
        <div className="mb-5 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Step 1 of 3</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">Select seats</h2>
              <p className="mt-1 text-sm text-slate-600">{bus.operatorName} | {bus.departureCity} to {bus.arrivalCity}</p>
            </div>
            <div className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">Only {availableSeatCount} seats left</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
            {travelDate ? <span><strong>Date:</strong> {travelDate}</span> : null}
            <span><strong>Departure:</strong> {new Date(bus.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span><strong>Arrival:</strong> {new Date(bus.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span><strong>Seat Type:</strong> {bus.seatType}</span>
            <span><strong>{bus.isAC ? "AC" : "Non AC"}</strong></span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(bus.amenities || []).map((amenity) => (
              <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{amenity}</span>
            ))}
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Boarding Point</label>
            <select value={boardingPoint} onChange={(e) => setBoardingPoint(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-ocean-700">
              {(bus.boardingPoints || []).map((point) => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Dropping Point</label>
            <select value={droppingPoint} onChange={(e) => setDroppingPoint(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-ocean-700">
              {(bus.droppingPoints || []).map((point) => (
                <option key={point} value={point}>{point}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500" />Available</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-blue-600" />Selected</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-slate-400" />Booked</div>
        </div>

        {seatLimitMessage ? <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">{seatLimitMessage}</p> : null}

        <div className="space-y-2 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
          {seatRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-[repeat(2,minmax(0,1fr))_2.25rem_repeat(2,minmax(0,1fr))] items-center gap-2">
              {row.slice(0, 2).map((seat) => {
                const isSelected = selectedSeats.includes(seat.seatNumber);
                const limitReached = selectedSeats.length >= MAX_SEATS && !isSelected;
                const seatClass = !seat.isAvailable
                  ? "bg-slate-400 cursor-not-allowed"
                  : isSelected
                    ? "bg-blue-600 hover:bg-blue-700"
                    : limitReached
                      ? "bg-emerald-300 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600";

                return (
                  <button
                    key={seat.seatNumber}
                    type="button"
                    onClick={() => toggleSeat(seat.seatNumber, seat.isAvailable)}
                    disabled={!seat.isAvailable || limitReached}
                    className={`h-12 rounded-xl text-sm font-semibold text-white shadow-sm transition ${seatClass}`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}

              <div className="h-12 rounded border border-dashed border-slate-300" />

              {row.slice(2).map((seat) => {
                const isSelected = selectedSeats.includes(seat.seatNumber);
                const limitReached = selectedSeats.length >= MAX_SEATS && !isSelected;
                const seatClass = !seat.isAvailable
                  ? "bg-slate-400 cursor-not-allowed"
                  : isSelected
                    ? "bg-blue-600 hover:bg-blue-700"
                    : limitReached
                      ? "bg-emerald-300 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600";

                return (
                  <button
                    key={seat.seatNumber}
                    type="button"
                    onClick={() => toggleSeat(seat.seatNumber, seat.isAvailable)}
                    disabled={!seat.isAvailable || limitReached}
                    className={`h-12 rounded-xl text-sm font-semibold text-white shadow-sm transition ${seatClass}`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-ticket backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Trip summary</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">Journey details</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p><span className="font-medium text-ink">Operator:</span> {bus.operatorName}</p>
          <p><span className="font-medium text-ink">Route:</span> {bus.departureCity} {"->"} {bus.arrivalCity}</p>
          <p><span className="font-medium text-ink">Travel date:</span> {travelDate || "Select a date from search"}</p>
          <p><span className="font-medium text-ink">Boarding:</span> {boardingPoint || "Select boarding point"}</p>
          <p><span className="font-medium text-ink">Dropping:</span> {droppingPoint || "Select dropping point"}</p>
          <p className="flex items-center justify-between"><span>Price per seat</span><span className="font-semibold">INR {bus.price}</span></p>
          <p><span className="font-medium text-ink">Selected seats:</span> {selectedSeats.length ? selectedSeats.join(", ") : "None"}</p>
          <p className="flex items-center justify-between"><span>Passengers</span><span className="font-semibold">{selectedSeats.length}</span></p>
          <p className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-ocean-900"><span>Total</span><span>INR {totalPrice}</span></p>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-ocean-900 via-ocean-700 to-brand-700 px-4 py-3 font-semibold text-white shadow-ticket transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Passenger Details
        </button>
        {!canContinue ? <p className="mt-2 text-xs text-slate-500">Select 1 to 4 seats and choose boarding and dropping points to continue.</p> : null}
      </aside>
    </section>
  );
};

export default SeatSelectionPage;
