import db from '../models/index';

const handleMessageServices = (message) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!message) {
                resolve({ errCode: -1, message: "Missing message" });
            }

            let sick = await db.Specialty.findAll({
                attributes:['name'],
            })
            let response;
            const lowerCaseMessage = message.toLowerCase();
            switch (true) {
                case lowerCaseMessage.includes('xin chào'):
                    response = { errCode: 0, message: "Booking Doctor xin chào! Rất vui được hỗ trợ bạn." };
                    break;
                case lowerCaseMessage.includes('đặt lịch'):
                    response = { errCode: 0, message: "Bạn muốn đặt lịch khám bệnh? Vui lòng chọn vào bác sĩ, sau đó chọn vào phần đặt lịch khám bệnh!" };
                    break;
                case lowerCaseMessage.includes('chuyên khoa'):
                    let specialtys = await db.Specialty.findAll({
                        attributes:['name', 'image', 'id'],

                    });
                    response = {
                        errCode: 0,
                        message: "Các chuyên khoa của chúng tôi: ",
                        data : specialtys
                    };
                    break;
                    case lowerCaseMessage.includes('phòng khám'):
                        let clinics = await db.Clinic.findAll({
                            attributes: ['name', 'image', 'id'],
                        });

                        let data = clinics.map(clinic => ({ id: clinic.id, name: clinic.name, imgclinic: clinic.image }));

                        response = {
                            errCode: 0,
                            message: "Các phòng khám của chúng tôi: ",
                            data: data
                        };
                        break;

                case lowerCaseMessage.includes('bác sĩ'):
                    let doctors = await db.User.findAll({
                        where : {roleId: 'R2'},
                        attributes:['firstName','lastName', 'image','id'],

                    })
                    let datadoctor = doctors.map(doctors => ({ id : doctors.id, lastName: doctors.lastName,firstName: doctors.firstName, imgdoctor: doctors.image }));

                    response = {
                        errCode: 0,
                        message: "Các bác sĩ của chúng tôi: ",
                        data: datadoctor };
                    break;
                case lowerCaseMessage.includes('tỉnh thành'):
                        let province = await db.Allcode.findAll({
                            where : {
                                type: 'PROVINCE'
                            },
                            attributes: {
                                exclude: ['image']
                            },
                        });
                        response = {
                            errCode: 0,
                            message: "Các tỉnh thành có chi nhánh khám trên toàn quốc của chúng tôi: ",
                            data : province
                        };
                        break;
                    case sick.some(keyword => lowerCaseMessage.includes(`tôi cần khám về ${keyword.name.toLowerCase()}`)):
                            let dynamicSpecialties = [];
                            for (const keyword of sick) {
                                if (lowerCaseMessage.includes(`tôi cần khám về ${keyword.name.toLowerCase()}`)) {
                                    let specialties = await db.Specialty.findAll({
                                        where: {
                                            name: keyword.name
                                        },
                                        attributes:['name', 'image', 'id'],
                                    });
                                    dynamicSpecialties = dynamicSpecialties.concat(specialties);
                                }
                            }
                            response = {
                                errCode: 0,
                                message: `Đây là chuyên khoa liên quan về bệnh của bạn: `,
                                data: dynamicSpecialties
                            };
                            break;
                        
                default:
                    response = { errCode: 0, message: "Xin lỗi, tôi không hiểu yêu cầu của bạn." };
                    break;
            }

            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: response
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { handleMessageServices };
