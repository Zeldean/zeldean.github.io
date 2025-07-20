/* main.mjs — one‑page two‑column CV generator
 * -------------------------------------------------
 * Run: node main.mjs   →  cv.pdf
 * Requires: npm i pdf-lib
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import {
  A4, MARGIN, LINE_GAP,
  wrap, bindContext, ensureSpace,
  getCursor, setCursor, getPage
} from './js/cv_util.mjs';

//────────── 1. Load data ────────────────────────────────────────────
const CV = JSON.parse(await fs.readFile('./assets/cv.json', 'utf8'));
const fullName = `${CV.personal.first_name} ${CV.personal.surname}`;

//────────── 2. Layout ------------------------------------------------
const SIDEBAR_W = 200;
const GUTTER    = 20;
const MAIN_X    = SIDEBAR_W + GUTTER;
const TOP_Y     = A4[1] - 40;

//────────── 3. PDF setup --------------------------------------------
const pdf   = await PDFDocument.create();
const fontR = await pdf.embedFont(StandardFonts.Helvetica);
const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);
let   page  = pdf.addPage(A4);

bindContext({ pdf, page, fontReg: fontR, fontBold: fontB, y: TOP_Y });
const refreshPage = () => { page = getPage(); };

//────────── 4. SIDEBAR ----------------------------------------------
let sideY = TOP_Y;
const PAD_X = MARGIN / 2;
const sideWrap = (txt, size = 11, bold = false) => {
  if (!txt) return;
  const f = bold ? fontB : fontR;
  wrap(txt, SIDEBAR_W - PAD_X * 2, f, size).forEach(l => {
    page.drawText(l, { x: PAD_X, y: sideY, size, font: f });
    sideY -= size + LINE_GAP;
  });
  sideY -= LINE_GAP;
};

// background
page.drawRectangle({ x: 0, y: 0, width: SIDEBAR_W, height: A4[1], color: rgb(0.94, 0.94, 0.94) });

// content
sideWrap(fullName, 24, true);
sideWrap(CV.bio.title, 12);

try {
  const bytes = await fs.readFile('./assets/profile.jpg');
  const img   = await pdf.embedJpg(bytes);
  const wPt   = SIDEBAR_W - PAD_X * 2;
  const hPt   = (img.height / img.width) * wPt;
  page.drawImage(img, { x: PAD_X, y: sideY - hPt, width: wPt, height: hPt });
  sideY -= hPt + 2 * LINE_GAP;
} catch {}

sideWrap('Personal', 11, true);
sideWrap(`DOB:  ${CV.personal.dob}`, 9);
sideWrap(`City: ${CV.personal.city}`, 9);
sideWrap(`Lang: ${CV.personal.home_language}`, 9);

sideWrap('Contacts', 11, true);
const alias = {
  email: CV.contacts.email,
  phone: CV.contacts.phone,
  website: 'zeldean.me',
  linkedin: 'linkedin.com/in/…',
  github: 'github.com/Zeldean',
};
for (const k of ['email', 'phone', 'website', 'linkedin', 'github']) {
  if (CV.contacts[k]) sideWrap(`${k[0].toUpperCase() + k.slice(1)}: ${alias[k]}`, 9);
}

try {
  const qb = await fs.readFile('./assets/qrCode.png');
  const qi = await pdf.embedPng(qb);
  const w  = SIDEBAR_W - PAD_X * 2;
  const h  = (qi.height / qi.width) * w;
  page.drawImage(qi, { x: PAD_X, y: 40, width: w, height: h });
} catch {}

//────────── 5. MAIN COLUMN HELPERS ----------------------------------
const mainWrap = (txt, size = 11) => {
  if (!txt) return;
  const maxW = A4[0] - MAIN_X - MARGIN;
  const lines = wrap(txt, maxW, fontR, size);
  const lh = size + LINE_GAP;
  ensureSpace(lines.length * lh + LINE_GAP);
  refreshPage();
  lines.forEach(l => {
    page.drawText(l, { x: MAIN_X, y: getCursor(), size, font: fontR });
    setCursor(getCursor() - lh);
  });
  setCursor(getCursor() - LINE_GAP);
};

const mainCentered = (txt, size = 14, bold = false) => {
  if (!txt) return;
  const f = bold ? fontB : fontR;
  const maxW = A4[0] - MAIN_X - MARGIN;
  const w = f.widthOfTextAtSize(txt, size);
  const x = MAIN_X + (maxW - w) / 2;
  ensureSpace(size + LINE_GAP * 2);
  refreshPage();
  page.drawText(txt, { x, y: getCursor(), size, font: f });
  setCursor(getCursor() - size - LINE_GAP * 2);
};

//────────── 6. MAIN CONTENT -----------------------------------------
mainCentered(fullName, 24, true);
mainWrap(CV.bio.summary);

mainCentered('Education', 14, true);
CV.education.forEach(e => mainWrap(`${e.degree} — ${e.institution} (${e.start_year}–${e.expected_grad})`));

mainCentered('Skills', 14, true);
mainWrap(CV.skills.languages?.length   && 'Languages: '   + CV.skills.languages.join(', '));
mainWrap(CV.skills.frameworks?.length && 'Frameworks: ' + CV.skills.frameworks.join(', '));
mainWrap(CV.skills.tools?.length      && 'Tools: '       + CV.skills.tools.join(', '));
mainWrap(CV.skills.databases?.length  && 'Databases: '   + CV.skills.databases.join(', '));

mainCentered('Projects', 14, true);
CV.projects.forEach(p => mainWrap(`${p.name} — ${p.description}`));

mainCentered('Experience', 14, true);
CV.experience.forEach(ex => mainWrap(`${ex.role} @ ${ex.company} (${ex.start_date}–${ex.end_date}) — ${ex.description}`));

if (CV.hobbies?.length) {
  mainCentered('Hobbies', 14, true);
  mainWrap(CV.hobbies.join(', '));
}

//────────── 7. Save --------------------------------------------------
await fs.writeFile('cv.pdf', await pdf.save());
console.log('cv.pdf written ✔');
