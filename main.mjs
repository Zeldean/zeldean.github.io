/* main.mjs — one‑page two‑column CV generator
 * -------------------------------------------------
 * Run: node main.mjs   →  cv.pdf
 * Requires: npm i pdf-lib
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import {
    A4,
    MARGIN,
    GUTTER,
    SIDEBAR_W,
    TOP_Y,
    GAP,
    bindContext,
    newPage,
    drawContactRow,
    addTitle,
    addSubtitle,
    addParagraph,
    addBullet,
    addImage,
    BODY_SZ,
    ensureSpace,
    addBoldPrefixLine
  } from './js/cv_util.mjs';

//────────── 1. Load data ────────────────────────────────────────────
const CV = JSON.parse(await fs.readFile('./assets/cv.json', 'utf8'));
const fullName = `${CV.personal.first_name} ${CV.personal.surname}`;

//────────── 2. Layout ------------------------------------------------
var GAP2 = 25;

//────────── 3. PDF setup --------------------------------------------
const pdf   = await PDFDocument.create();
const fontR = await pdf.embedFont(StandardFonts.Helvetica);
const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);
let   page  = pdf.addPage(A4);

bindContext({
  pdf,
  page,
  fontReg: fontR,
  fontBold: fontB,
  y: TOP_Y
});
const refreshPage = () => { page = getPage(); };


let y = TOP_Y;

// ────────── 4. Sidebar ────────────────────────────────────────────────────────────
let ySide = TOP_Y;
const sideBox = {
  xStart: MARGIN,
  xEnd:   MARGIN + SIDEBAR_W
};

ySide = addTitle(`${CV.personal.first_name} ${CV.personal.surname}`, { ...sideBox, y: ySide, centered: true });
ySide = addParagraph(`${CV.bio.title}`, { ...sideBox, y: ySide+8, centered: true });

try {
  const picBytes = await fs.readFile('./assets/profile.jpg');
  const photoW   = sideBox.xEnd - sideBox.xStart;            // full width
  ySide = await addImage(picBytes, {
    xStart: sideBox.xStart,
    y:      ySide,
    widthPt: photoW,
  });
} catch { 
  // skip if file missing
  ySide -= 100; // reserve space for photo
}
ySide = addParagraph(`${CV.bio.focus}`, { ...sideBox, y: ySide, size: 12 });

ySide -= GAP2;
ySide = addSubtitle('Personal', { ...sideBox, y: ySide });
ySide = addParagraph(`DOB: ${CV.personal.dob}`, { ...sideBox, y: ySide });
ySide = addParagraph(`City: ${CV.personal.city}`, { ...sideBox, y: ySide });
ySide = addParagraph(`Country: ${CV.personal.country}`, { ...sideBox, y: ySide });
const languges = [CV.personal.home_language].concat(CV.personal.other_languages).toString().replace(',', ", ") || 'English';
ySide = addParagraph(`Lang: ${languges}`, { ...sideBox, y: ySide });

ySide -= GAP2;

async function sideContact(iconFile, label, url) {
  const bytes = await fs.readFile(`./assets/icons/${iconFile}`);
  ySide = await drawContactRow({
    iconBytes: bytes,
    url,
    x: sideBox.xStart,
    y: ySide,
    label,
    font: fontR,
    size: 12,
  });
}

/* -------- Contacts section --------------------------------------- */
ySide = addSubtitle('Contact', { ...sideBox, y: ySide });
await sideContact('mail.png',    CV.contacts.email, `mailto:${CV.contacts.email}`);
await sideContact('phone.png',   CV.contacts.phone, `tel:${CV.contacts.phone.replace(/\\s+/g,'')}`);
await sideContact('globe.png',   'zeldean.me',            CV.contacts.website);
await sideContact('github.png',  'Zeldean',    CV.contacts.github);
await sideContact('linkedin.png','DeanVanZyl',   CV.contacts.linkedin);



/* ---- QR code pinned to bottom of sidebar on page 1 --------------- */
try {
  const qrBytes = await fs.readFile('./assets/qrCode.png');
  const qrImg   = await pdf.embedPng(qrBytes);           // pre‑embed
  const qrW     = sideBox.xEnd - sideBox.xStart - 120;   // centred padding
  const qrH     = (qrImg.height / qrImg.width) * qrW;
  const qrY     = MARGIN + 10 + qrH;                     // 10 pt above bottom

  // draw directly (skip addImage's page‑break logic)
  page.drawImage(qrImg, {
    x: sideBox.xStart + 60,
    y: qrY - qrH,
    width:  qrW,
    height: qrH,
  });

} catch {/* skip if missing */}



// main column
let yMain = TOP_Y;
const mainBox = {
  xStart: MARGIN + SIDEBAR_W + GUTTER,
  xEnd: A4[0] - MARGIN
};
yMain = addSubtitle("About Me", { ...mainBox, y: yMain, centered: true });
yMain = addParagraph(`${CV.bio.summary}`, { ...mainBox, y: yMain });

yMain -= GAP2;

/* ---------- Skills ------------------------------------------------- */
if (CV.skills) {
  yMain = addSubtitle('Skills', { ...mainBox, y: yMain, centered: true });

  const s = CV.skills;
  const skillsArr = [
    ['Languages',  s.languages],
    ['Frameworks', s.frameworks],
    ['Tools',      s.tools],
    ['Databases',  s.databases],
  ];

  for (const [label, arr] of skillsArr) {
    if (arr?.length) {
      yMain = addBoldPrefixLine({
        label,
        text: arr.join(', '),
        box:  mainBox,
        y:    yMain,
      });
    }
  }
}
yMain -= GAP2;

/* ---------- Education --------------------------------------------- */
if (CV.education?.length) {
  yMain = addSubtitle('Education', { ...mainBox, y: yMain, centered: true });

  CV.education.forEach(ed => {
    const row = `${ed.degree} — ${ed.institution} (${ed.start_year}-${ed.expected_grad ?? ed.end_year})`;
    yMain = addParagraph(row, { ...mainBox, y: yMain });
  });
}
yMain -= GAP2;

/* ---------- Experience -------------------------------------------- */
if (CV.experience?.length) {
  yMain = addSubtitle('Experience', { ...mainBox, y: yMain, centered: true });

  CV.experience.forEach(ex => {
    const range = `${ex.start_date ?? ''}–${ex.end_date ?? 'Present'}`;
    const head  = `${ex.role} @ ${ex.company} (${range})`;
    yMain = addParagraph(head, { ...mainBox, y: yMain, size: 13 });
    yMain = addParagraph(ex.description, { ...mainBox, y: yMain });
    yMain -=10;
  });
}
yMain -= GAP2;

/* ---------- Projects ---------------------------------------------- */
if (CV.projects?.length) {
  yMain = addSubtitle('Projects', { ...mainBox, y: yMain, centered: true });

  CV.projects.forEach(p => {
    const title = `${p.name} — ${p.date}`;
    yMain = addParagraph(title, { ...mainBox, y: yMain, size: 14, centered: false, bold: true });
    yMain = addParagraph(p.description, { ...mainBox, y: yMain, size: 12 });
    yMain -= 10;
  });
}

//────────── 7. Save --------------------------------------------------
await fs.writeFile('./assets/dean_van_zyl_cv.pdf', await pdf.save());
console.log('cv.pdf written ✔');


