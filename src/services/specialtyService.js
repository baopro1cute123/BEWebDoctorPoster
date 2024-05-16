import db from '../models/index';
require('dotenv').config();

let CreateSpecialtyService = (data) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown ){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }else{
                await db.Specialty.create({
                    name : data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
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

let getAllSpecialtyService = () => {
    return new Promise(async(resolve, reject)=>{
        try {
            let data = await db.Specialty.findAll({
            });
            if(data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer (item.image, 'base64').toString('binary')
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

let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!inputId || !location){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }else{
           
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                });

                if(data){
                    
                    let doctorSpecialty = []

                    if(location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId : inputId
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
    
                    }else{
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId : inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
    
                    }

                    data.doctorSpecialty = doctorSpecialty

                }else{
                    data = {}
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

let UpdateSpecialtyService= (data) => {
    return new Promise(async(resolve, reject)=>{
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown ){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter !"
                })
            }else{
                let specialty = await db.Specialty.findOne({
                    where : {id: data.specialtyId},
                    raw: false

                });
                if (specialty) {
                    specialty.descriptionHTML = data.descriptionHTML
                    specialty.name = data.name,
                    specialty.descriptionMarkdown =  data.descriptionMarkdown,
                    specialty.imageBase64 = data.imageBase64,
                    await specialty.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Ok",
                        data: specialty
                    })
                }
                
            }
        
        } catch (e) {
            reject(e);
        }
    })
}

let DeleteSpecialtyService = (userId) => {
    return new Promise(async(resolve, reject)=>{
        let specialty = await db.Specialty.findOne({
            where: { id: userId}
        })
        if(!specialty) {
            resolve({
                errCode: 2,
                errMessage: "The specialty isn't exist"
            })
        }
        await db.Specialty.destroy({
            where: { id: userId}
        })
        resolve({
            errCode: 0,
            message: "The specialty is Delete"
        })
    })
}

module.exports = {
    CreateSpecialtyService ,getAllSpecialtyService,getDetailSpecialtyByIdService, UpdateSpecialtyService, DeleteSpecialtyService
}