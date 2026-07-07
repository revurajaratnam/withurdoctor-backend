

const doctorOnly = (req, res, next) => {
  const userRole = req.users?.role; 

  if (userRole !== "doctor") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only doctors can perform this action.",
    });
  }

    next();
    };

    module.exports = { doctorOnly };