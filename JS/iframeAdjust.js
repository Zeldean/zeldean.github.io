function resizeIframe() {
    const iframe = document.getElementById('myIframe');
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
}

// Adjust the iframe height when the content loads
document.getElementById('myIframe').onload = function() {
    resizeIframe();
};

// Optional: Adjust the height when the window is resized
window.onresize = function() {
    resizeIframe();
};