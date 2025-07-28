window.addEventListener("DOMContentLoaded", () => {
    const bubble = document.getElementById("splash-bubble");

    // Remove splash overlay after delay
    setTimeout(() => {
        document.getElementById("splash-overlay")?.remove();
    }, 3000);

    // Scroll-based bubble hide
    window.addEventListener("scroll", () => {
        if (!bubble) return;
        if (window.scrollY > 10) {
            bubble.classList.add("bubble-hide");
        } else {
            bubble.classList.remove("bubble-hide");
        }
    });
});
