import {convertToMd} from "../../JS/convert-to-md.js"

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const page = button.dataset.page;
            button.innerHTML = convertToMd(page, "output_page");
            console.log('btn Click')
            
        });
        const videoLinks = document.querySelectorAll('#output_page a');

    videoLinks.forEach(link => {
    const iframe = document.createElement('iframe');
    iframe.src = link.href;
    iframe.frameBorder = 0;
    link.innerHTML = '';
    link.appendChild(iframe);
});
    });
    
    
});