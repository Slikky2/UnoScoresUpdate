import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCkFlZ-HNhVx_vkG9DT461bZYg275ijQa0",
  authDomain: "uno-score-tracker.firebaseapp.com",
  projectId: "uno-score-tracker",
  storageBucket: "uno-score-tracker.firebasestorage.app",
  messagingSenderId: "502256969133",
  appId: "1:502256969133:web:067f671d5ff17bd3ca2d24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveGameResult(data) {
  try {
    await addDoc(collection(db, "games"), data);
    console.log("✅ Game saved to Firebase");
  } catch (err) {
    console.error("❌ Firebase save failed:", err);
  }
}
