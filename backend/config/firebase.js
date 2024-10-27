const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Add your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL // Make sure this matches your database URL
});

const db = admin.firestore(); // Firestore database
module.exports = db;
