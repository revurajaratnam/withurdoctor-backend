const express = require("express");
const cors = require("cors")
const {Route} = require("./Routes/UserDataRoutes")
const bodyParser = require("body-parser")
require("dotenv").config()
const dbconnect = require('./Db/dBConnect')
const PORT = process.env.PORT || 3500;
const app=(express());
const path = require("path");



app.use(express.json())
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
// app.use(express.static);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(cors({
//     origin: [
//         "http://localhost:5173",
//         "https://rigor-astute-buddhist.ngrok-free.dev"
//     ],
//     credentials: true
// }));



// app.post("/signup",uploads.none(),(req,res) =>{
//     console.log(req.body);
//     console.log(req.headers["content-type"]);
//     console.log("Rqst recevied");
//     res.json(
        
//        { success : true,
//         message:"i will add please wait"}
//     )
// })
app.use(Route)
// app.use("/api",AppointmentRoutes)

app.listen(PORT,() =>{
        console.log(`Server Running on ${PORT}`);
    }
)
   
