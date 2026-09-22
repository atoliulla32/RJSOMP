// হেডার এবং ফুটার অটোমেটিক লোড করার ফাংশন
const noCache = "?v=" + new Date().getTime(); // ক্যাশ ক্লিয়ারিং

document.addEventListener("DOMContentLoaded", function() {
    
    // ১. সব পেইজের হেডারে অটোমেটিক লোগো ও PWA ম্যানিফেস্ট যুক্ত করার কোড
    const head = document.head;
    const metaTags = `
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#dc2626">
    `;
    head.insertAdjacentHTML("beforeend", metaTags);

    // ২. হেডার লোড করা
    fetch('header.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                
                // 🔴 ম্যাজিক: হেডার লোড হয়ে বডিতে বসার সাথে সাথেই নোটিশ বোর্ড চালু হবে
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
// ৩. লাইভ নিউজ বোর্ড সব পেজে দেখানোর আধুনিক মডিউল সিস্টেম
// =====================================================================
function startLiveNoticeBoard() {
    // Dynamic Import: এই পদ্ধতি ব্যবহার করলে কোনো ব্রাউজার স্ক্রিপ্ট ব্লক করবে না!
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
        
        // ফায়ারবেস ইনিশিয়ালাইজেশন
        const app = firebaseApp.getApps().length === 0 ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApp();
        const db = firebaseFirestore.getFirestore(app);

        // ফায়ারবেসের ইনডেক্স এরর এড়াতে শুধু orderBy ব্যবহার করা হলো
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
                // ম্যানুয়ালি চেক করা হচ্ছে নোটিশটি লাইভ আছে কিনা
                if(notice.isLive === true) {
                    hasLiveNotice = true;
                    html += `<span class="date">[${notice.date || 'আপডেট'}]</span> ${notice.title} <span class="divider">||</span> `;
                }
            });
            
            // নোটিশ থাকলে বোর্ড দেখাবে, না থাকলে লুকাবে
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
