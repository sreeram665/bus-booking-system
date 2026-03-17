export type Seat = {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
};

export type Bus = {
  id: string;
  operatorName: string;
  rating: number;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatType: "Seater" | "Sleeper";
  isAC: boolean;
  boardingPoints: string[];
  droppingPoints: string[];
  amenities: string[];
  seats: Seat[];
};

export type PassengerDetail = {
  seatNumber: number;
  name: string;
  age: number;
  gender: string;
};

export type SavedPassengerProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
};

export type BookingDraft = {
  busId: string;
  bus: Bus;
  travelDate: string;
  selectedSeats: number[];
  boardingPoint: string;
  droppingPoint: string;
  totalPrice: number;
  passengerDetails: PassengerDetail[];
};

export type BookingRecord = {
  _id: string;
  bookingCode: string;
  busId: string;
  travelDate: string;
  operatorName: string;
  busName: string;
  route: string;
  boardingPoint: string;
  droppingPoint: string;
  selectedSeats: number[];
  passengerDetails: PassengerDetail[];
  paymentMethod: string;
  totalPrice: number;
  status: "Confirmed" | "Cancelled";
  bookedAt: string;
};
