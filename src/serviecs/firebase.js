import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCSgRjj50i6wtdQZ8X9z8_AH0rpJwT_-e4",
  authDomain: "chat-app-60f12.firebaseapp.com",
  projectId: "chat-app-60f12",
  storageBucket: "chat-app-60f12.appspot.com",
  messagingSenderId: "237442847751",
  appId: "1:237442847751:web:d58fd80ec5b5fc1e46c6a2"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export default {
  auth,
  firestore: db,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  app
}