import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const cities = [
  "Trivandrum",
  "Kochi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Coimbatore",
  "Madurai",
  "Mysore",
  "Delhi",
  "Jaipur",
  "Mumbai",
  "Pune"
];

const featuredRoutes = [
  "Trivandrum to Kochi",
  "Chennai to Bangalore",
  "Hyderabad to Chennai",
  "Mumbai to Pune"
];

const Home: React.FC = () => {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const canSearch = useMemo(() => {
    return Boolean(departureCity && arrivalCity && date && departureCity !== arrivalCity);
  }, [departureCity, arrivalCity, date]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const query = new URLSearchParams({
      departureCity,
      arrivalCity,
      date
    }).toString();

    navigate(`/buses?${query}`);
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-ink via-ocean-900 to-brand-700 px-7 py-8 text-white shadow-ticket sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-hero-grid bg-[size:36px_36px] opacity-20" />
          <div className="absolute -right-16 top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-brand-500/30 blur-2xl" />

          <div className="relative z-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-brand-100">Smart bus booking</p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Reserve premium bus seats with a calmer, cleaner booking flow.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100/90 sm:text-base">
              Search across major Indian routes, compare timing and comfort instantly, and carry your saved travellers from one booking to the next.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">132</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-200">Active routes</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">40</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-200">Seats per bus</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold">4</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-200">Seat max / booking</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              {featuredRoutes.map((route) => (
                <span key={route} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-slate-100 backdrop-blur-sm">
                  {route}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-ticket backdrop-blur sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Search buses</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">Plan your next journey</h2>
            </div>
            <div className="rounded-2xl bg-brand-50 px-4 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-700">Best fare</p>
              <p className="text-lg font-bold text-brand-700">From INR 390</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Departure
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-ocean-700 focus:bg-white"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                required
              >
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={`dep-${city}`} value={city}>{city}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Arrival
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-ocean-700 focus:bg-white"
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                required
              >
                <option value="">Select arrival city</option>
                {cities.map((city) => (
                  <option key={`arr-${city}`} value={city}>{city}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Date
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-ocean-700 focus:bg-white"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-ocean-900 via-ocean-700 to-brand-700 px-4 py-3 font-semibold text-white shadow-ticket transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSearch}
            >
              Search Premium Routes
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-travel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Why this UI</p>
          <h3 className="mt-2 text-xl font-bold text-ink">Travel dashboard feel</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Designed to feel closer to a polished product than a college CRUD form, while still keeping the code maintainable.</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-travel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Fast reuse</p>
          <h3 className="mt-2 text-xl font-bold text-ink">Saved travellers</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Passenger info can now be reused like a lightweight IRCTC traveller list, cutting repeat form filling.</p>
        </div>
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-travel backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Safer booking</p>
          <h3 className="mt-2 text-xl font-bold text-ink">Date-based seats</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Seat availability is now scoped to travel date, so one booking no longer blocks every future trip on the same bus.</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
