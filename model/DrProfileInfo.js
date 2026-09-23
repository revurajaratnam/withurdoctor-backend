const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema({
  fullname: String,
  consultation: Number,
  specialization: String,
  address: String,
  experience: String,
  gender: String,

  weeklySchedule: {
    type: Map,
    of: [
      {
        startTime: String,
        endTime: String,
        slotDurationMinutes: {
          type: Number,
          default: 30,
        },
      },
    ],
    default: {},
  },

  unavailableDates: {
    type: [String],
    default: [],
  },
});

const DrProfialInfoData =
  mongoose.models.DrProfialInfoData ||
  mongoose.model(
    "DrProfialInfoData",
    doctorProfileSchema,
    "drprofialinfodatas"
  );

module.exports = DrProfialInfoData;