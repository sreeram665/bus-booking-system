const express = require("express");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");

const router = express.Router();

const applyAvailabilityForDate = (bus, bookingsForDate) => {
  const blockedSeats = new Set(
    bookingsForDate
      .filter((booking) => booking.status !== "Cancelled")
      .flatMap((booking) => booking.selectedSeats)
  );

  return {
    ...bus,
    seats: bus.seats.map((seat) => ({
      ...seat,
      isAvailable: !blockedSeats.has(seat.seatNumber)
    }))
  };
};

router.get("/", async (req, res) => {
  try {
    const { departureCity, arrivalCity, date } = req.query;
    const filter = {};

    if (departureCity) {
      filter.departureCity = new RegExp(`^${String(departureCity)}$`, "i");
    }
    if (arrivalCity) {
      filter.arrivalCity = new RegExp(`^${String(arrivalCity)}$`, "i");
    }

    const buses = await Bus.find(filter).sort({ departureTime: 1, operatorName: 1 }).lean();

    if (!date) {
      return res.json(buses);
    }

    const bookings = await Booking.find({
      busId: { $in: buses.map((bus) => bus.id) },
      travelDate: String(date),
      status: "Confirmed"
    }).lean();

    const bookingsByBusId = bookings.reduce((acc, booking) => {
      acc[booking.busId] = acc[booking.busId] || [];
      acc[booking.busId].push(booking);
      return acc;
    }, {});

    res.json(
      buses.map((bus) => applyAvailabilityForDate(bus, bookingsByBusId[bus.id] || []))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buses" });
  }
});

router.get("/:busId", async (req, res) => {
  try {
    const bus = await Bus.findOne({ id: req.params.busId }).lean();

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (!req.query.date) {
      return res.json(bus);
    }

    const bookings = await Booking.find({
      busId: bus.id,
      travelDate: String(req.query.date),
      status: "Confirmed"
    }).lean();

    res.json(applyAvailabilityForDate(bus, bookings));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bus" });
  }
});

module.exports = router;
