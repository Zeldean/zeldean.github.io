import { calculateAge } from "./age-calculation.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const ageDisplay = document.getElementById('age_display');
    const age = calculateAge('2004/11/22');
    ageDisplay.textContent = age;

})
