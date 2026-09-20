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

    // ২. হেডার এবং ফুটার ডাইনামিক্যালি লোড করার কোড (আপনার দেওয়া)
    const noCache = "?v=" + new Date().getTime(); // ক্যাশ ক্লিয়ারিং

    // হেডার লোড করা
    fetch('header.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            let headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) headerPlaceholder.innerHTML = data;
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
