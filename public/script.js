document.addEventListener("DOMContentLoaded", function() {
    // প্রতিবার নতুন লিংক তৈরি করবে, ফলে ব্রাউজার ক্যাশ ধরে রাখতে পারবে না
    const noCache = "?v=" + new Date().getTime();

    // হেডার লোড করা
    fetch('header.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    // ফুটার লোড করা
    fetch('footer.html' + noCache, { cache: "no-store" })
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});
