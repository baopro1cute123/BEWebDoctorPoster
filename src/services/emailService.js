require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let info = await transporter.sendMail({
            from: '"BOOKING DOCTOR" <bookingdoctor370@gmail.com>',
            to: dataSend.reciverEmail,
            subject: "Thông tin đặt lịch khám bệnh",
            html: getBodyHTMLEmail(dataSend),
           
        });

        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if(dataSend.language === `vi`){
        result =  `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <h4>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BOOKING DOCTOR</h4>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div>
          <b>Thời gian: ${dataSend.time}</b>
          </div>
          <div>
          <b>Bác sĩ: ${dataSend.doctorName}</b>
          </div>
          <p>Nếu các thông tin trên là đúng thì vui lòng click vào đường link bên dưới để xác nhận
          và hoàn tất thủ tục đặt lịch khám bệnh
          </p>
          <div>
            <a href=${dataSend.redirecLink} target='_blank'>Lịch hẹn ở đây</a>
          </div>
          <div>
          Xin chân thành cảm ơn !
          </div>
        </div>
        `
    }
    if(dataSend.language === `en`){
        result = `
               <h3>Dear ${dataSend.patientName}</h3>
               <h4>You received this email because you made an online medical appointment on BOOKING DOCTOR</h4>
               <p>Information for scheduling medical examination</p>
               <div>
                 <b>Time: ${dataSend.time}</b>
                 </div>
                 <div>
                 <b>Doctor: ${dataSend.doctorName}</b>
                 </div>
                 <p>If the above information is correct, please click on the link below to confirm
                 and complete the medical appointment scheduling procedure
                 </p>
                 <div>
                   <a href=${dataSend.redirecLink} target='_blank'>Appointment schedule here</a>
                 </div>
                 <div>
                 Sincerely thank !
                 </div>
               </div>
               `
    }
    return result
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });
            let info = await transporter.sendMail({
                from: '"BOOKING DOCTOR" <bookingdoctor370@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [{
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split("base64,")[1],
                    encoding: 'base64'
                }],
            });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName} </h3>
            <h4>Bạn nhận được email này vì đã đặt lịch BOOKING DOCTOR và đã khám bệnh thành công !</h4>
            <p>Thông tin đơn thuốc được gửi trong file đính kèm</p>
            <div>
                Xin chân thành cảm ơn !
            </div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
            <h3>Hello ${dataSend.patientName} </h3>
            <h4>You are receiving this email because you have booked a BOOKING DOCTOR appointment and had a successful medical examination!</h4>
            <p>Prescription information is sent in the attached file</p>
            <div>
                Sincerely thank !
            </div>
        `;
    }
    return result;
}

module.exports = {
    sendSimpleEmail, sendAttachment
};
