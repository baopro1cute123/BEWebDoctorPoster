const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');

const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const accessKey = 'F8BBA842ECF85';

const paymentMoMoService = (price, token, doctorId) => {
    return new Promise(async (resolve, reject) => {
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const accessKey = 'F8BBA842ECF85';
        const orderInfo = 'Thanh toán với MoMo';
        const partnerCode = 'MOMO';
        const redirectUrl = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
        const ipnUrl = 'https://0778-14-178-58-205.ngrok-free.app/callback';
        const requestType = 'payWithMethod';
        const extraData = '';
        const orderGroupId = '';
        const autoCapture = true;
        const lang = 'vi';

        const amount = price;
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        };

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody,
        };

        try {
            const result = await axios(options);
            console.log(redirectUrl)
            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: result.data,
            });
        } catch (error) {
            const simpleError = {
                message: error.message,
                stack: error.stack,
                response: error.response ? error.response.data : null,
            };
            reject(simpleError);
        }
    });
};

const CheckpaymentMoMoService = (orderId) => {
    return new Promise(async (resolve, reject) => {
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: 'MOMO',
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi',
        });

        // options for axios
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
            'Content-Type': 'application/json',
            },
            data: requestBody,
        };
        try {
            let result = await axios(options);

            resolve({
                errCode: 0,
                errMessage: "Ok",
                data: result.data
            });
        } catch (error) {
            const simpleError = {
                message: error.message,
                stack: error.stack,
                response: error.response ? error.response.data : null,
            };
            reject(simpleError);
        }
    });
};


module.exports = { paymentMoMoService , CheckpaymentMoMoService };
