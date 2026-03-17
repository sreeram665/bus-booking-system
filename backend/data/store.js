const fs = require("fs/promises");
const path = require("path");

const busesFilePath = path.join(__dirname, "buses.json");
const bookingsFilePath = path.join(__dirname, "bookings.json");

const readBuses = async () => {
  const data = await fs.readFile(busesFilePath, "utf-8");
  return JSON.parse(data);
};

const writeBuses = async (buses) => {
  await fs.writeFile(busesFilePath, JSON.stringify(buses, null, 2), "utf-8");
};

const readBookings = async () => {
  const data = await fs.readFile(bookingsFilePath, "utf-8");
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
};

const writeBookings = async (bookings) => {
  await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), "utf-8");
};

module.exports = {
  readBuses,
  writeBuses,
  readBookings,
  writeBookings
};
