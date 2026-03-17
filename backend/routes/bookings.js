const express = require("express");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

const router = express.Router();

const createBookingCode = () => {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `BUS${suffix}`;
};

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ bookedAt: -1 }).lean();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { busId, selectedSeats, passengerDetails, paymentMethod, boardingPoint, droppingPoint, travelDate } = req.body;

    if (!busId || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({ message: "busId and selectedSeats are required" });
    }
    if (selectedSeats.length > 4) {
      return res.status(400).json({ message: "You can book a maximum of 4 seats per booking." });
    }
    if (!Array.isArray(passengerDetails) || passengerDetails.length !== selectedSeats.length) {
      return res.status(400).json({ message: "Passenger details are required for all selected seats." });
    }
    if (!travelDate) {
      return res.status(400).json({ message: "Travel date is required." });
    }
    if (!boardingPoint || !droppingPoint) {
      return res.status(400).json({ message: "Boarding point and dropping point are required." });
    }

    const invalidPassenger = passengerDetails.find(
      (passenger) =>
        !passenger ||
        !selectedSeats.includes(passenger.seatNumber) ||
        !passenger.name ||
        !String(passenger.name).trim() ||
        !passenger.age ||
        Number(passenger.age) <= 0 ||
        !passenger.gender
    );

    if (invalidPassenger) {
      return res.status(400).json({ message: "Each passenger must include valid name, age, gender, and seat number." });
    }

    const bus = await Bus.findOne({ id: busId });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    if (!bus.boardingPoints.includes(boardingPoint)) {
      return res.status(400).json({ message: "Invalid boarding point selected." });
    }
    if (!bus.droppingPoints.includes(droppingPoint)) {
      return res.status(400).json({ message: "Invalid dropping point selected." });
    }

    const confirmedBookings = await Booking.find({
      busId,
      travelDate,
      status: "Confirmed"
    }).lean();

    const bookedSeatSet = new Set(confirmedBookings.flatMap((booking) => booking.selectedSeats));

    const unavailableSeats = selectedSeats.filter((seatNumber) => {
      const seat = bus.seats.find((item) => item.seatNumber === seatNumber);
      return !seat || bookedSeatSet.has(seatNumber);
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: "One or more selected seats are unavailable",
        unavailableSeats
      });
    }

    const totalPrice = selectedSeats.length * bus.price;
    let bookingCode = createBookingCode();

    while (await Booking.exists({ bookingCode })) {
      bookingCode = createBookingCode();
    }

    const booking = await Booking.create({
      bookingCode,
      busId,
      travelDate,
      operatorName: bus.operatorName,
      busName: bus.operatorName,
      route: `${bus.departureCity} -> ${bus.arrivalCity}`,
      boardingPoint,
      droppingPoint,
      selectedSeats,
      passengerDetails,
      paymentMethod: paymentMethod || "UPI",
      totalPrice,
      status: "Confirmed",
      bookedAt: new Date()
    });

    res.status(201).json({
      message: "Booking successful",
      booking: booking.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
});

router.patch("/:bookingId/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled." });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking: booking.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

module.exports = router;
