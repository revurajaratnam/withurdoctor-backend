const TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET = "+05:30";

const WEEKDAY_MAP = {
  Sun: "0",
  Mon: "1",
  Tue: "2",
  Wed: "3",
  Thu: "4",
  Fri: "5",
  Sat: "6",
};

function validateDateKey(dateString) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

function parseDateOnly(dateString) {
  if (!validateDateKey(dateString)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }

  return new Date(`${dateString}T00:00:00${IST_OFFSET}`);
}

function toDateKey(dateObject) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObject);
}

function getWeekdayKey(dateObject) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(dateObject);

  return WEEKDAY_MAP[weekday];
}

function addDays(dateKey, numberOfDays) {
  const date = parseDateOnly(dateKey);

  const newDate = new Date(
    date.getTime() + numberOfDays * 24 * 60 * 60 * 1000
  );

  return toDateKey(newDate);
}

function generateSlotsForDate(dateObject, dayConfigs = []) {
  const slots = [];
  const dateKey = toDateKey(dateObject);

  if (!Array.isArray(dayConfigs)) {
    return slots;
  }

  dayConfigs.forEach((config) => {
    const {
      startTime,
      endTime,
      slotDurationMinutes = 30,
    } = config;

    if (!startTime || !endTime || slotDurationMinutes <= 0) {
      return;
    }

    let cursor = new Date(
      `${dateKey}T${startTime}:00${IST_OFFSET}`
    );

    const end = new Date(
      `${dateKey}T${endTime}:00${IST_OFFSET}`
    );

    while (cursor < end) {
      slots.push({
        time: new Date(cursor),

        label: cursor.toLocaleTimeString("en-IN", {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });

      cursor = new Date(
        cursor.getTime() + slotDurationMinutes * 60 * 1000
      );
    }
  });

  return slots;
}

module.exports = {
  generateSlotsForDate,
  parseDateOnly,
  toDateKey,
  getWeekdayKey,
  addDays,
  validateDateKey,
};