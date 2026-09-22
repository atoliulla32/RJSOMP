import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDBB74MD8ZC1mUD787oqKqmXD-S4nb60yw",
    authDomain: "rjsomp.firebaseapp.com"
};

// সিকিউরিটি: ফায়ারবেস চেক করার আগেই পুরো পেজ লুকিয়ে ফেলা হলো, যাতে কেউ ডাটা দেখতে না পারে
document.documentElement.style.display = 'none';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        // অ্যাডমিন লগইন করা থাকলে পেজটি দৃশ্যমান হবে
        document.documentElement.style.display = '';
    } else {
        // লগইন করা না থাকলে সরাসরি মেইন অ্যাডমিন প্যানেলে (লগইন পেজে) পাঠিয়ে দেবে
        window.top.location.href = "admin.html";
    }
});
