import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBH4c2afZmspEyCKBSWfSv0d2_mVzg6yuw",
  authDomain: "eventsites.firebaseapp.com",
  projectId: "eventsites",
  storageBucket: "eventsites.firebasestorage.app",
  messagingSenderId: "271846969060",
  appId: "1:271846969060:web:cf501aecc7838ed20626f1"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
