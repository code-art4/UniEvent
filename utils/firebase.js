import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBTOll2xFC1idd1FNotMkcvmLYUOkrgA0g",
	authDomain: "event-and-ticketing-system.firebaseapp.com",
	projectId: "event-and-ticketing-system",
	storageBucket: "event-and-ticketing-system.appspot.com",
	messagingSenderId: "858403665866",
	appId: "1:858403665866:web:888015be8b5b85fbb4c133",
	measurementId: "G-NMN9V4ER2Z"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth, storage };
export default db;
