// document.addEventListener('DOMContentLoaded', (event) => {
//     const activeSection = document.getElementById(event.target.title);
    
//     document.body.innerHTML = activeSection.innerHTML;
    
//     // activeSection.scrollIntoView({behavior: 'smooth', block: 'center', inline: '    
// })


document.addEventListener('DOMContentLoaded', () => {
    // Get the button that triggers the action
    const morePageLinks = document.querySelectorAll('.more_page_link');
    
    morePageLinks.forEach(pageLink => {
        pageLink.addEventListener('click', (event) => {
            const target = event.target.parent.id

            // Get the content you want to transfer from the old page
            const activeSection = document.getElementById(target);
            const content = activeSection.innerHTML;
            const contentElement = document.createElement('div');
            contentElement.innerHTML = content;

            // Open a new window or tab
            const newWindow = window.open(`${target}.html`, '_blank');
    
            // Write the content to the new window
            newWindow.document.body.appendChild(contentElement);            
    
            // Optional: Close the document to render the content
            newWindow.document.close();
        });
    });
});