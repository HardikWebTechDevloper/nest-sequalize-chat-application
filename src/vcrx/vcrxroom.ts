import * as fs from 'fs';
import { config } from 'dotenv';
import vcxutil from './vcrxutils';

const vcxroom: any = {};

// room object for creating room for one to one call
const roomObj: any = {
    name: 'room for one to one video meeting',
    owner_ref: 'one to one github sample',
    settings: {
        description: 'One-to-One-Video-Chat-Sample-Web-Application',
        scheduled: false,
        adhoc: true,
        moderators: '1',
        participants: '1',
        duration: '30',
        quality: 'SD',
        auto_recording: false,
    },
};

// room object for creating room with multi party calling
const multiPartyRoomObj: any = {
    name: 'room for multiparty video meeting',
    owner_ref: 'multiparty github sample',
    settings: {
        description: 'One-to-One-Video-Chat-Sample-Web-Application',
        scheduled: false,
        adhoc: true,
        moderators: '1',
        participants: '5',
        duration: '30',
        quality: 'SD',
        auto_recording: false,
    },
};

console.log(process.env.CERTIFICATE_SSL_KEY);


// HTTP Request Header Creation
const options: any = {
    host: 'api.enablex.io',
    port: 443,
    key: fs.readFileSync(process.env.CERTIFICATE_SSL_KEY).toString(),
    cert: fs.readFileSync(process.env.CERTIFICATE_SSL_CERT).toString(),
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${vcxutil.getBasicAuthToken()}`,
    },
};

// Function: To get Token for a Room
vcxroom.getToken = (details: any, callback: any) => {
    options.path = `/v1/rooms/${details.roomId}/tokens`;
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${vcxutil.getBasicAuthToken()}`,
    };

    vcxutil.connectServer(options, JSON.stringify(details), (status: string, data: any) => {
        if (status === 'success') {
            callback(status, data);
        } else if (status === 'error') {
            callback(status, data);
        }
    });
};

// Function: To get a list of Rooms
vcxroom.getAllRooms = (callback: any) => {
    options.path = '/v1/rooms/';
    options.method = 'GET';
    vcxutil.connectServer(options, null, (status: string, data: any) => {
        callback(data);
    });
};

// Function: To get information of a Room
vcxroom.getRoom = (roomName: string, callback: any) => {
    options.path = `/v1/rooms/${roomName}`;
    options.method = 'GET';
    vcxutil.connectServer(options, null, (status: string, data: any) => {
        if (status === 'success') {
            callback(status, data);
        } else if (status === 'error') {
            callback(status, data);
        }
    });
};

// Function: To create Room
vcxroom.createRoom = (callback: any) => {
    const roomMeta = roomObj;
    options.path = '/v1/rooms/';
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${vcxutil.getBasicAuthToken()}`,
    };
    vcxutil.connectServer(options, JSON.stringify(roomMeta), (status: string, data: any) => {
        if (status === 'success') {
            callback(status, data);
        } else if (status === 'error') {
            callback(status, data);
        }
    });
};

// Function: To create Room
vcxroom.createRoomMulti = (callback: any) => {
    const roomMeta = multiPartyRoomObj;
    options.path = '/v1/rooms/';
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${vcxutil.getBasicAuthToken()}`,
    };
    vcxutil.connectServer(options, JSON.stringify(roomMeta), (status: string, data: any) => {
        if (status === 'success') {
            callback(status, data);
        } else if (status === 'error') {
            callback(status, data);
        }
    });
};

export default vcxroom;