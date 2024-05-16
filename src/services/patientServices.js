import { v4 as uuidv4 } from 'uuid';
import db from '../models/index';
import emailService from './emailService';
require('dotenv').config();

// let buildUrlEmail = (doctorId, token) => {

//     let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

//     return result;
// }

let buildUrlEmailPayment = (doctorId, token) => {

    let result = `${process.env.URL_REACT}/done-payment?token=${token}&doctorId=${doctorId}`

    return result;
}

// let postBookAppointmentServices = (data) => {
//     return new Promise(async(resolve, reject)=>{
//         try {
//             if(!data.email || !data.doctorId || !data.timeType || !data.date ||
//                 !data.fullName || !data.selectedGender || !data.address || !data.phonenumber
//             ){
//                 resolve({
//                     errCode : 1,
//                     errMessage : "Missing required parameters"
//                 })
//             }else {

//                 let token = uuidv4();
                
//                 await emailService.sendSimpleEmail({
//                     reciverEmail: data.email,
//                     patientName: data.fullName,
//                     time: data.timeString,
//                     doctorName: data.doctorName,
//                     language : data.language,
//                     redirecLink : buildUrlEmail(data.doctorId, token)
//                 })

//                 let user = await db.User.findOrCreate({
//                     where: { email: data.email },
//                     defaults: {
//                         email: data.email,
//                         roleId: 'R3',
//                         gender: data.selectedGender,
//                         address: data.address,
//                         firstName: data.fullName,
//                         phonenumber: data.phonenumber
//                     }
//                 });

//                 // create a booking record
//                 if(user && user[0]) {
//                     await db.Booking.findOrCreate({
//                         where: {  patientId: user[0].id} ,
//                         defaults : {
//                             statusId: 'S1',
//                             doctorId: data.doctorId,
//                             patientId: user[0].id,
//                             date : data.date,
//                             timeType : data.timeType,
//                             token : token,
//                         }
//                     })
//                 }
//                 resolve({
//                     errCode: 0,
//                     errMessage: "Save user patient succced"
//                 })
//             }
        
//         } catch (e) {
//             reject(e);
//         }
//     })
// }

let postBookAppointmentServices = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date ||
                !data.fullName || !data.selectedGender || !data.address || !data.phonenumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                });
            } else {
                let token = uuidv4();

                let user = await db.User.findOne({ where: { email: data.email } });

                if (!user) {
                    // User doesn't exist, create a new user
                    user = await db.User.create({
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phonenumber
                    });
                }

                // create a booking record
                await db.Booking.create({
                    statusId: 'S1',
                    doctorId: data.doctorId,
                    patientId: user.id,
                    date: data.date,
                    timeType: data.timeType,
                    token: token,
                });

                // Send email
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirecLink: buildUrlEmailPayment(data.doctorId, token)
                });

                resolve({
                    errCode: 0,
                    errMessage: "Appointment booked successfully"
                });
            }

        } catch (e) {
            reject(e);
        }
    });
};



let postVerifyBookAppointmentServices = (data) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.token || !data.doctorId ){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if(appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Update appointment succced"
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage: "Update appointment error!"
                    })
                }
                //xóa lịch hẹn 
                let res = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S2'
                    },
                    raw: false
                })

                await db.Schedule.destroy({
                    where: {
                        doctorId: res.doctorId,
                        timeType: res.timeType,
                        date : res.date
                    }
                })

            }
            
        
        } catch (e) {
            reject(e);
        }
    })
}

let getAllPatientServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.History.findAll({
                include: [
                    {
                        model: db.User, as: 'patientDataHistory',
                        attributes:['firstName', 'email', 'address'],

                    },
                    {
                        model: db.User,
                        as: 'doctorDataHistory',
                        attributes:['firstName', 'lastName'],
                    }
                ],
                raw : false,
                nest: true
            });
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: patients
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllPatientByDoctorIdServices = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.History.findAll({
                where : {
                    doctorId : doctorId
                },
                include: [
                    {
                        model: db.User, as: 'patientDataHistory',
                        attributes:['firstName', 'email', 'address'],

                    },
                    {
                        model: db.User,
                        as: 'doctorDataHistory',
                        attributes:['firstName', 'lastName'],
                    }
                ],
                raw : false,
                nest: true
            });
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: patients
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllPatientBookingServices = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let patients = await db.Booking.findAll({
                include: [
                    {
                        model: db.User, as: 'patientData',
                        attributes:['firstName', 'email', 'address'],
                     },
                    {
                        model: db.User,
                        as: 'doctorIdData',
                        attributes:['firstName', 'lastName'],
                    },
                    {
                        model: db.Allcode,
                        as: 'timeTypeDataPatient',
                        attributes:['valueEn', 'valueVi'],
                    },
                    {
                        model: db.Allcode,
                        as: 'statusData',
                        attributes:['valueEn', 'valueVi'],
                    },
                ],
                raw : false,
                nest: true
            });
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: patients
            });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    postBookAppointmentServices , postVerifyBookAppointmentServices , getAllPatientServices, getAllPatientByDoctorIdServices, getAllPatientBookingServices
}