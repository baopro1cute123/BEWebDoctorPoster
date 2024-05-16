let PaymentMoMoService = require("../services/MoMo/PaymentMoMoService");

let paymentMoMo = async (req, res) => {
    let price = req.query.price;
    let doctorId = req.query.doctorId;
    let token = req.query.token
    try {
        const payment = await PaymentMoMoService.paymentMoMoService(price, doctorId, token);
        return res.status(200).json(payment);
    } catch (error) {
        console.error("Error:", error);

        const clientError = {
            errCode: -1,
            errMessage: 'Error from server',
            details: error.message,  // Optional: to provide more context about the error
        };

        if (error.response) {
            clientError.details = error.response.data;
        }

        return res.status(500).json(clientError);
    }
};

let CheckpaymentMoMo = async (req, res) => {
    let orderId = req.query.orderId;
    try {
        const statuspayment = await PaymentMoMoService.CheckpaymentMoMoService(orderId);
        return res.status(200).json(statuspayment);
    } catch (error) {
        console.error("Error:", error);

        const clientError = {
            errCode: -1,
            errMessage: 'Error from server',
            details: error.message,
        };

        if (error.response) {
            clientError.details = error.response.data;
        }

        return res.status(500).json(clientError);
    }
};

module.exports = { paymentMoMo, CheckpaymentMoMo };
