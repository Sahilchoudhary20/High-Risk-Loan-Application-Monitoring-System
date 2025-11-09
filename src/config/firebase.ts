import admin from 'firebase-admin';
import path from 'path';

const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '..', '..', 'serviceAccountKey.json');

if (!admin.apps.length) {
  const serviceAccount = require(credPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export default admin;
