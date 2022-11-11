// const FCM = require('fcm-node');

// module.exports.androidPushNotification = (deviceToken, messageBody, type, callback) => {
//     const serverKey = "BNyZJV4xQCXTc1tgX6PIUEzuf30TistbB5E-bSGRDnIwyRdEhYFakBTBxh4u29kSBwk6ulPw_fREXmZa8s8RgqY";
//     const fcm = new FCM(serverKey);
//     const message = {
//         to: deviceToken,
//         collapse_key: `TEST`,
//         notification: {
//             title: 'RL-Shop-Tracker',
//             body: messageBody,
//             sound: `ping.aiff`,
//             delivery_receipt_requested: true
//         },
//         data: {
//             message: messageBody,
//             type: type
//         }
//     };
//     fcm.send(message, callback);
// }

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBPEZcmjwhcPV7lcJxe0pc_PlKnNYwUaCI",
//   authDomain: "rl-shop-tracler.firebaseapp.com",
//   projectId: "rl-shop-tracler",
//   storageBucket: "rl-shop-tracler.appspot.com",
//   messagingSenderId: "881296583574",
//   appId: "1:881296583574:web:6c9d0b97a2594610764bb7",
//   measurementId: "G-XK4DP3PBB6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);