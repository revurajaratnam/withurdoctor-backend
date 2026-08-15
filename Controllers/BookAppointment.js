const transporter = require("../utils/Mailer")

    const wuDr_Mail = process.env.User_name;
const bookApp= async (req,res)=>{
    console.log(req.body);
    console.log(req.user)

    try {
        await transporter.verify();
        console.log("OTP Successfully..!")
        // console.log(req.body);
        const patientEmail = req.user?.email;
        const patientName = req.user?.name;
        const patientRole = req.user?.role;
        const doctorName = req.body?.doctorName;
        const doctorEmail = req.body?.doctorEmail;
        const appointmentDate = req.body?.appointmentDate
        const appointmentTime = req.body?.timeSlot;
        console.log(patientEmail);
        console.log(doctorName);
        console.log(patientRole);
        
        await transporter.sendMail({
            from:wuDr_Mail,
            to:patientEmail,
            subject:`Confirmed: Your Appointment with Dr ${doctorName}`,
            html:
            `
            <h2> Your appointment is confirmed. </h2>
             <h3> Dr. ${doctorName} </h3>
             <p>Appointment date ${appointmentDate} </p>
             <p>Appointment time ${appointmentTime} </p> <br>
             <p> Note: Please arrive 30 minutes early. </p>

             <h5> team <h5>
             <p>WithUrDoctor </p>

             <a href="http://localhost:5173/Login" ><button style="color: white; background: #199FD9; border-radius: 10px; border:none; padding:10px
             ">Book Agian </button> </a>
             `
             
        })
        await transporter.sendMail({
            from:wuDr_Mail,
            to:doctorEmail,
            subject:`New Appointment Scheduled with ${patientName}`,
            html:
            `
            <h2> Dear Dr. ${doctorName} , </h2>
            <p>This email is to notify you that a new appointment has been scheduled on youre calender. </p>
            <h2>Appointment Details </h2>
            <h4> Patient Name : ${patientName} </h4>
            <h4> Date : ${appointmentDate} </h4>
            <h4> Time ${appointmentTime} </h4>


            <h2> team </h2>
            <h3> WithUrDoctor </h3>

            <a href="http://localhost:5173/Login" ><button style="color: white; background: #199FD9; border-radius: 10px; border:none; padding:10px
             ">Book Agian </button> </a>

            `
            
        })
        res.json({
            message:"Youre Appointment Booked Successfuly"
        })

    } catch (error) {
        console.log(error);
    }
    
}

module.exports= bookApp;