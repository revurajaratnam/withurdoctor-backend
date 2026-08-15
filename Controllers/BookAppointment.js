const transporter = require("../utils/Mailer");

const wuDr_Mail = process.env.EMAIL;

const bookApp = async (req, res) => {
  console.log("========== APPOINTMENT START ==========");
  console.log("Request body:", req.body);
  console.log("Logged-in user:", req.user);

  try {
    const patientEmail = req.user?.email;
    const patientName = req.user?.name;

    const doctorName = req.body?.doctorName;
    const doctorEmail = req.body?.doctorEmail;

    const appointmentDate = req.body?.appointmentDate;
    const appointmentTime = req.body?.timeSlot;

    console.log("Patient email:", patientEmail);
    console.log("Doctor email:", doctorEmail);
    console.log("Sending email to patient...");

    // EMAIL TO PATIENT
    const patientMail = await transporter.sendMail({
      from: wuDr_Mail,
      to: patientEmail,
      subject: `Confirmed: Your Appointment with Dr ${doctorName}`,
      html: `
        <h2>Your appointment is confirmed.</h2>
        <h3>Dr. ${doctorName}</h3>

        <p>Appointment date: ${appointmentDate}</p>
        <p>Appointment time: ${appointmentTime}</p>

        <p>Note: Please arrive 30 minutes early.</p>

        <p>Team WithUrDoctor</p>

        <a href="https://withurdoctor.vercel.app/Login">
          Book Again
        </a>
      `,
    });

    console.log(
      "Patient email sent successfully:",
      patientMail.messageId
    );

    console.log("Sending email to doctor...");

    // EMAIL TO DOCTOR
    const doctorMail = await transporter.sendMail({
      from: wuDr_Mail,
      to: doctorEmail,
      subject: `New Appointment Scheduled with ${patientName}`,
      html: `
        <h2>Dear Dr. ${doctorName},</h2>

        <p>A new appointment has been scheduled.</p>

        <h3>Appointment Details</h3>

        <p>Patient Name: ${patientName}</p>
        <p>Date: ${appointmentDate}</p>
        <p>Time: ${appointmentTime}</p>

        <p>Team WithUrDoctor</p>
      `,
    });

    console.log(
      "Doctor email sent successfully:",
      doctorMail.messageId
    );

    console.log("========== APPOINTMENT COMPLETE ==========");

    return res.status(200).json({
      success: true,
      message: "Your appointment was booked successfully",
    });

  } catch (error) {
    console.error("========== EMAIL ERROR ==========");
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