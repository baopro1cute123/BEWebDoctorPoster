import revenueService from "../services/revenueService";

let getAllRevenue = async(req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate; 

    try {
        let revenue = await revenueService.getAllRevenueService(startDate, endDate );
        return res.status(200).json(revenue)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getRevenueById = async(req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate; 
    const userId = req.query.userId
    try {
        let revenue = await revenueService.getRevenueByIdService(startDate, endDate , userId);
        return res.status(200).json(revenue)

    }catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    getAllRevenue , getRevenueById
}