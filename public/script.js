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
        
    // হেডার খোঁজার লুপ চালু করে দেওয়া হলো
    initGlobalLiveBoard();
});

// =====================================================================
// ২. লাইভ নিউজ বোর্ড (REST API Method - 100% Conflict Free)
// =====================================================================
function initGlobalLiveBoard() {
    const checkInterval = setInterval(() => {
        const marqueeContent = document.getElementById('header-marquee-content');
        const headerBoard = document.getElementById('headerLiveBoard');
        
        if (marqueeContent && headerBoard) {
            clearInterval(checkInterval); // হেডার পাওয়া গেছে, লুপ বন্ধ
            
            headerBoard.style.display = 'flex';
            marqueeContent.innerHTML = '<span class="date"><i class="fas fa-spinner fa-spin"></i></span> ডাটা আপডেট হচ্ছে...';

            // ফায়ারবেস SDK ছাড়াই সরাসরি ডাটাবেজ থেকে ডাটা আনার ম্যাজিক লিংক
            const url = 'https://firestore.googleapis.com/v1/projects/rjsomp/databases/(default)/documents:runQuery?key=AIzaSyDBB74MD8ZC1mUD787oqKqmXD-S4nb60yw';
            
            // কুয়েরি লজিক: সময় অনুযায়ী সাজানো
            const queryBody = {
                structuredQuery: {
                    from: [{ collectionId: "notices" }],
                    orderBy: [{
                        field: { fieldPath: "timestamp" },
                        direction: "DESCENDING"
                    }]
                }
            };

            // সরাসরি Fetch রিকোয়েস্ট (যেকোনো পেজে কাজ করবে)
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryBody)
            })
            .then(response => response.json())
            .then(data => {
                let html = '';
                let hasLiveNotice = false;
                
                // ডাটা পার্স করা
                if (data && data.length > 0 && data[0].document) {
                    data.forEach(item => {
                        if(item.document && item.document.fields) {
                            const fields = item.document.fields;
                            const isLive = fields.isLive && fields.isLive.booleanValue === true;
                            
                            if (isLive) {
                                hasLiveNotice = true;
                                const title = fields.title ? fields.title.stringValue : '';
                                const date = fields.date ? fields.date.stringValue : 'আপডেট';
                                const desc = fields.description ? fields.description.stringValue : '';
                                
                                // 🔴 টাইটেলের সাথে বিস্তারিত বিবরণ যুক্ত করা
                                let fullNoticeText = title;
                                if(desc) {
                                    fullNoticeText += ` - ${desc.replace(/\n/g, ' ')}`;
                                }
                                
                                html += `<span class="date">[${date}]</span> ${fullNoticeText} <span class="divider">||</span> `;
                            }
                        }
                    });
                }
                
                if (hasLiveNotice) {
                    headerBoard.style.display = 'flex';
                    marqueeContent.innerHTML = html;
                } else {
                    headerBoard.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Notice Load Error:", error);
                headerBoard.style.display = 'none';
            });
        }
    }, 300); // প্রতি ৩০০ মিলি-সেকেন্ড পরপর হেডার খুঁজবে
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
