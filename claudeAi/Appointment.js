const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DrProfileInfo",
      required: true,
      index: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    slotTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  {
    doctorId: 1,
    slotTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "booked",
    },
  }
);

module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);