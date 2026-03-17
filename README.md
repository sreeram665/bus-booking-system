# 🚌 Bus Booking System

A full-stack **Bus Booking Web Application** built with modern technologies like React, Node.js, and MongoDB.
This project simulates real-world platforms like RedBus and AbhiBus with features like seat selection, booking, filtering, and passenger management.

---

## 🚀 Features

### 🔍 Bus Search & Filtering

* Search buses by **departure & arrival cities**
* Filter by:

  * AC / Non-AC
  * Seat type (Seater / Sleeper)
  * Price range
  * Ratings

### 🚌 Bus Listings

* View multiple buses per route
* Displays:

  * Operator name (KSRTC, VRL, etc.)
  * Departure & arrival time
  * Travel duration
  * Ratings ⭐
  * Amenities (WiFi, Charging, etc.)

### 💺 Seat Selection

* Realistic **2+2 bus layout with aisle**
* Seat status:

  * 🟢 Available
  * 🔵 Selected
  * ⚫ Booked
* Max **4 seats per booking**

### 👤 Passenger Details

* Dynamic form based on selected seats
* Fields:

  * Name
  * Age
  * Gender

### 📋 Booking System

* Booking confirmation with:

  * Booking ID
  * Seat numbers
  * Passenger details
  * Total price

### 📜 Booking History

* View all previous bookings

### ❌ Cancel Booking

* Cancel tickets and restore seat availability

---

## 🛠 Tech Stack

### Frontend

* ⚛️ React (TypeScript)
* 🔀 React Router
* 🌐 Axios
* 🎨 Tailwind CSS

### Backend

* 🟢 Node.js
* 🚀 Express.js
* 🍃 MongoDB (Mongoose)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/bus-booking-system.git
cd bus-booking-system
```

---

### 2️⃣ Backend Setup

Create `.env` file inside `backend/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bus-booking-system
PORT=5000
```

Run backend:

```bash
cd backend
npm install
node server.js
```

✔️ On first run:

* Sample buses and bookings are automatically seeded.

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🌐 Application URLs

* Frontend → http://localhost:3000
* Backend → http://localhost:5000

---

## 🔗 API Endpoints

### 🚌 Buses

* `GET /api/buses`
* `GET /api/buses/:busId`

### 🎟 Bookings

* `GET /api/bookings`
* `POST /api/bookings`

---

## 📦 Deployment

You can deploy this project using:

* **Frontend:** Vercel / Netlify
* **Backend:** Render / Koyeb
* **Database:** MongoDB Atlas

---

## 🎯 Future Improvements

* 🔐 User Authentication (Login/Signup)
* 💳 Payment Integration (Razorpay / Stripe)
* 📧 Email Ticket Confirmation
* 📱 Mobile Responsive Enhancements
* 🎟 QR Code Tickets

---
Contributions are welcome!
Feel free to fork the repo and submit a pull request.
