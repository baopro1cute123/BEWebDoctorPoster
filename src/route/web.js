import express from "express";
import clinicController from "../controllers/clinicController";
import doctorController from "../controllers/doctorController";
import homeController from "../controllers/homeController";
import messageController from "../controllers/messageController";
import patientController from "../controllers/patientController";
import paymentMoMoController from "../controllers/paymentMoMoController";
import revenueController from "../controllers/revenueController";
import specialtyController from "../controllers/specialtyController";
import userController from "../controllers/userController";
1
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUDPage);

    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)


    router.post('/post-crud', homeController.postCRUD);
    router.post('/put-crud', homeController.putCRUD)


    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllcode)


    router.get('/api/top-doctor-home',doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors',doctorController.getAllDoctors)
    router.post('/api/save-infor-doctors',doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id',doctorController.getDetaiDoctorbyId)
    router.post('/api/bulk-create-schedule',doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date',doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id',doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id',doctorController.getProFileDoctorById)
    router.get('/api/get-price-doctor-by-id',doctorController.getPriceDoctorById)

    router.get('/api/get-list-patient-for-doctor',doctorController.getListPatientForDoctor)
    router.post('/api/send-remedy',doctorController.sendRemedy)
    router.post('/api/cancle-booking',doctorController.CancleBooking)



    router.post('/api/patient-book-appointment',patientController.postBookAppointment)
    router.post('/api/verify-book-appointment',patientController.postVerifyBookAppointment) //updatestatusId
    router.get('/api/get-all-patient', patientController.getAllPatient)
    router.get('/api/get-all-patient-by-doctorId', patientController.getAllPatientByDoctorId)
    router.get('/api/get-all-patient-booking', patientController.getAllPatientBooking)
    router.get('/api/check-booking', patientController.getCheckBooking)




    router.post('/api/create-new-specialty',specialtyController.CreateSpecialty) //updatestatusId
    router.get('/api/get-all-specialty',specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.put('/api/update-specialty',specialtyController.UpdateSpecialty) //updatestatusId
    router.delete('/api/delete-specialty', specialtyController.DeleteSpecialty)



    router.post('/api/create-new-clinic',clinicController.CreateClinic) //updatestatusId
    router.put('/api/update-clinic',clinicController.UpdateClinic) //updatestatusId
    router.delete('/api/delete-clinic', clinicController.DeleteClinic)


    router.get('/api/get-all-clinic',clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)


    //chatbot
    router.post('/api/message', messageController.handleMessageChatbot)
    router.post('/api/chatbot', messageController.handleMessage)

    router.post('/api/payment', paymentMoMoController.paymentMoMo)
    router.post('/api/check-status-payment', paymentMoMoController.CheckpaymentMoMo)
    
    router.get('/api/get-all-revenue',revenueController.getAllRevenue)
    router.get('/api/get-revenue-by-id',revenueController.getRevenueById)
    router.get('/api/get-all-revenue-by-id',revenueController.getAllRevenueById)





    return app.use("/", router);
}

module.exports = initWebRoutes;