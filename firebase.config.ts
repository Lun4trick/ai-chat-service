import * as admin from 'firebase-admin';

console.log(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.SERVICE_ACCOUNT_JSON as string),
  ),
});

export const db = admin.firestore(); // For Cloud Firestore

if (!db) {
  console.error('Firebase admin SDK not initialized');
}
export const auth = admin.auth(); // For Firebase Authentication
