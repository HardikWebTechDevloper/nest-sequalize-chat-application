import btoa from 'btoa';
import https from 'https';
// import dotenv from 'dotenv';

// dotenv.config();

const vcxutil: any = {};

// Function: To create basic authentication header using APP ID and APP KEY
vcxutil.getBasicAuthToken = (): string => btoa(`${process.env.ENABLEX_APP_ID}:${process.env.ENABLEX_APP_KEY}`);

// Function: To connect to Enablex Server API Service
vcxutil.connectServer = (options: https.RequestOptions, data: any, callback: (status: string, data: any) => void) => {
    console.log(`REQ URI:- ${options.method} ${options.host}:${options.port}${options.path}`);
    console.log(`REQ PARAM:- ${data}`);
    const request = https.request(options, (res) => {
        let responseData: any = '';
        res.on('data', (chunk) => {
            responseData += chunk;
            console.log(`RESPONSE DATA:- ${chunk}`);
        });
        res.on('end', () => {
            if (responseData && responseData.result === 0) {
                callback('success', JSON.parse(responseData));
            } else {
                callback('error', JSON.parse(responseData));
            }
        });
    });
    request.on('error', (err) => {
        console.log(`RESPONSE ERROR:- ${JSON.stringify(err)}`);
    });
    if (data == null) {
        request.end();
    } else {
        request.end(data);
    }
};

export default vcxutil;