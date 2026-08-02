window.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("site-nav");
    const navBox = document.getElementById("vertical-nav-container");
    const backToTopBtn = document.getElementById("backToTop");
    const navToggle = document.getElementById("nav-toggle");

    let lastScrollY = window.scrollY;
    let isAsideOut = false;

    // Scroll-based aside nav behavior and back-to-top visibility
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 40 && !isAsideOut) {
            nav.classList.remove('aside-in');
            nav.classList.add('aside-out');
            navBox.classList.remove("blur", "active");
            isAsideOut = true;
        } else if (currentScroll <= 40 && isAsideOut) {
            nav.classList.remove('aside-out');
            nav.classList.add('aside-in');
            navBox.classList.add("active");
            isAsideOut = false;
        }

        if (window.scrollY > 200) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }

        lastScrollY = currentScroll;
    });

    // Toggle side nav
    navToggle.addEventListener("click", () => {
        if (nav.classList.contains("aside-out")) {
            nav.classList.remove("aside-out");
            nav.classList.add("aside-in");
            navBox.classList.add("blur", "active");
            isAsideOut = false;
        } else {
            nav.classList.remove("aside-in");
            nav.classList.add("aside-out");
            navBox.classList.remove("blur", "active");
            isAsideOut = true;
        }
    });

    // Back to top scroll
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
