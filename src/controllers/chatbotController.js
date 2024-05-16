const messageService = require("../services/messageService");

const handleMessage = async (req, res) => {
    const message = req.body.message;

    try {
        const information = await messageService.handleMessage(message);
        return res.status(200).json(information);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
};

module.exports = { handleMessage };
