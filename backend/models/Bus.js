const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema(
  {
    seatNumber: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    row: { type: Number, required: true },
    column: { type: Number, required: true }
  },
  { _id: false }
);

const BusSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    operatorName: { type: String, required: true },
    rating: { type: Number, required: true },
    departureCity: { type: String, required: true, index: true },
    arrivalCity: { type: String, required: true, index: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seatType: { type: String, enum: ["Seater", "Sleeper"], required: true },
    isAC: { type: Boolean, required: true },
    boardingPoints: { type: [String], default: [] },
    droppingPoints: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    seats: { type: [SeatSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", BusSchema);
