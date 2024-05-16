import ClinicService from "../services/ClinicService";

let CreateClinic = async(req, res) => {
    try {
        let infor = await ClinicService.CreateClinicService(req.body);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllClinic = async(req, res) => {
    try {
        let infor = await ClinicService.getAllClinicService();
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


let getDetailClinicById = async(req, res) => {
    try {
        let infor = await ClinicService.getDetailClinicByIdService(req.query.id);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let UpdateClinic = async(req, res) => {
    try {
        let clinic = await ClinicService.UpdateClinicService(req.body);
        return res.status(200).json(clinic)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let DeleteClinic = async(req, res) => {
    try {
        let clinic = await ClinicService.DeleteClinicService(req.body.id);
        return res.status(200).json(clinic)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    CreateClinic: CreateClinic, getAllClinic: getAllClinic, getDetailClinicById: getDetailClinicById,
    UpdateClinic: UpdateClinic, DeleteClinic : DeleteClinic,
}