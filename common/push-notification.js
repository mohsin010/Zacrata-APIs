const path = require('path').resolve;
const config = require(path('config/constants'));
var admin = require("firebase-admin");
var serviceAccount = require('./../config/grocery-store-6c056-firebase-adminsdk-3sxwa-ed4e840b9e.json')
const geolib = require('geolib');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.fcmCreds.databaseUrl
});

const messaging = admin.messaging();

class PushNotification {
    /* 
     * Prepare push notification payload
     */
    async notifySingleDevice(notificationObj, token, otherData) {
        let data = Object.assign({ }, otherData)
        console.log('data', data);

        const payload = {
            token: token,
            notification: {
                title: notificationObj.title,
                body: notificationObj.body,
            },
            data: otherData
        }

      
        messaging.send(payload)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    }

    async notifyMultipleDevices(notificationObj, tokens, otherData) {

        let data = Object.assign({ type: config.notificationTypes.orderPlace }, otherData)
        console.log('data', data);

        const payload = {
            tokens: tokens,
            notification: {
                title: notificationObj.title,
                body: notificationObj.body,
            },
            data: otherData
        }

        // return this.send(payload);

        messaging.sendMulticast(payload)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    }

    /* 
     * Send push notification to user
     */
    async send(payload) {




    }

 
}

// Bind the context of the class with it before exporting.
PushNotification.bind(PushNotification);

module.exports = new PushNotification();