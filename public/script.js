// =====================================================================
// ১. হেডার ও ফুটার অটোমেটিক লোড করার ফাংশন
// =====================================================================
const noCache = "?v=" + new Date().getTime(); 

document.addEventListener("DOMContentLoaded", function() {
    
    // PWA ম্যানিফেস্ট ও আইকন সব পেজে যুক্ত করা
    const head = document.head;
    const metaTags = `
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#dc2626">
    `;
    head.insertAdjacentHTML("beforeend", metaTags);

    // হেডার লোড করা
    fetch('header.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                
                // 🔴 ম্যাজিক: হেডার পেজে বসার সাথে সাথেই নোটিশ বোর্ড চালু হবে
                startLiveNoticeBoard();
            }
        })
        .catch(err => console.log("Header load failed:", err));

    // ফুটার লোড করা
    fetch('footer.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) footerPlaceholder.innerHTML = data;
        })
        .catch(err => console.log("Footer load failed:", err));
});


// =====================================================================
// ২. লাইভ নিউজ বোর্ড সব পেজে দেখানোর ডায়নামিক সিস্টেম
// =====================================================================
function startLiveNoticeBoard() {
    Promise.all([
        import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js")
    ]).then(([firebaseApp, firebaseFirestore]) => {
        
        // আপনার রক্তযোদ্ধা ওয়েবসাইটের ফায়ারবেস কনফিগারেশন
        const firebaseConfig = {
            apiKey: "AIzaSyDBB74MD8ZC1mUD787oqKqmXD-S4nb60yw",
            authDomain: "rjsomp.firebaseapp.com",
            projectId: "rjsomp"
        };
        
        const app = firebaseApp.getApps().length === 0 ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApp();
        const db = firebaseFirestore.getFirestore(app);

        const q = firebaseFirestore.query(
            firebaseFirestore.collection(db, "notices"), 
            firebaseFirestore.orderBy("timestamp", "desc")
        );

        firebaseFirestore.onSnapshot(q, (snapshot) => {
            const marqueeContent = document.getElementById('header-marquee-content');
            const headerBoard = document.getElementById('headerLiveBoard');
            
            if (!marqueeContent || !headerBoard) return;

            let html = '';
            let hasLiveNotice = false;
            
            snapshot.forEach((doc) => {
                const notice = doc.data();
                if(notice.isLive === true) {
                    hasLiveNotice = true;
                    html += `<span class="date">[${notice.date || 'আপডেট'}]</span> ${notice.title} <span class="divider">||</span> `;
                }
            });
            
            if (hasLiveNotice) {
                headerBoard.style.display = 'flex';
                marqueeContent.innerHTML = html;
            } else {
                headerBoard.style.display = 'none';
            }
        });

    }).catch(err => {
        console.error("Notice Board Data Error: ", err);
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
        } 
        else if (param1) {
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
