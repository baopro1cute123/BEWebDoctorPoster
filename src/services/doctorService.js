import _ from 'lodash';
import db from '../models/index';
import emailService from './emailService';
require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctor = (limit) => {
    return new Promise(async(resolve, reject)=>{
        try {
            let users = await db.User.findAll({
                limit: limit,
                where : {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes:['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes:['valueEn', 'valueVi']}
                ],
                raw : true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async(resolve, reject)=>{
        try {
            let doctors = await db.User.findAll({
                where : {roleId: 'R2'},
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arr = ['doctorId','contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment' ,'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId']
    let isValid = true ;
    let element = '';
    for (let i = 0; i < arr.length ; i++){
        if(!inputData[arr[i]]){
            isVailid = false;
            element = arr[i]
            break
        }
    }

    return {
        isValid: isValid,
        element: element
    }

}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async(resolve, reject)=>{
        try {
                let checkObj = checkRequiredFields(inputData)
            if(checkObj.isValid === false){
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            }else{
                if(inputData.action === 'CREATE'){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId : inputData.doctorId
                    })
                }else if(inputData.action === 'EDIT'){
                    let doctorMarkdown = await db.Markdown.findOne({
                        where : { doctorId: inputData.doctorId},
                        raw : false
                    })
                    if(doctorMarkdown){
                        doctorMarkdown.contentHTML= inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.updateAt = new Date();
                        await doctorMarkdown.save()
                    }
                }
                //upsert
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where : {
                        doctorId: inputData.doctorId,
                    },
                    raw : false

                })
                if(doctorInfor){
                    //update
                        doctorInfor.priceId= inputData.selectedPrice;
                        doctorInfor.paymentId = inputData.selectedPayment;
                        doctorInfor.provinceId = inputData.selectedProvince;

                        doctorInfor.nameClinic= inputData.nameClinic;
                        doctorInfor.addressClinic = inputData.addressClinic;
                        doctorInfor.note = inputData.note;
                        doctorInfor.specialtyId = inputData.specialtyId;
                        doctorInfor.clinicId = inputData.clinicId;

                        await doctorInfor.save()
                }else{
                    //create
                    await db.Doctor_Infor.create({
                    doctorId : inputData.doctorId,
                    priceId :inputData.selectedPrice,
                    paymentId:  inputData.selectedPayment,
                    provinceId:  inputData.selectedProvince,

                    nameClinic: inputData.nameClinic,
                    addressClinic:  inputData.addressClinic,
                    note:  inputData.note,
                    specialtyId: inputData.specialtyId,
                    clinicId : inputData.clinicId
                    })
                }
                
                resolve({
                errCode: 0,
                errMessage: "Save infor doctor successd! "
                })
            }
            
        } catch (e) {
            reject(e);
        }
    })
}
let getDetaiDoctorbyIdService= (inputId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else{
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                    exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description','contentMarkdown', 'contentHTML']
                        },
                        {model: db.Allcode, as: 'positionData', attributes:['valueEn', 'valueVi']},
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id','doctorId']
                                },
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes:['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceTypeData', attributes:['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentTypeData', attributes:['valueEn', 'valueVi']},
                                // {model: db.Specialty, as: 'SpecialtyData', attributes:['name']}, // tự làm
                            ]
                            
                        }
                    ],
                    raw : false,
                    nest: true
                })
                if(data && data.image) {
                    data.image = new Buffer (data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save infor doctor successd! ",
                    data: data
                })
            }
            
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateScheduleService = (data) => {
    return new Promise(async(resolve, reject)=>{
        try {

            if(!data.arrSchedule || !data.doctorId ||!data.date){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0 ){
                    schedule = schedule.map(item => {
                        item.maxNumber =MAX_NUMBER_SCHEDULE;
                        return item
                    })
                }

                let existing = await db.Schedule.findAll(
                    {
                        where: {doctorId: data.doctorId, date: data.date},
                        attributes: ['timeType', 'date', 'doctorId','maxNumber'],
                        raw : true
                    }
                );
            
                let toCreate = _.differenceWith(schedule, existing, (a,b)=>{
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage : 'Ok'
                })
            }
            
        } catch (e) {
            reject(e);
        }
    })
}
let getScheduleByDateServices = (doctorId, date) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!doctorId || !date){
                resolve({
                    errCode: 1,
                    errCode: "Missing required parameters"
                })
            }else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date:  date,
                    },
                    include: [
                        {model: db.Allcode, as: 'timeTypeData', attributes:['valueEn', 'valueVi']},
                        
                        {model: db.User, as: 'doctorData', attributes:['firstName', 'lastName']},

                    ],
                    raw : false,
                    nest: true
                })
                if(!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        
        } catch (e) {
            reject(e);
        }
    })
}
let getExtraInforDoctorByIdService = (doctorId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!doctorId ){
                resolve({
                    errCode: 1,
                    errCode: "Missing required parameters"
                })
            }else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId,
                    },
                    attributes : {
                        exclude : ['id', 'doctorId']
                    },
                    include: [
                        {model: db.Allcode, as: 'priceTypeData', attributes:['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'provinceTypeData', attributes:['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'paymentTypeData', attributes:['valueEn', 'valueVi']},
                    ],
                    raw : false,
                    nest: true
                })
                if(!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        
        } catch (e) {
            reject(e);
        }
    })
}
let getProFileDoctorByIdService = (doctorId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!doctorId ){
                resolve({
                    errCode: 1,
                    errCode: "Missing required parameters"
                })
            }else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes : {
                        exclude : ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description','contentMarkdown', 'contentHTML']
                        },
                        {model: db.Allcode, as: 'positionData', attributes:['valueEn', 'valueVi']},
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id','doctorId']
                                },
                            include: [
                                {model: db.Allcode, as: 'priceTypeData', attributes:['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceTypeData', attributes:['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentTypeData', attributes:['valueEn', 'valueVi']},
                            ]
                        }
                    ],
                    raw : false,
                    nest: true
                })
                if(data && data.image) {
                    data.image = new Buffer (data.image, 'base64').toString('binary')
                }

                if(!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        
        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientForDoctorService = (doctorId, date) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                        model: db.User,
                        as: 'patientData',
                        attributes: ['email', 'firstName', 'address', 'gender'],
                        include: [
                            {
                                model: db.Allcode, as: 'genderData', attributes:['valueEn', 'valueVi']

                            },
                        ],
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', attributes:['valueEn', 'valueVi']
                        },
                
                ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                    data: data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let sendRemedyService = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                });
            } else {
                //update
                    let appointment = await db.Booking.findOne({
                        where: {
                            doctorId: data.doctorId,
                            patientId: data.patientId,
                            timeType: data.timeType,
                            statusId: 'S2'
                        },
                        raw: false
                    })
                    if (appointment) {
                        appointment.statusId = 'S3'
                        await appointment.save()
                    }

                //send email
                await emailService.sendAttachment(data);
                
                // theem vao historys
                    await db.History.create({
                        patientId: data.patientId,
                        doctorId: data.doctorId,
                        description: data.reason,
                        files : data.imgBase64,
                        date : data.patientDate
                    })
                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                    data: data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    sendRemedyService, getListPatientForDoctorService,getProFileDoctorByIdService,getExtraInforDoctorByIdService, getScheduleByDateServices,getTopDoctor,getAllDoctors,saveDetailInforDoctor,getDetaiDoctorbyIdService,bulkCreateScheduleService
}