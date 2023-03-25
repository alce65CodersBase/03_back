import dotenv from 'dotenv';
dotenv.config();

export const config = {
  user: process.env.DB_USER,
  passwd: encodeURIComponent(process.env.DB_PASSWORD as string),
  cluster: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.SECRET,
};

export const firebaseConfig = {
  apiKey: process.env.FIRE_BASE_API_KEY,
  authDomain: 'back-2023.firebaseapp.com',
  projectId: 'back-2023',
  storageBucket: 'back-2023.appspot.com',
  messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
  appId: process.env.FIRE_BASE_APP_ID,
};
