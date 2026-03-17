import { BookingDraft } from "../types";

const BOOKING_DRAFT_KEY = "bus-booking-draft";

export const loadBookingDraft = (): BookingDraft | null => {
  try {
    const raw = window.sessionStorage.getItem(BOOKING_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BookingDraft;
  } catch (error) {
    console.error("Failed to load booking draft", error);
    return null;
  }
};

export const saveBookingDraft = (draft: BookingDraft) => {
  window.sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
};

export const clearBookingDraft = () => {
  window.sessionStorage.removeItem(BOOKING_DRAFT_KEY);
};
