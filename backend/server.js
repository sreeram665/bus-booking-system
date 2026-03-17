require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Bus = require("./models/Bus");
const Booking = require("./models/Booking");
const busRoutes = require("./routes/buses");
const bookingRoutes = require("./routes/bookings");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bus Booking API is running" });
});

app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

const seedDataIfNeeded = async () => {
  const busesPath = path.join(__dirname, "data", "buses.json");
  const rawBuses = JSON.parse(await fs.readFile(busesPath, "utf-8"));

  for (const rawBus of rawBuses) {
    const existingBus = await Bus.findOne({ id: rawBus.id });

    if (!existingBus) {
      await Bus.create(rawBus);
      continue;
    }

    existingBus.operatorName = rawBus.operatorName;
    existingBus.rating = rawBus.rating;
    existingBus.departureCity = rawBus.departureCity;
    existingBus.arrivalCity = rawBus.arrivalCity;
    existingBus.departureTime = rawBus.departureTime;
    existingBus.arrivalTime = rawBus.arrivalTime;
    existingBus.price = rawBus.price;
    existingBus.seatType = rawBus.seatType;
    existingBus.isAC = rawBus.isAC;
    existingBus.boardingPoints = rawBus.boardingPoints || [];
    existingBus.droppingPoints = rawBus.droppingPoints || [];
    existingBus.amenities = rawBus.amenities || [];
    existingBus.seats = rawBus.seats;

    await existingBus.save();
  }

  const bookingCount = await Booking.countDocuments();
  if (bookingCount === 0) {
    const bookingsPath = path.join(__dirname, "data", "bookings.json");
    const rawBookings = JSON.parse(await fs.readFile(bookingsPath, "utf-8"));
    const bookings = (Array.isArray(rawBookings) ? rawBookings : rawBookings ? [rawBookings] : []).map((booking, index) => ({
      bookingCode: booking.bookingCode || booking.id || `BUS${100000 + index}`,
      busId: booking.busId,
      travelDate: booking.travelDate || String(new Date(booking.bookedAt || new Date()).toISOString().slice(0, 10)),
      operatorName: booking.operatorName || booking.busName || "Bus Operator",
      busName: booking.busName || booking.operatorName || "Bus Operator",
      route: booking.route,
      boardingPoint: booking.boardingPoint || "Main Boarding Point",
      droppingPoint: booking.droppingPoint || "Main Dropping Point",
      selectedSeats: booking.selectedSeats || [],
      passengerDetails: booking.passengerDetails || [],
      paymentMethod: booking.paymentMethod || "UPI",
      totalPrice: booking.totalPrice || 0,
      status: booking.status || "Confirmed",
      bookedAt: booking.bookedAt || new Date()
    }));
    if (bookings.length > 0) {
      await Booking.insertMany(bookings);
    }
    return;
  }

  const existingBookings = await Booking.find({});

  for (let index = 0; index < existingBookings.length; index += 1) {
    const booking = existingBookings[index];
    let changed = false;

    if (!booking.bookingCode) {
      booking.bookingCode = `BUS${100000 + index}`;
      changed = true;
    }
    if (!booking.operatorName && booking.busName) {
      booking.operatorName = booking.busName;
      changed = true;
    }
    if (!booking.travelDate) {
      booking.travelDate = String(new Date(booking.bookedAt || new Date()).toISOString().slice(0, 10));
      changed = true;
    }
    if (!booking.boardingPoint) {
      booking.boardingPoint = "Main Boarding Point";
      changed = true;
    }
    if (!booking.droppingPoint) {
      booking.droppingPoint = "Main Dropping Point";
      changed = true;
    }
    if (!booking.status) {
      booking.status = "Confirmed";
      changed = true;
    }

    if (changed) {
      await booking.save();
    }
  }
};

const startServer = async () => {
  await connectDB();
  await seedDataIfNeeded();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
