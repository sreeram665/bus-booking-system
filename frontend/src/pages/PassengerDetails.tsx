import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingDraft, PassengerDetail, SavedPassengerProfile } from "../types";
import { loadBookingDraft, saveBookingDraft } from "../utils/bookingFlow";

const SAVED_PASSENGERS_KEY = "bus-booking-saved-passengers";

type PassengerForm = {
  name: string;
  age: string;
  gender: string;
};

const PassengerDetails: React.FC = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [savedPassengers, setSavedPassengers] = useState<SavedPassengerProfile[]>([]);
  const [passengerForms, setPassengerForms] = useState<Record<number, PassengerForm>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const nextDraft = loadBookingDraft();
    setDraft(nextDraft);

    if (nextDraft) {
      const nextForms = nextDraft.selectedSeats.reduce<Record<number, PassengerForm>>((acc, seatNumber) => {
        const existing = nextDraft.passengerDetails.find((passenger) => passenger.seatNumber === seatNumber);
        acc[seatNumber] = {
          name: existing?.name || "",
          age: existing?.age ? String(existing.age) : "",
          gender: existing?.gender || ""
        };
        return acc;
      }, {});
      setPassengerForms(nextForms);
    }

    try {
      const raw = window.localStorage.getItem(SAVED_PASSENGERS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSavedPassengers(parsed);
      }
    } catch (error) {
      console.error("Failed to load saved passengers", error);
    }
  }, []);

  useEffect(() => {
    if (!draft) return;

    const passengerDetails: PassengerDetail[] = draft.selectedSeats.map((seatNumber) => ({
      seatNumber,
      name: passengerForms[seatNumber]?.name?.trim() || "",
      age: passengerForms[seatNumber]?.age ? Number(passengerForms[seatNumber].age) : 0,
      gender: passengerForms[seatNumber]?.gender || ""
    }));

    saveBookingDraft({
      ...draft,
      passengerDetails
    });
  }, [draft, passengerForms]);

  const allPassengerDetailsFilled = useMemo(() => {
    if (!draft || draft.selectedSeats.length === 0) return false;

    return draft.selectedSeats.every((seatNumber) => {
      const form = passengerForms[seatNumber];
      return Boolean(form && form.name.trim() && form.age && Number(form.age) > 0 && form.gender);
    });
  }, [draft, passengerForms]);

  const persistSavedPassengers = (nextProfiles: SavedPassengerProfile[]) => {
    setSavedPassengers(nextProfiles);
    window.localStorage.setItem(SAVED_PASSENGERS_KEY, JSON.stringify(nextProfiles));
  };

  const updatePassengerForm = (seatNumber: number, field: keyof PassengerForm, value: string) => {
    setMessage("");
    setPassengerForms((prev) => ({
      ...prev,
      [seatNumber]: {
        ...prev[seatNumber],
        [field]: value
      }
    }));
  };

  const applySavedPassenger = (seatNumber: number, profileId: string) => {
    const profile = savedPassengers.find((item) => item.id === profileId);
    if (!profile) return;

    setPassengerForms((prev) => ({
      ...prev,
      [seatNumber]: {
        name: profile.name,
        age: String(profile.age),
        gender: profile.gender
      }
    }));
    setMessage(`Applied saved traveller to seat ${seatNumber}.`);
  };

  const savePassengerProfile = (seatNumber: number) => {
    const form = passengerForms[seatNumber];
    if (!form || !form.name.trim() || !form.age || Number(form.age) <= 0 || !form.gender) {
      setMessage("Enter valid passenger details before saving traveller info.");
      return;
    }

    const normalizedName = form.name.trim();
    const existing = savedPassengers.find(
      (profile) =>
        profile.name.toLowerCase() === normalizedName.toLowerCase() &&
        profile.age === Number(form.age) &&
        profile.gender === form.gender
    );

    if (existing) {
      setMessage(`${normalizedName} is already in saved travellers.`);
      return;
    }

    const nextProfiles = [
      ...savedPassengers,
      {
        id: `TRV${Date.now()}`,
        name: normalizedName,
        age: Number(form.age),
        gender: form.gender
      }
    ];

    persistSavedPassengers(nextProfiles);
    setMessage(`${normalizedName} saved for future bookings.`);
  };

  const removeSavedPassenger = (profileId: string) => {
    persistSavedPassengers(savedPassengers.filter((profile) => profile.id !== profileId));
    setMessage("Saved traveller removed.");
  };

  const handleContinue = () => {
    if (!draft || !allPassengerDetailsFilled) return;

    const passengerDetails: PassengerDetail[] = draft.selectedSeats.map((seatNumber) => ({
      seatNumber,
      name: passengerForms[seatNumber].name.trim(),
      age: Number(passengerForms[seatNumber].age),
      gender: passengerForms[seatNumber].gender
    }));

    const nextDraft: BookingDraft = {
      ...draft,
      passengerDetails
    };

    saveBookingDraft(nextDraft);
    navigate("/payment", { state: nextDraft });
  };

  if (!draft) {
    return (
      <section className="rounded-[32px] border border-white/70 bg-white/85 p-8 text-center shadow-ticket backdrop-blur">
        <h2 className="text-2xl font-bold text-ink">Passenger details missing</h2>
        <p className="mt-2 text-slate-600">Select seats first, then continue to passenger details.</p>
        <Link to="/buses" className="mt-4 inline-block rounded-full bg-gradient-to-r from-ocean-900 to-brand-700 px-5 py-2.5 text-white">
          Back to Buses
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
      <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-ticket backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Step 2 of 3</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">Passenger details</h2>
        <p className="mt-2 text-sm text-slate-600">Enter traveller information for each selected seat. These fields are fully editable.</p>

        {savedPassengers.length > 0 ? (
          <div className="mt-5 rounded-[28px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">Saved Travellers</p>
                <p className="text-xs text-slate-500">Reuse passengers like an IRCTC traveller list</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {savedPassengers.map((profile) => (
                <div key={profile.id} className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200">
                  <p className="font-semibold text-ink">{profile.name}</p>
                  <p className="text-slate-600">Age {profile.age} | {profile.gender}</p>
                  <button type="button" onClick={() => removeSavedPassenger(profile.id)} className="mt-2 text-xs font-semibold text-red-600">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {message ? <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">{message}</p> : null}

        <div className="mt-5 space-y-4">
          {draft.selectedSeats.map((seatNumber) => (
            <div key={seatNumber} className="rounded-[28px] bg-slate-50 p-5 ring-1 ring-slate-200">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Traveller</p>
                  <p className="mt-1 text-lg font-bold text-ink">Seat {seatNumber}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {savedPassengers.length > 0 ? (
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          applySavedPassenger(seatNumber, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs outline-none focus:border-ocean-700"
                    >
                      <option value="">Use saved traveller</option>
                      {savedPassengers.map((profile) => (
                        <option key={profile.id} value={profile.id}>{profile.name}</option>
                      ))}
                    </select>
                  ) : null}
                  <button type="button" onClick={() => savePassengerProfile(seatNumber)} className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
                    Save Traveller
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Passenger Name"
                  value={passengerForms[seatNumber]?.name || ""}
                  onChange={(e) => updatePassengerForm(seatNumber, "name", e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-700"
                />
                <input
                  type="number"
                  min={1}
                  max={120}
                  placeholder="Age"
                  value={passengerForms[seatNumber]?.age || ""}
                  onChange={(e) => updatePassengerForm(seatNumber, "age", e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-700"
                />
                <select
                  value={passengerForms[seatNumber]?.gender || ""}
                  onChange={(e) => updatePassengerForm(seatNumber, "gender", e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean-700"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="h-fit rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-ticket backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Trip summary</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">Ready for payment</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p><span className="font-medium text-ink">Operator:</span> {draft.bus.operatorName}</p>
          <p><span className="font-medium text-ink">Route:</span> {draft.bus.departureCity} {"->"} {draft.bus.arrivalCity}</p>
          <p><span className="font-medium text-ink">Travel date:</span> {draft.travelDate}</p>
          <p><span className="font-medium text-ink">Boarding:</span> {draft.boardingPoint}</p>
          <p><span className="font-medium text-ink">Dropping:</span> {draft.droppingPoint}</p>
          <p><span className="font-medium text-ink">Seats:</span> {draft.selectedSeats.join(", ")}</p>
          <p className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-ocean-900"><span>Total</span><span>INR {draft.totalPrice}</span></p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!allPassengerDetailsFilled}
            className="w-full rounded-full bg-gradient-to-r from-ocean-900 via-ocean-700 to-brand-700 px-4 py-3 font-semibold text-white shadow-ticket transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Payment
          </button>
          <button
            type="button"
            onClick={() => navigate(`/seats/${draft.busId}?date=${encodeURIComponent(draft.travelDate)}`)}
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Seats
          </button>
        </div>
        {!allPassengerDetailsFilled ? <p className="mt-2 text-xs text-slate-500">Complete all passenger fields to continue.</p> : null}
      </aside>
    </section>
  );
};

export default PassengerDetails;
