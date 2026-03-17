const mongoose = require("mongoose");

const PassengerDetailSchema = new mongoose.Schema(
  {
    seatNumber: { type: Number, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true, index: true },
    busId: { type: String, required: true, index: true },
    travelDate: { type: String, required: true, index: true },
    operatorName: { type: String, required: true },
    busName: { type: String, required: true },
    route: { type: String, required: true },
    boardingPoint: { type: String, required: true },
    droppingPoint: { type: String, required: true },
    selectedSeats: { type: [Number], required: true },
    passengerDetails: { type: [PassengerDetailSchema], required: true },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Confirmed", "Cancelled"], default: "Confirmed" }
  },
  { timestamps: { createdAt: "bookedAt", updatedAt: false } }
);

module.exports = mongoose.model("Booking", BookingSchema);
