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

module.exports = {
    CreateSpecialty: CreateSpecialty, getAllSpecialty: getAllSpecialty, getDetailSpecialtyById: getDetailSpecialtyById
}