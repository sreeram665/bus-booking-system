import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BusList from "./pages/BusList";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Bookings from "./pages/Bookings";

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/seats/:busId" element={<SeatSelection />} />
          <Route path="/passenger-details" element={<PassengerDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/my-bookings" element={<Bookings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
