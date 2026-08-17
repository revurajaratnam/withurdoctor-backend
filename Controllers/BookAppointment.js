const transporter = require("../utils/Mailer");

const wuDr_Mail = process.env.EMAIL;

const bookApp = async (req, res) => {
  console.log("========== APPOINTMENT START ==========");
  console.log("Request body:", req.body);
  console.log("Logged-in user:", req.user);

  try {
    // ================================
    // PATIENT DETAILS
    // ================================
    const patientEmail =
      req.user?.email ||
      req.body?.patientEmail;

    const patientName =
      req.user?.name ||
      req.user?.fullname ||
      req.body?.patientName ||
      "Patient";

    // ================================
    // DOCTOR DETAILS
    // ================================
    const doctorName = req.body?.doctorName;
    const doctorEmail = req.body?.doctorEmail;

    // ================================
    // APPOINTMENT DETAILS
    // ================================
    const appointmentDate =
      req.body?.appointmentDate;

    const appointmentTime =
      req.body?.timeSlot;

    // ================================
    // VALIDATION
    // ================================
    if (!patientEmail) {
      return res.status(400).json({
        success: false,
        message: "Patient email is missing",
      });
    }

    if (!doctorName) {
      return res.status(400).json({
        success: false,
        message: "Doctor name is missing",
      });
    }

    if (!doctorEmail) {
      return res.status(400).json({
        success: false,
        message: "Doctor email is missing",
      });
    }

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Appointment date or time is missing",
      });
    }

    console.log("Patient email:", patientEmail);
    console.log("Patient name:", patientName);
    console.log("Doctor email:", doctorEmail);
    console.log("Doctor name:", doctorName);

    // ==========================================
    // SEND EMAIL TO PATIENT
    // ==========================================

    console.log("Sending email to patient...");

    let patientMail;

    try {
      patientMail = await transporter.sendMail({
        from: `"WithUrDoctor" <${wuDr_Mail}>`,
        to: patientEmail,
        subject: `Appointment Confirmed with Dr. ${doctorName}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Your Appointment is Confirmed</h2>

            <p>Hello ${patientName},</p>

            <p>Your appointment has been successfully booked.</p>

            <h3>Appointment Details</h3>

            <p>
              <strong>Doctor:</strong>
              Dr. ${doctorName}
            </p>

            <p>
              <strong>Date:</strong>
              ${appointmentDate}
            </p>

            <p>
              <strong>Time:</strong>
              ${appointmentTime}
            </p>

            <p>
              Please arrive 30 minutes early.
            </p>

            <br />

            <p>
              Regards,<br />
              <strong>Team WithUrDoctor</strong>
            </p>
          </div>
        `,
      });

      console.log(
        "Patient email sent:",
        patientMail.messageId
      );

    } catch (mailError) {
      console.error(
        "PATIENT EMAIL FAILED:",
        mailError.message
      );

      // Continue to doctor email instead of immediately crashing
    }

    // ==========================================
    // SEND EMAIL TO DOCTOR
    // ==========================================

    console.log("Sending email to doctor...");

    let doctorMail;

    try {
      doctorMail = await transporter.sendMail({
        from: `"WithUrDoctor" <${wuDr_Mail}>`,
        to: doctorEmail,
        subject: `New Appointment - ${patientName}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>New Appointment Scheduled</h2>

            <p>Hello Dr. ${doctorName},</p>

            <p>A new appointment has been scheduled.</p>

            <h3>Patient Details</h3>

            <p>
              <strong>Patient Name:</strong>
              ${patientName}
            </p>

            <p>
              <strong>Patient Email:</strong>
              ${patientEmail}
            </p>

            <h3>Appointment Details</h3>

            <p>
              <strong>Date:</strong>
              ${appointmentDate}
            </p>

            <p>
              <strong>Time:</strong>
              ${appointmentTime}
            </p>

            <br />

            <p>
              <strong>Team WithUrDoctor</strong>
            </p>
          </div>
        `,
      });

      console.log(
        "Doctor email sent:",
        doctorMail.messageId
      );

    } catch (mailError) {
      console.error(
        "DOCTOR EMAIL FAILED:",
        mailError.message
      );
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    console.log("========== APPOINTMENT COMPLETE ==========");

    return res.status(200).json({
      success: true,
      message: "Your appointment was booked successfully",
      patientEmailSent: !!patientMail,
      doctorEmailSent: !!doctorMail,
    });

  } catch (error) {
    console.error("========== APPOINTMENT ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);

    return res.status(500).json({
      success: false,
      message: "Appointment booking failed",
      error: error.message,
    });
  }
};

module.exports = bookApp;