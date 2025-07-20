// build-cv.mjs  ── run:  node build-cv.mjs
import fs from 'fs/promises';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const CV = JSON.parse(await fs.readFile('./assets/cv.json', 'utf8'));

// ─── layout helpers (same logic as browser file) ──────────────────────────
const A4 = [595.28, 841.89];
const MARGIN = 40;
const BODY = 11, HEAD = 14, NAME = 18, GAP = 4;

let pdf, page, fontR, fontB, y;
const newPage = () => { page = pdf.addPage(A4); y = A4[1] - MARGIN; };
const wrap = (txt, max, font, size) => {
  const out = [], w = txt.split(/\s+/);
  let line = '';
  w.forEach(word => {
    const t = line ? line + ' ' + word : word;
    if (font.widthOfTextAtSize(t, size) > max) { out.push(line); line = word; }
    else line = t;
  });
  if (line) out.push(line);
  return out;
};
const drawLines = (lines, x, size, font) => {
  const lh = size + GAP;
  if (y - lines.length * lh < MARGIN) newPage();
  lines.forEach(l => { page.drawText(l, { x, y, size, font }); y -= lh; });
};
const heading = txt => { drawLines([txt], MARGIN, HEAD, fontB); y -= 6; };
const bullet  = txt => {
  const indent = 12, max = A4[0] - 2*MARGIN - indent;
  const lines = wrap(txt, max, fontR, BODY);
  if (y - (lines.length+1)*(BODY+GAP) < MARGIN) newPage();
  page.drawText('•', { x: MARGIN, y, size: BODY, font: fontR });
  drawLines([lines[0]], MARGIN+indent, BODY, fontR);
  lines.slice(1).forEach(l => drawLines([l], MARGIN+indent, BODY, fontR));
  y -= BODY + GAP;
};

// ─── build PDF ────────────────────────────────────────────────────────────
pdf   = await PDFDocument.create();
fontR = await pdf.embedFont(StandardFonts.Helvetica);
fontB = await pdf.embedFont(StandardFonts.HelveticaBold);
newPage();

// Name + contact
drawLines([CV.contact.full_name], MARGIN, NAME, fontB);
const contact = [CV.contact.city, CV.contact.email, CV.contact.phone]
                .filter(Boolean).join(' · ');
drawLines([contact], MARGIN, BODY, fontR); y -= 8;

// Summary
if (CV.summary) { heading('Summary');
  drawLines(wrap(CV.summary, A4[0]-2*MARGIN, fontR, BODY), MARGIN, BODY, fontR); }

// Skills
const s = CV.skills;
if (s && Object.values(s).some(arr => arr?.length)) {
  heading('Skills');
  if (s.languages?.length) bullet('Languages: ' + s.languages.join(', '));
  if (s.frameworks?.length) bullet('Frameworks: ' + s.frameworks.join(', '));
  if (s.tools?.length)      bullet('Tools: ' + s.tools.join(', '));
  if (s.databases?.length)  bullet('Databases: ' + s.databases.join(', '));
}

// Projects
if (CV.projects?.length) {
  heading('Projects');
  CV.projects.forEach(p =>
    bullet(`${p.name} (${p.date}) — ${p.description ?? ''}`));
}

// Education
if (CV.education?.length) {
  heading('Education');
  CV.education.forEach(e =>
    bullet(`${e.degree} - ${e.institution} (${e.start_year}-${e.expected_grad ?? ''})`));
}

// ─── save ─────────────────────────────────────────────────────────────────
await fs.writeFile(
  `${CV.contact.full_name.replace(/\\s+/g,'_')}_CV.pdf`,
  await pdf.save()
);
console.log('PDF generated ✔');
