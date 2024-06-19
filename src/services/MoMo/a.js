const crypto = require('crypto');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

const app = express();
const port = 3000; // Choose your desired port

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle MoMo payment request
app.post('/momo/payment', (request, response) => {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const amount = "50000"; // Amount to be paid, adjust as needed

    const requestId = partnerCode + uuidv4(); // Generate unique request ID
    const orderId = requestId;
    const orderInfo = "Pay with MoMo";
    const redirectUrl = "https://momo.vn/return";
    const ipnUrl = "https://callback.url/notify";
    const requestType = "captureWallet";
    const extraData = ""; // Empty extra data

    // Construct raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Create HMAC SHA256 signature
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    // Prepare request body
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en' // Adjust language as needed
    });

    // Prepare HTTPS request options
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    // Send HTTPS request
    const req = https.request(options, res => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);

        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
            responseBody += chunk;
        });
        res.on('end', () => {
            console.log('Response Body:');
            console.log(responseBody);
            try {
                const responseJson = JSON.parse(responseBody);
                response.json(responseJson); // Send MoMo API response back to client
            } catch (error) {
                console.error('Error parsing JSON response:', error.message);
                response.status(500).json({ error: 'Internal Server Error' });
            }
        });
    });

    req.on('error', error => {
        console.error(`Problem with request: ${error.message}`);
        response.status(500).json({ error: 'Internal Server Error' });
    });

    console.log("Sending request...");
    req.write(requestBody);
    req.end();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
