import patientServices from "../services/patientServices";
let postBookAppointment = async(req, res) => {
    try {
        let doctors = await patientServices.postBookAppointmentServices(req.body);
        return res.status(200).json(doctors)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postVerifyBookAppointment = async(req, res) => {
    try {
        let infor = await patientServices.postVerifyBookAppointmentServices(req.body);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllPatient = async(req, res) => {
    try {
        let infor = await patientServices.getAllPatientServices();
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllPatientByDoctorId= async(req, res) => {
    try {
        let infor = await patientServices.getAllPatientByDoctorIdServices(req.query.doctorId);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllPatientBooking= async(req, res) => {
    try {
        let infor = await patientServices.getAllPatientBookingServices();
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


module.exports = {
   
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllPatient: getAllPatient,
    getAllPatientByDoctorId: getAllPatientByDoctorId,
    getAllPatientBooking: getAllPatientBooking
}