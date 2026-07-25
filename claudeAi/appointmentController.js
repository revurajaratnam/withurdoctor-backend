const mongoose = require("mongoose");

// Import your existing doctor profile model.
// Change this path only when your file is in another folder.
const DoctorProfile = require("../model/DrProfileInfo.js");

const Appointment = require("../claudeAi/Appointment");

const {
  generateSlotsForDate,
  parseDateOnly,
  toDateKey,
  getWeekdayKey,
  addDays,
  validateDateKey,
} = require("../claudeAi/slotGenerator");

const TIME_ZONE = "Asia/Kolkata";

function getDaySchedule(doctor, weekday) {
  if (!doctor.weeklySchedule) {
    return [];
  }

  // Mongoose Map
  if (typeof doctor.weeklySchedule.get === "function") {
    return doctor.weeklySchedule.get(String(weekday)) || [];
  }

  // Normal JavaScript object
  return doctor.weeklySchedule[String(weekday)] || [];
}

function isDoctorUnavailable(doctor, dateKey) {
  return (
    Array.isArray(doctor.unavailableDates) &&
    doctor.unavailableDates.includes(dateKey)
  );
}

async function findDoctor(doctorId) {
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return null;
  }

  return DoctorProfile.findById(doctorId);
}

// GET /api/doctors/:doctorId/fee
async function getDoctorFee(req, res) {
  try {
    const doctor = await findDoctor(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,

      doctor: {
        id: doctor._id,
        name: doctor.fullname,
        fee: Number(doctor.consultation || 0),
      },
    });
  } catch (error) {
    console.error("getDoctorFee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load doctor fee",
    });
  }
}

// GET /api/doctors/:doctorId/availability?days=20
async function getAvailabilitySummary(req, res) {
  try {
    const doctor = await findDoctor(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const requestedDays = Number.parseInt(req.query.days, 10) || 20;
    const days = Math.min(Math.max(requestedDays, 1), 60);

    const todayKey = toDateKey(new Date());
    const rangeEndKey = addDays(todayKey, days);

    const rangeStart = parseDateOnly(todayKey);
    const rangeEnd = parseDateOnly(rangeEndKey);

    const bookedCounts = await Appointment.aggregate([
      {
        $match: {
          doctorId: doctor._id,
          status: "booked",

          slotTime: {
            $gte: rangeStart,
            $lt: rangeEnd,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$slotTime",
              timezone: TIME_ZONE,
            },
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const bookedByDate = Object.fromEntries(
      bookedCounts.map((item) => [
        item._id,
        item.count,
      ])
    );

    const now = new Date();
    const availability = [];

    for (let index = 0; index < days; index += 1) {
      const dateKey = addDays(todayKey, index);
      const dateObject = parseDateOnly(dateKey);
      const weekday = getWeekdayKey(dateObject);

      if (isDoctorUnavailable(doctor, dateKey)) {
        availability.push({
          date: dateKey,
          slotCount: 0,
        });

        continue;
      }

      const daySchedule = getDaySchedule(doctor, weekday);

      const generatedSlots = generateSlotsForDate(
        dateObject,
        daySchedule
      );

      // Remove times that already passed today.
      const futureSlots = generatedSlots.filter(
        (slot) => slot.time > now
      );

      const bookedCount = bookedByDate[dateKey] || 0;

      availability.push({
        date: dateKey,

        slotCount: Math.max(
          futureSlots.length - bookedCount,
          0
        ),
      });
    }

    return res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("getAvailabilitySummary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load availability",
    });
  }
}

// GET /api/doctors/:doctorId/slots?date=YYYY-MM-DD
async function getSlotsForDate(req, res) {
  try {
    const { date } = req.query;

    if (!date || !validateDateKey(date)) {
      return res.status(400).json({
        success: false,
        message: "Valid date query is required: YYYY-MM-DD",
      });
    }

    const doctor = await findDoctor(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const dateObject = parseDateOnly(date);
    const weekday = getWeekdayKey(dateObject);

    const daySchedule = getDaySchedule(doctor, weekday);

    if (
      isDoctorUnavailable(doctor, date) ||
      daySchedule.length === 0
    ) {
      return res.status(200).json({
        success: true,
        slots: [],
      });
    }

    const generatedSlots = generateSlotsForDate(
      dateObject,
      daySchedule
    );

    const nextDate = parseDateOnly(addDays(date, 1));

    const bookedAppointments = await Appointment.find({
      doctorId: doctor._id,
      status: "booked",

      slotTime: {
        $gte: dateObject,
        $lt: nextDate,
      },
    })
      .select("slotTime")
      .lean();

    const bookedTimes = new Set(
      bookedAppointments.map((appointment) =>
        new Date(appointment.slotTime).getTime()
      )
    );

    const now = new Date();

    const slots = generatedSlots
      .filter((slot) => slot.time > now)
      .map((slot) => ({
        time: slot.time.toISOString(),
        label: slot.label,
        isBooked: bookedTimes.has(slot.time.getTime()),
      }));

    return res.status(200).json({
      success: true,
      date,
      slots,
    });
  } catch (error) {
    console.error("getSlotsForDate error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load slots",
    });
  }
}

// POST /api/appointments
async function createAppointment(req, res) {
  try {
    const {
      doctorId,
      patientId,
      slotTime,
    } = req.body;

    if (!doctorId || !patientId || !slotTime) {
      return res.status(400).json({
        success: false,
        message:
          "doctorId, patientId and slotTime are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const doctor = await findDoctor(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const selectedSlot = new Date(slotTime);

    if (Number.isNaN(selectedSlot.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid slot time",
      });
    }

    if (selectedSlot <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book a slot in the past",
      });
    }

    const dateKey = toDateKey(selectedSlot);
    const weekday = getWeekdayKey(selectedSlot);

    if (isDoctorUnavailable(doctor, dateKey)) {
      return res.status(400).json({
        success: false,
        message: "Doctor is unavailable on this date",
      });
    }

    const daySchedule = getDaySchedule(doctor, weekday);

    const validSlots = generateSlotsForDate(
      parseDateOnly(dateKey),
      daySchedule
    );

    const isValidSlot = validSlots.some(
      (slot) =>
        slot.time.getTime() === selectedSlot.getTime()
    );

    if (!isValidSlot) {
      return res.status(400).json({
        success: false,
        message: "This is not a valid doctor slot",
      });
    }

    const appointment = await Appointment.create({
      doctorId: doctor._id,
      patientId,
      slotTime: selectedSlot,
      status: "booked",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("createAppointment error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This slot was just booked by another patient",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
}

// PATCH /api/appointments/:id/cancel
async function cancelAppointment(req, res) {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment =
      await Appointment.findOneAndUpdate(
        {
          _id: req.params.id,
          status: "booked",
        },

        {
          status: "cancelled",
        },

        {
          new: true,
        }
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Active appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("cancelAppointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Cancellation failed",
    });
  }
}

module.exports = {
  getDoctorFee,
  getAvailabilitySummary,
  getSlotsForDate,
  createAppointment,
  cancelAppointment,
};