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
                    attributes: ['descriptionHTML', 'descriptionMarkdown','name', 'address']
                })
                console.log(data)
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

module.exports = {
    CreateClinicService, getAllClinicService , getDetailClinicByIdService
}
