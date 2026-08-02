window.addEventListener("DOMContentLoaded", () => {
  const bubble = document.getElementById("splash-bubble");
  const splashSubtxt = document.getElementById("splash-subtxt");
  
  // Remove splash overlay after delay
  setTimeout(() => {
    document.getElementById("splash-overlay")?.remove();
  }, 3000);

  const splashText = [
    "Bachelor of Computing",
    "Software Engineering",
    "Machine Learning",
    "Web Development"
  ];

  let currentIndex = 0;

  const FADE_DURATION = 500;  // Matches the CSS transition
  const DISPLAY_DURATION = 3000;

  const changeText = () => {
    if (!splashSubtxt) return;

    // Start fade out
    splashSubtxt.classList.add("fade-out");

    setTimeout(() => {
      // Change text and fade back in
      splashSubtxt.textContent = splashText[currentIndex];
      splashSubtxt.classList.remove("fade-out");

      currentIndex = (currentIndex + 1) % splashText.length;
    }, FADE_DURATION);
  };

  changeText(); // Start immediately
  setInterval(changeText, FADE_DURATION + DISPLAY_DURATION);

  // Bubble hide on scroll
  window.addEventListener("scroll", () => {
    if (!bubble) return;
    bubble.classList.toggle("bubble-hide", window.scrollY > 10);
  });
});
