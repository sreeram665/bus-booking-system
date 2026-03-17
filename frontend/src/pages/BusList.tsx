import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import BusCard from "../components/BusCard";
import { Bus } from "../types";

const API_BASE = "http://localhost:5000/api";

type TimeFilter = "all" | "morning" | "evening";
type SortOption = "price" | "departure" | "arrival" | "rating";

const getHour = (dateString: string) => new Date(dateString).getHours();

const BusList: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("departure");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [onlyAC, setOnlyAC] = useState(false);
  const [onlyNonAC, setOnlyNonAC] = useState(false);
  const [seatType, setSeatType] = useState("all");
  const [onlyHighRated, setOnlyHighRated] = useState(false);
  const [operator, setOperator] = useState("all");
  const location = useLocation();

  const searchInfo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      departureCity: params.get("departureCity") || "",
      arrivalCity: params.get("arrivalCity") || "",
      date: params.get("date") || ""
    };
  }, [location.search]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchInfo.departureCity) params.append("departureCity", searchInfo.departureCity);
        if (searchInfo.arrivalCity) params.append("arrivalCity", searchInfo.arrivalCity);
        if (searchInfo.date) params.append("date", searchInfo.date);

        const response = await axios.get<Bus[]>(`${API_BASE}/buses?${params.toString()}`);
        setBuses(response.data);
      } catch (error) {
        console.error("Failed to fetch buses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [searchInfo.departureCity, searchInfo.arrivalCity, searchInfo.date]);

  const operators = useMemo(() => Array.from(new Set(buses.map((bus) => bus.operatorName))).sort(), [buses]);

  const maxAvailablePrice = useMemo(() => (buses.length ? Math.max(...buses.map((bus) => bus.price)) : 2000), [buses]);

  useEffect(() => {
    setMaxPrice(maxAvailablePrice);
  }, [maxAvailablePrice]);

  const filteredBuses = useMemo(() => {
    return buses
      .filter((bus) => {
        if (timeFilter === "morning") {
          const hour = getHour(bus.departureTime);
          if (hour < 5 || hour >= 12) return false;
        }
        if (timeFilter === "evening") {
          const hour = getHour(bus.departureTime);
          if (hour < 17 || hour >= 24) return false;
        }
        if (bus.price > maxPrice) return false;
        if (onlyAC && !bus.isAC) return false;
        if (onlyNonAC && bus.isAC) return false;
        if (seatType !== "all" && bus.seatType !== seatType) return false;
        if (onlyHighRated && bus.rating < 4) return false;
        if (operator !== "all" && bus.operatorName !== operator) return false;
        return true;
      })
      .sort((left, right) => {
        if (sortBy === "price") return left.price - right.price;
        if (sortBy === "departure") return new Date(left.departureTime).getTime() - new Date(right.departureTime).getTime();
        if (sortBy === "arrival") return new Date(left.arrivalTime).getTime() - new Date(right.arrivalTime).getTime();
        return right.rating - left.rating;
      });
  }, [buses, maxPrice, onlyAC, onlyHighRated, onlyNonAC, operator, seatType, sortBy, timeFilter]);

  const quickStats = useMemo(() => {
    const morning = buses.filter((bus) => {
      const hour = getHour(bus.departureTime);
      return hour >= 5 && hour < 12;
    }).length;

    const evening = buses.filter((bus) => {
      const hour = getHour(bus.departureTime);
      return hour >= 17 && hour < 24;
    }).length;

    const cheapest = buses.length ? Math.min(...buses.map((bus) => bus.price)) : 0;

    return { total: buses.length, morning, evening, cheapest };
  }, [buses]);

  const filterBtnClass = (value: TimeFilter) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      timeFilter === value ? "bg-ink text-white shadow-ticket" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-r from-ink via-ocean-900 to-brand-700 px-6 py-7 text-white shadow-ticket sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-100">Route overview</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {searchInfo.departureCity || "All cities"} to {searchInfo.arrivalCity || "All cities"}
            </h2>
            <p className="mt-2 text-sm text-slate-100/85">{searchInfo.date ? `Travel date: ${searchInfo.date}` : "Choose filters to shape the best route mix."}</p>
          </div>
          <Link to="/" className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
            Modify Search
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Total buses</p>
            <p className="mt-2 text-2xl font-bold">{quickStats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Morning</p>
            <p className="mt-2 text-2xl font-bold">{quickStats.morning}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Evening</p>
            <p className="mt-2 text-2xl font-bold">{quickStats.evening}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Best fare</p>
            <p className="mt-2 text-2xl font-bold">INR {quickStats.cheapest || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
        <aside className="h-fit rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-travel backdrop-blur xl:sticky xl:top-24">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Filter panel</p>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">Refine your trip</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setTimeFilter("all");
                setSortBy("departure");
                setMaxPrice(maxAvailablePrice);
                setOnlyAC(false);
                setOnlyNonAC(false);
                setSeatType("all");
                setOnlyHighRated(false);
                setOperator("all");
              }}
              className="text-xs font-semibold text-brand-700"
            >
              Reset
            </button>
          </div>

          <div className="mt-5 space-y-5 text-sm text-slate-700">
            <div>
              <p className="font-semibold text-ink">Time window</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className={filterBtnClass("all")} onClick={() => setTimeFilter("all")}>All</button>
                <button type="button" className={filterBtnClass("morning")} onClick={() => setTimeFilter("morning")}>Morning</button>
                <button type="button" className={filterBtnClass("evening")} onClick={() => setTimeFilter("evening")}>Evening</button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <label className="font-semibold text-ink">Max price</label>
              <input
                type="range"
                min={300}
                max={Math.max(maxAvailablePrice, 300)}
                step={50}
                value={Math.min(maxPrice, Math.max(maxAvailablePrice, 300))}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-brand-500"
              />
              <p className="mt-1 text-xs text-slate-500">Up to INR {maxPrice}</p>
            </div>

            <div>
              <p className="font-semibold text-ink">Bus type</p>
              <div className="mt-3 grid gap-2">
                <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"><input type="checkbox" checked={onlyAC} onChange={(e) => setOnlyAC(e.target.checked)} /> AC</label>
                <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200"><input type="checkbox" checked={onlyNonAC} onChange={(e) => setOnlyNonAC(e.target.checked)} /> Non AC</label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-ink">Seat type</label>
              <select value={seatType} onChange={(e) => setSeatType(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="all">All</option>
                <option value="Seater">Seater</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            </div>

            <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 font-semibold text-ink ring-1 ring-slate-200">
              <input type="checkbox" checked={onlyHighRated} onChange={(e) => setOnlyHighRated(e.target.checked)} /> Rating 4+
            </label>

            <div>
              <label className="font-semibold text-ink">Bus operator</label>
              <select value={operator} onChange={(e) => setOperator(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="all">All Operators</option>
                {operators.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-travel backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Sorting</p>
                <p className="mt-1 text-sm font-semibold text-ink">{filteredBuses.length} buses match your current view</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Sort by
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                  <option value="price">Price (Low to High)</option>
                  <option value="departure">Departure Time</option>
                  <option value="arrival">Arrival Time</option>
                  <option value="rating">Rating</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? <p className="text-slate-600">Loading buses...</p> : null}
          {!loading && filteredBuses.length === 0 ? (
            <div className="rounded-[28px] border border-white/70 bg-white/85 p-8 text-center text-slate-600 shadow-travel backdrop-blur">
              No buses found for the selected filters.
            </div>
          ) : null}

          <div className="grid gap-5">
            {filteredBuses.map((bus) => (
              <BusCard key={bus.id} bus={bus} travelDate={searchInfo.date} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusList;
