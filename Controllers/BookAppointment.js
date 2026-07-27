const BookingAppointment = require("../model/appointmentmodel");
const transporter = require("../utils/Mailer");

const wuDrMail = process.env.User_name;

const bookApp = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Logged-in user:", req.user);

    const {
      doctorId,
      bookedFor,
      patientName,
      patientMobile,
      appointmentDate,
      timeSlot,
      doctorName,
      doctorEmail,
    } = req.body;

    // 1. Validate required fields
    if (
      !doctorId ||
      !bookedFor ||
      !patientName ||
      !patientMobile ||
      !appointmentDate ||
      !timeSlot
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required appointment details.",
      });
    }

    // 2. Check whether this doctor's slot is already booked
    const existingBooking = await BookingAppointment.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment slot is already booked. Please select another time.",
      });
    }

    // 3. Create the booking only after checking availability
    const savedBooking = await BookingAppointment.create({
      doctorId,
      patientId: req.user?.id || req.user?._id,
      bookedFor,
      patientName,
      patientMobile,
      appointmentDate,
      timeSlot,
      status: "confirmed",
    });

    // 4. Email information
    const patientEmail = req.user?.email;
    const loggedInPatientName =
      req.user?.fullname || req.user?.name || patientName;

    const emailPromises = [];

    // Send confirmation email to patient
    if (patientEmail) {
      emailPromises.push(
        transporter.sendMail({
          from: `"WithUrDoctor" <${wuDrMail}>`,
          to: patientEmail,
          subject: `Confirmed: Your Appointment with Dr. ${
            doctorName || "Doctor"
          }`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #199fd9;">
                Your appointment is confirmed
              </h2>

              <p>Hello ${loggedInPatientName},</p>

              <p>
                Your appointment with
                <strong>Dr. ${doctorName || "Doctor"}</strong>
                has been successfully booked.
              </p>

              <div style="
                background-color: #f4f8fa;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
              ">
                <p>
                  <strong>Date:</strong> ${appointmentDate}
                </p>

                <p>
                  <strong>Time:</strong> ${timeSlot}
                </p>
              </div>

              <p>
                <strong>Note:</strong>
                Please arrive at least 30 minutes early.
              </p>

              <a
                href="http://localhost:5173/Login"
                style="
                  display: inline-block;
                  color: white;
                  background-color: #199fd9;
                  border-radius: 8px;
                  padding: 10px 18px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                View Appointment
              </a>

              <p style="margin-top: 24px;">
                Regards,<br />
                <strong>Team WithUrDoctor</strong>
              </p>
            </div>
          `,
        })
      );
    }

    // Send notification email to doctor
    if (doctorEmail) {
      emailPromises.push(
        transporter.sendMail({
          from: `"WithUrDoctor" <${wuDrMail}>`,
          to: doctorEmail,
          subject: `New Appointment Scheduled with ${patientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #199fd9;">
                New Appointment Scheduled
              </h2>

              <p>Dear Dr. ${doctorName || "Doctor"},</p>

              <p>
                A new appointment has been scheduled on your calendar.
              </p>

              <div style="
                background-color: #f4f8fa;
                padding: 16px;
                border-radius: 8px;
                margin: 16px 0;
              ">
                <p>
                  <strong>Patient:</strong> ${patientName}
                </p>

                <p>
                  <strong>Mobile:</strong> ${patientMobile}
                </p>

                <p>
                  <strong>Date:</strong> ${appointmentDate}
                </p>

                <p>
                  <strong>Time:</strong> ${timeSlot}
                </p>

                <p>
                  <strong>Booked for:</strong> ${bookedFor}
                </p>
              </div>

              <a
                href="http://localhost:5173/Login"
                style="
                  display: inline-block;
                  color: white;
                  background-color: #199fd9;
                  border-radius: 8px;
                  padding: 10px 18px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                View Appointment
              </a>

              <p style="margin-top: 24px;">
                Regards,<br />
                <strong>Team WithUrDoctor</strong>
              </p>
            </div>
          `,
        })
      );
    }

    // Email failure should not cancel an already-saved appointment
    const emailResults = await Promise.allSettled(emailPromises);

    const failedEmails = emailResults.filter(
      (result) => result.status === "rejected"
    );

    if (failedEmails.length > 0) {
      console.error(
        "Some appointment emails failed:",
        failedEmails.map((result) => result.reason)
      );
    }

    return res.status(201).json({
      success: true,
      message: "Your appointment was booked successfully.",
      emailSent:
        emailPromises.length > 0 && failedEmails.length === 0,
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Appointment booking error:", error);

    // Handle MongoDB duplicate-key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment slot has already been booked. Please select another time.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to book the appointment. Please try again.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = bookApp;