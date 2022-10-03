import fs from 'node:fs'

import { initializeApp } from "firebase/app";
import { applicationDefault, initializeApp as initializeAdminApp, cert, getApp } from 'firebase-admin/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, CollectionReference, collection, DocumentData } from 'firebase/firestore'
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore'

const firebaseConfig = {
  appId: import.meta.env.FIREBASE_APP_ID,
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)

const serviceAccount = fs.readFileSync("./firebase-credential.json", "utf-8")
const adminApp = getApp("[DEFAULT]") || initializeAdminApp({
  credential: cert(JSON.parse(serviceAccount)),
  databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
});

export const firestore = getFirestore(app)
export const adminFirestore = getAdminFirestore(adminApp)

const createCollection = <T = DocumentData>(collectionName: string) => {
	return collection(firestore, collectionName) as CollectionReference<T>
}

import VerifiedRoom from "../classes/VerifiedRoom";
export const usersCol = createCollection<VerifiedRoom>('rooms')

export const getList = async () => {
  const rooms = await adminFirestore.collection('rooms').get()
    .then(r => r.docs.map(d => d.data()))
  return rooms
}
