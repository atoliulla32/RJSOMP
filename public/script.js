// =====================================================================
// ১. হেডার ও ফুটার অটোমেটিক লোড করার ফাংশন
// =====================================================================
const noCache = "?v=" + new Date().getTime(); 

document.addEventListener("DOMContentLoaded", function() {
    const head = document.head;
    const metaTags = `
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#dc2626">
    `;
    head.insertAdjacentHTML("beforeend", metaTags);

    fetch('header.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }
        })
        .catch(err => console.log("Header load failed:", err));

    fetch('footer.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) footerPlaceholder.innerHTML = data;
        })
        .catch(err => console.log("Footer load failed:", err));
        
    // হেডার খোঁজার লুপ চালু করে দেওয়া হলো
    initGlobalLiveBoard();
});

// =====================================================================
// ২. লাইভ নিউজ বোর্ড (আল হুফফাজ গ্যারান্টিড মেথড - Firebase v8)
// =====================================================================
function initGlobalLiveBoard() {
    const marqueeContent = document.getElementById('header-marquee-content');
    
    // হেডার এখনো লোড না হলে আধা সেকেন্ড পর আবার চেক করবে (Loop)
    if (!marqueeContent) {
        setTimeout(initGlobalLiveBoard, 500);
        return;
    }

    // ফায়ারবেস স্ক্রিপ্ট লোড করা না থাকলে ডাইনামিকালি লোড করবে
    if (typeof firebase === 'undefined') {
        const fbApp = document.createElement('script');
        fbApp.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
        document.head.appendChild(fbApp);

        fbApp.onload = () => {
            const fbDb = document.createElement('script');
            fbDb.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";
            document.head.appendChild(fbDb);

            fbDb.onload = fetchGlobalNotices;
        };
    } else {
        fetchGlobalNotices();
    }
}

function fetchGlobalNotices() {
    const firebaseConfig = {
        apiKey: "AIzaSyDBB74MD8ZC1mUD787oqKqmXD-S4nb60yw",
        authDomain: "rjsomp.firebaseapp.com",
        projectId: "rjsomp"
    };
    
    if (!firebase.apps.length) { 
        firebase.initializeApp(firebaseConfig); 
    }
    
    const db = firebase.firestore();
    const marqueeContent = document.getElementById('header-marquee-content');
    const headerBoard = document.getElementById('headerLiveBoard');
    
    if(!marqueeContent) return;

    // চেক করার জন্য প্রথমে একটি লোডিং টেক্সট দেখাবে
    headerBoard.style.display = 'flex';
    marqueeContent.innerHTML = '<span class="date"><i class="fas fa-spinner fa-spin"></i></span> ডাটা চেক করা হচ্ছে...';

    // ইনডেক্স এরর এড়াতে শুধু orderBy ব্যবহার করা হয়েছে
    db.collection("notices").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
        let html = '';
        let hasLiveNotice = false;
        querySnapshot.forEach((doc) => {
            const notice = doc.data();
            if(notice.isLive) {
                hasLiveNotice = true;
                html += `<span class="date">[${notice.date || 'আপডেট'}]</span> ${notice.title} <span class="divider">||</span> `;
            }
        });
        
        if (!hasLiveNotice) {
            headerBoard.style.display = 'none';
        } else {
            headerBoard.style.display = 'flex';
            marqueeContent.innerHTML = html;
        }
    }, (error) => {
        console.error("Notice Load Error:", error);
    });
}

// =====================================================================
// ৩. মোবাইল মেনু এবং ড্রপডাউনের কোড
// =====================================================================
function toggleMenu() {
    var navLinks = document.getElementById("navLinks");
    var menuIcon = document.getElementById("menu-icon") || document.querySelector(".menu-toggle i");
    if (!navLinks) return;
    navLinks.classList.toggle("active");
    if (menuIcon) {
        if (navLinks.classList.contains("active")) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-times");
            menuIcon.style.color = "red";
        } else {
            menuIcon.classList.remove("fa-times");
            menuIcon.classList.add("fa-bars");
            menuIcon.style.color = "#15803d";
        }
    }
}

function toggleDropdown(param1, param2) {
    if (window.innerWidth <= 1024) {
        let targetElement = null;
        if (param1 && typeof param1.preventDefault === 'function') {
            param1.preventDefault(); 
            targetElement = param2;
        } else if (param1) {
            targetElement = param1;
        }
        if (targetElement) {
            targetElement.classList.toggle("active");
        }
    }
}

document.addEventListener("click", function(e) {
    var navLinks = document.getElementById("navLinks");
    var menuToggle = document.querySelector(".menu-toggle") || document.getElementById("menu-icon");
    if (navLinks && navLinks.classList.contains("active")) {
        if (!navLinks.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
            toggleMenu();
        }
    }
});
