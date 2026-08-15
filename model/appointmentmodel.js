const moongose = require("mongoose");

const appointment = new moongose.Schema({
    doctorId :String,
    bookedFor : String,
    patientName :String,
    patientMobile :String,
    appointmentDate : String,
    timeSlot:String
});

const bookingAppointment = moongose.model("BookingAppointment",appointment);
module.exports = bookingAppointment;