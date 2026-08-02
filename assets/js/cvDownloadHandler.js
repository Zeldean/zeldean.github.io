window.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById('downloadCv');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = `${window.__assetPrefix || './'}assets/dean_van_zyl_cv.pdf`;
            a.download = 'Dean_van_Zyl_CV.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
});
