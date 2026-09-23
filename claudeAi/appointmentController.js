const getDoctorFee = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Doctor fee lookup is not implemented yet.',
  });
};

const getAvailabilitySummary = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Availability summary is not implemented yet.',
  });
};

const getSlotsForDate = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Slot lookup is not implemented yet.',
  });
};

const createAppointment = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Appointment creation is not implemented yet.',
  });
};

const cancelAppointment = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Appointment cancellation is not implemented yet.',
  });
};

module.exports = {
  getDoctorFee,
  getAvailabilitySummary,
  getSlotsForDate,
  createAppointment,
  cancelAppointment,
};
