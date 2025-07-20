/* js/generate-cv.js
 * Client-side PDF generator for Dean van Zyl’s CV using pdf-lib.
 * Requirements (all local, GitHub-Pages-friendly):
 *   – <script src="js/pdf-lib.min.js"></script> gives global `PDFLib`
 *   – JSON data stored at ./assets/cv.json
 *   – This file loaded as a module: <script type="module" src="js/generate-cv.js"></script>
 */

const { PDFDocument, StandardFonts } = PDFLib; // exposed by pdf-lib.min.js (UMD build)

async function loadCV() {
  const res = await fetch('./assets/cv.json');
  if (!res.ok) throw new Error('Unable to load CV JSON');
  return res.json();
}

function initButton() {
  const btn = document.getElementById('downloadCv');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      const CV = await loadCV();
      const bytes = await buildPdf(CV);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${CV.contact.full_name.replace(/\s+/g, '_')}_CV.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Could not generate PDF. See console for details.');
    }
  });
}

async function buildPdf(CV) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 size in points (72 dpi)
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  let y = page.getHeight() - 40;

  const draw = (txt, size = fontSize, gap = 16) => {
    page.drawText(txt, { x: 40, y, size, font });
    y -= gap;
  };

  // ===== CONTACT =====
  draw(CV.contact.full_name, 18, 24);
  draw(`${CV.contact.city} · ${CV.contact.email} · ${CV.contact.phone}`);
  y -= 8;

  // ===== SUMMARY =====
  if (CV.summary) {
    draw('Summary', 14, 20);
    draw(CV.summary, 12, 18);
    y -= 8;
  }

  // ===== SKILLS =====
  draw('Skills', 14, 20);
  const s = CV.skills;
  if (s.languages?.length) draw('Languages: ' + s.languages.join(', '));
  if (s.frameworks?.length) draw('Frameworks: ' + s.frameworks.join(', '));
  if (s.tools?.length) draw('Tools: ' + s.tools.join(', '));
  if (s.databases?.length) draw('Databases: ' + s.databases.join(', '));
  y -= 8;

  // ===== PROJECTS =====
  if (CV.projects?.length) {
    draw('Projects', 14, 20);
    CV.projects.forEach(p => {
      draw(`• ${p.name} (${p.date})`, 12, 18);
      if (p.description) draw(`  ${p.description}`, 11, 16);
    });
    y -= 8;
  }

  // ===== EDUCATION =====
  draw('Education', 14, 20);
  CV.education?.forEach(ed => {
    const dur = `${ed.start_year}-${ed.expected_grad ?? ''}`;
    draw(`${ed.degree} – ${ed.institution} (${dur})`, 12, 18);
  });

  return pdf.save();
}

// bootstrap
initButton();

module.exports = { buildPdf, loadCV, initButton };
