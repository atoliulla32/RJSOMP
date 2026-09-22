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

    // ২. হেডার এবং ফুটার ডাইনামিক্যালি লোড করার কোড
    const noCache = "?v=" + new Date().getTime(); // ক্যাশ ক্লিয়ারিং

    // হেডার লোড করা
    fetch('header.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                
                // 🔴 ম্যাজিক: হেডার লোড হওয়ার সাথে সাথেই নোটিশ বোর্ড চালু করার কমান্ড
                initGlobalLiveBoard();
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
// ৩. লাইভ নিউজ বোর্ড সব পেজে দেখানোর গ্লোবাল কোড (রক্তযোদ্ধা - RJSOMP)
// =====================================================================
function initGlobalLiveBoard() {
    const marqueeContent = document.getElementById('header-marquee-content');
    if (!marqueeContent) return; // হেডার না পেলে কোড থামিয়ে দেবে

    // ফায়ারবেস স্ক্রিপ্ট ডাইনামিক্যালি লোড করা হচ্ছে (মেইন পেজ ভারী না করে)
    if (typeof firebase === 'undefined') {
        const fbApp = document.createElement('script');
        fbApp.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
        document.head.appendChild(fbApp);

        fbApp.onload = () => {
            const fbDb = document.createElement('script');
            fbDb.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";
            document.head.appendChild(fbDb);

            // ডাটাবেজ স্ক্রিপ্ট লোড হলেই নোটিশ আনবে
            fbDb.onload = fetchGlobalNotices;
        };
    } else {
        fetchGlobalNotices();
    }
}

function fetchGlobalNotices() {
    // আপনার রক্তযোদ্ধা (RJSOMP) ওয়েবসাইটের ফায়ারবেস কনফিগারেশন
    const firebaseConfig = {
        apiKey: "AIzaSyDBB74MD8ZC1mUD787oqKqmXD-S4nb60yw",
        authDomain: "rjsomp.firebaseapp.com",
        projectId: "rjsomp"
    };
    
    // ফায়ারবেস ইনিশিয়ালাইজ করা
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    
    const db = firebase.firestore();
    const marqueeContent = document.getElementById('header-marquee-content');
    const headerBoard = document.getElementById('headerLiveBoard');
    
    if(!marqueeContent) return;

    // ডাটাবেজ থেকে রিয়েলটাইমে নোটিশ টেনে আনা
    db.collection("notices")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
          let html = '';
          let hasLiveNotice = false;
          
          querySnapshot.forEach((doc) => {
              const notice = doc.data();
              // শুধু যেগুলোতে লাইভ টিক দেওয়া আছে, সেগুলোই আনবে
              if(notice.isLive === true) {
                  hasLiveNotice = true;
                  html += `<span class="date">[${notice.date || 'আপডেট'}]</span> ${notice.title} <span class="divider">||</span> `;
              }
          });
          
          // নোটিশ না থাকলে বোর্ড লুকিয়ে ফেলবে, থাকলে দেখাবে
          if (!hasLiveNotice) {
              if(headerBoard) headerBoard.style.display = 'none';
          } else {
              if(headerBoard) headerBoard.style.display = 'flex';
              marqueeContent.innerHTML = html;
          }
      }, (error) => {
          console.error("Notice Load Error:", error);
      });
}
