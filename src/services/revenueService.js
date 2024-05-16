import db from '../models/index';
require('dotenv').config();


let getAllRevenueService = (startDate, endDate) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!startDate || !endDate){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            } else {
                let revenueInRange = await db.Revenue.findAll({
                    where: {
                        date: {
                            [db.Sequelize.Op.between]: [startDate, endDate]
                        }
                    }
                });

                // Tạo một đối tượng để lưu trữ tổng doanh thu cho mỗi ngày
                let dailyRevenueTotal = {};

                // Tính tổng doanh thu cho mỗi ngày
                revenueInRange.forEach(revenue => {
                    // Sử dụng timestamp làm khóa
                    const date = revenue.date;

                    // Kiểm tra xem đã có tổng doanh thu cho ngày này chưa
                    if (dailyRevenueTotal[date]) {
                        // Nếu đã có, cộng doanh thu hiện tại vào tổng
                        dailyRevenueTotal[date] += revenue.amount;
                    } else {
                        // Nếu chưa có, tạo một mục mới cho ngày này và gán doanh thu hiện tại
                        dailyRevenueTotal[date] = revenue.amount;
                    }
                });

                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                    data: dailyRevenueTotal
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getRevenueByIdService = (startDate, endDate, userId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!startDate || !endDate){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            } else {
                let revenueById = await db.Revenue.findAll({
                    where: {
                        userId: userId,
                        date: {
                            [db.Sequelize.Op.between]: [startDate, endDate]
                        }
                    }
                });

                // Tạo một đối tượng để lưu trữ tổng doanh thu cho mỗi ngày
                let dailyRevenueTotal = {};

                // Tính tổng doanh thu cho mỗi ngày
                revenueById.forEach(revenue => {
                    // Sử dụng timestamp làm khóa
                    const date = revenue.date;

                    // Kiểm tra xem đã có tổng doanh thu cho ngày này chưa
                    if (dailyRevenueTotal[date]) {
                        // Nếu đã có, cộng doanh thu hiện tại vào tổng
                        dailyRevenueTotal[date] += revenue.amount;
                    } else {
                        // Nếu chưa có, tạo một mục mới cho ngày này và gán doanh thu hiện tại
                        dailyRevenueTotal[date] = revenue.amount;
                    }
                });

                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                    data: dailyRevenueTotal
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};



module.exports = {
    getAllRevenueService, getRevenueByIdService
}