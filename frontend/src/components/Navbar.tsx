import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100" : "text-slate-600 hover:bg-white/70 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3 text-ink">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-700 to-ocean-900 text-sm font-bold text-white shadow-ticket">
            BB
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">Bus Booking</span>
            <span className="block text-xs uppercase tracking-[0.28em] text-slate-500">Premium Routes</span>
          </span>
        </NavLink>
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/" className={linkClasses} end>
            Home
          </NavLink>
          <NavLink to="/buses" className={linkClasses}>
            Buses
          </NavLink>
          <NavLink to="/my-bookings" className={linkClasses}>
            My Bookings
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
