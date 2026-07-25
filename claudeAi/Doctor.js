const mongoose = require("mongoose");

const daySlotConfigSchema = new mongoose.Schema(
  {
    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    slotDurationMinutes: {
      type: Number,
      default: 30,
      min: 5,
    },
  },
  {
    _id: false,
  }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    consultation: {
      type: Number,
      default: 0,
    },

    specialization: String,
    experience: String,
    gender: String,

    // 0 = Sunday, 1 = Monday ... 6 = Saturday
    weeklySchedule: {
      type: Map,
      of: [daySlotConfigSchema],
      default: {},
    },

    unavailableDates: {
      type: [String],
      default: [],
    },

    // Keep your remaining existing fields here:
    about: String,
    address: String,
    qualification: String,
    languages: String,
    profilephoto: String,
    gallery: [String],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.DrProfialInfoData ||
  mongoose.model("DrProfialInfoData", doctorProfileSchema);