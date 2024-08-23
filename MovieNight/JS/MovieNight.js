import { convertToMd } from "../../JS/convertToMd.js"

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.navBtn');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const page = button.dataset.page;
            button.innerHTML = convertToMd(page, event.target);
            console.log('btn Click')
        })
    });
    
})