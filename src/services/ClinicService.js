import db from '../models/index';
require('dotenv').config();


let CreateClinicService = (data) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown ||!data.address ){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }else{
                await db.Clinic.create({
                    name : data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address: data.address
                })
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                })
            }
        
        } catch (e) {
            reject(e);
        }
    })
}

let getAllClinicService = () => {
    return new Promise(async(resolve, reject)=>{
        try {
            let data = await db.Clinic.findAll({
            });
            if(data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item
                })
            }
                resolve({
                    errCode: 0,
                    errMessage: "Ok",
                    data
                })
        
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailClinicByIdService = (inputId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }
            else
            {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown','name', 'address', 'image']
                })
                if(data){

                    let doctorClinic = []
                        doctorClinic = await db.Doctor_Infor.findAll({
                            where: {
                                clinicId : inputId },
                            attributes: ['doctorId']
                        })

                        data.doctorClinic = doctorClinic
                }else 
                {data = {}
            }
                resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        data
                    })
            }
        
        } catch (e) {
            reject(e);
        }
    })
}

let UpdateClinicService= (data) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown ||!data.address ){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }else{
                let clinic = await db.Clinic.findOne({
                    where : {id: data.clinicId},
                    raw: false

                });
                if (clinic) {
                    clinic.descriptionHTML = data.descriptionHTML
                    clinic.name = data.name,
                    clinic.address =  data.address ,
                    clinic.descriptionMarkdown =  data.descriptionMarkdown,
                    clinic.imageBase64 = data.imageBase64,
                    await clinic.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        data: clinic
                    })
                }
                
            }
        
        } catch (e) {
            reject(e);
        }
    })
}

let DeleteClinicService = (userId) => {
    return new Promise(async(resolve, reject)=>{
        let clinic = await db.Clinic.findOne({
            where: { id: userId}
        })
        if(!clinic) {
            resolve({
                errCode: 2,
                errMessage: "The Clinic isn't exist"
            })
        }
        await db.Clinic.destroy({
            where: { id: userId}
        })
        resolve({
            errCode: 0,
            message: "The Clinic is Delete"
        })
    })
}

module.exports = {
    CreateClinicService, getAllClinicService , getDetailClinicByIdService , UpdateClinicService , DeleteClinicService
}
