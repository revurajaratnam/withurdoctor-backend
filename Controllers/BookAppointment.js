const transporter = require("../utils/Mailer");

const wuDr_Mail = process.env.EMAIL_FROM;

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

    const doctorName =
      req.body?.doctorName;

    const doctorEmail =
      req.body?.doctorEmail;


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


    // ================================
    // EMAIL STATUS
    // ================================

    let patientEmailSent = false;
    let doctorEmailSent = false;

    let patientEmailError = null;
    let doctorEmailError = null;


    // ==========================================
    // SEND EMAIL TO PATIENT
    // ==========================================

    console.log("Sending email to patient...");

    try {
      const patientMail =
        await transporter.emails.send({

          from: wuDr_Mail,

          to: patientEmail,

          subject:
            `Appointment Confirmed with Dr. ${doctorName}`,

          html: `
            <div style="font-family: Arial, sans-serif;">

              <h2>
                Your Appointment is Confirmed
              </h2>

              <p>
                Hello ${patientName},
              </p>

              <p>
                Your appointment has been successfully booked.
              </p>

              <h3>
                Appointment Details
              </h3>

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

                <strong>
                  Team WithUrDoctor
                </strong>
              </p>

            </div>
          `,
        });


      console.log(
        "Patient Resend response:",
        patientMail
      );


      if (patientMail?.data?.id) {
        patientEmailSent = true;
      }


      if (patientMail?.error) {
        patientEmailError =
          patientMail.error.message;

        console.error(
          "PATIENT EMAIL FAILED:",
          patientMail.error
        );
      }

    } catch (mailError) {

      patientEmailError =
        mailError.message;

      console.error(
        "PATIENT EMAIL FAILED:",
        mailError
      );
    }


    // ==========================================
    // SEND EMAIL TO DOCTOR
    // ==========================================

    console.log("Sending email to doctor...");

    try {
      const doctorMail =
        await transporter.emails.send({

          from: wuDr_Mail,

          to: doctorEmail,

          subject:
            `New Appointment - ${patientName}`,

          html: `
            <div style="font-family: Arial, sans-serif;">

              <h2>
                New Appointment Scheduled
              </h2>

              <p>
                Hello Dr. ${doctorName},
              </p>

              <p>
                A new appointment has been scheduled.
              </p>

              <h3>
                Patient Details
              </h3>

              <p>
                <strong>Patient Name:</strong>
                ${patientName}
              </p>

              <p>
                <strong>Patient Email:</strong>
                ${patientEmail}
              </p>

              <h3>
                Appointment Details
              </h3>

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
                <strong>
                  Team WithUrDoctor
                </strong>
              </p>

            </div>
          `,
        });


      console.log(
        "Doctor Resend response:",
        doctorMail
      );


      if (doctorMail?.data?.id) {
        doctorEmailSent = true;
      }


      if (doctorMail?.error) {
        doctorEmailError =
          doctorMail.error.message;

        console.error(
          "DOCTOR EMAIL FAILED:",
          doctorMail.error
        );
      }

    } catch (mailError) {

      doctorEmailError =
        mailError.message;

      console.error(
        "DOCTOR EMAIL FAILED:",
        mailError
      );
    }


    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    console.log(
      "========== APPOINTMENT COMPLETE =========="
    );

    return res.status(200).json({
      success: true,

      message:
        "Your appointment was booked successfully",

      patientEmailSent,

      doctorEmailSent,

      patientEmailError,

      doctorEmailError,
    });

  } catch (error) {

    console.error(
      "========== APPOINTMENT ERROR =========="
    );

    console.error(error);

    console.error(
      "Message:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Appointment booking failed",

      error: error.message,
    });
  }
};

module.exports = bookApp;