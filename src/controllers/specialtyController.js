import specialtyService from "../services/specialtyService";

let CreateSpecialty = async(req, res) => {
    try {
        let infor = await specialtyService.CreateSpecialtyService(req.body);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllSpecialty = async(req, res) => {
    try {
        let infor = await specialtyService.getAllSpecialtyService();
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailSpecialtyById = async(req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
        return res.status(200).json(infor)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let UpdateSpecialty = async(req, res) => {
    try {
        let specialty = await specialtyService.UpdateSpecialtyService(req.body);
        return res.status(200).json(specialty)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let DeleteSpecialty = async(req, res) => {
    try {
        let specialty = await specialtyService.DeleteSpecialtyService(req.body.id);
        return res.status(200).json(specialty)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    DeleteSpecialty ,UpdateSpecialty,CreateSpecialty: CreateSpecialty, getAllSpecialty: getAllSpecialty, getDetailSpecialtyById: getDetailSpecialtyById
}