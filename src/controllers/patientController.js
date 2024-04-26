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
module.exports = {
   
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
}