const multer = require("multer");
const path = require("path");

// const upload = multer({dest: "uploads/"})
const storage = multer.diskStorage({
    destination: (req , file , cb) => {
        cb(null , "./uploads");

    },
    filename: (res,file,cd) => {
        const uniqueSuffix = Date.now() +"-"+
        Math.round(Math.random()*1e9);
        cd(null, uniqueSuffix + "-" + file.originalname)
    }
});

const upload = multer({storage});
module.exports = upload;