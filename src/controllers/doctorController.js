import doctorService from "../services/doctorService";


let getTopDoctorHome = async(req,res) =>{
    let limit = req.query.limit
    if(!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctor(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}
let getAllDoctors = async(req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)

    } catch (e) {
        console.log('GET ALL CODE ERROR: ',e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postInforDoctor = async(req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response)

    } catch (e) {
        console.log('GET ALL CODE ERROR: ',e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetaiDoctorbyId = async(req, res) => {
    try {
        let infor = await doctorService.getDetaiDoctorbyIdService(req.query.id);
        return res.status(200).json(infor)

    } catch (e) {
        console.log('GET ALL CODE ERROR: ',e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let bulkCreateSchedule = async(req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(infor)

    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleByDate = async(req, res) => {
    try {
        let doctors = await doctorService.getScheduleByDateServices(req.query.doctorId, req.query.date);
        return res.status(200).json(doctors)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getExtraInforDoctorById = async(req, res) => {
    try {
        let doctors = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(doctors)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getProFileDoctorById = async(req, res) => {
    try {
        let doctors = await doctorService.getProFileDoctorByIdService(req.query.doctorId);
        return res.status(200).json(doctors)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatientForDoctor = async(req, res) => {
    try {
        let doctors = await doctorService.getListPatientForDoctorService(req.query.doctorId,req.query.date);
        return res.status(200).json(doctors)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let sendRemedy = async(req, res) => {
    try {
        let infor = await doctorService.sendRemedyService(req.body);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors : getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetaiDoctorbyId:getDetaiDoctorbyId,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate:getScheduleByDate,
    getExtraInforDoctorById:getExtraInforDoctorById,
    getProFileDoctorById: getProFileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendRemedy: sendRemedy,
}