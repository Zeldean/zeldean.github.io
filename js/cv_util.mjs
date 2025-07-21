/*
* cv_util.mjs  —  pure helpers (caller manages y & columns)
* ---------------------------------------------------------
* Example usage in main.mjs:
*
*   let y = TOP;
*   const col = { xStart: MAIN_X, xEnd: A4[0] - MARGIN };
*   y = addTitle(fullName,   { ...col, y, centered: true });
*   y = addParagraph(summary,{ ...col, y });
*   // handle page break yourself or call ensureSpace() first
*/
import {
  PDFName, PDFString, PDFNumber, PDFArray
} from 'pdf-lib';


// ── layout constants ----------------------------------------------------
export const A4       = [595.28, 841.89];   // width, height @ 72 DPI
export const MARGIN   = 15;                 // outer page margin
export const GUTTER   = 15;
export const SIDEBAR_W = 170;
export const BODY_SZ  = 12;
export const TITLE_SZ = 24;
export const SUB_SZ   = 18;
export const GAP      = 4;
export const TOP_Y = A4[1] - (MARGIN+10)

// ── pdf‑lib context (bound once) ----------------------------------------
let pdf, page, fontReg, fontBold;
export function bindContext(ctx){
  ({ pdf, page, fontReg, fontBold } = ctx);
}
export function newPage(){
  page = pdf.addPage(A4);
  return A4[1] - (MARGIN+10);          // top‑margin y
}

// ── page‑break helper ---------------------------------------------------
/** Ensure `needed` points fit above bottom margin; returns (possibly new) y. */
export function ensureSpace(y, needed){
  if (y - needed < MARGIN) return newPage();
  return y;
}

// ── internal: resolve box ----------------------------------------------
function bx(o = {}){
  const xStart = o.xStart ?? MARGIN;
  const xEnd   = o.xEnd   ?? (A4[0] - MARGIN);
  return { xStart, width: xEnd - xStart };
}

// ── TEXT HELPERS --------------------------------------------------------
export function addTitle(txt, o = {}) {
  const { centered = false, size = TITLE_SZ, y = A4[1] - MARGIN } = o;
  const { xStart, width } = bx(o);

  const lines = wrap(txt, width, fontBold, size);       // heading font!
  const lh    = size + GAP;                             // tighter than body
  const blockH = lines.length * lh + GAP;               // height incl. bottom gap
  let yPos  = ensureSpace(y, blockH);

  lines.forEach(line => {
    const w = fontBold.widthOfTextAtSize(line, size);
    const drawX = centered ? xStart + (width - w) / 2 : xStart;
    page.drawText(line, { x: drawX, y: yPos, size, font: fontBold });
    yPos -= lh;
  });

  return yPos;
}

export function addSubtitle(txt, o = {}) {
  const { centered = false, size = SUB_SZ, y = A4[1] - MARGIN } = o;
  const { xStart, width } = bx(o);

  const lines = wrap(txt, width, fontBold, size);
  const lh    = size + GAP;
  const blockH = lines.length * lh;
  let yPos = ensureSpace(y, blockH);

  lines.forEach(line => {
    const w = fontBold.widthOfTextAtSize(line, size);
    const drawX = centered ? xStart + (width - w) / 2 : xStart;
    page.drawText(line, { x: drawX, y: yPos, size, font: fontBold });
    yPos -= lh;
  });

  return yPos;  // small gap below subtitle
}

/** Draw text + icon row and add a URI link annotation that
 *  covers both icon + text regions.
 *
 *  • iconBytes – PNG/JPG/SVG buffer
 *  • url       – absolute URI (https://, mailto:, tel:)
 *  • x, y      – baseline of the row (top‑left for icon)
 *  • font      – PDFFont used for text (to measure width)
 *  • label     – text string
 *  • size      – font size (icon height = size)
 */
export async function drawContactRow({
  iconBytes, url,
  x, y,
  label, font,
  size = 12,
  iconPad = 4,
}) {
  /* 1. embed + draw icon */
  let ico;
  if (iconBytes[0] === 0x89)      ico = await pdf.embedPng(iconBytes);
  else if (iconBytes[0] === 0xff) ico = await pdf.embedJpg(iconBytes);
  else                            ico = await pdf.embedSvg(iconBytes);

  const iconH = (ico.height / ico.width) * size;
  const iconY = y + (size - iconH) / 2;          // centre on text line
  page.drawImage(ico, { x, y: iconY, width: size, height: iconH });

  /* 2. draw text */
  const textX = x + size + iconPad;
  page.drawText(label, { x: textX, y, size, font });

  /* 3. annotation rectangle (icon + text) */
  const textW = font.widthOfTextAtSize(label, size);
  const rect = pdf.context.obj([
    PDFNumber.of(x),
    PDFNumber.of(y - iconH),
    PDFNumber.of(textX + textW),
    PDFNumber.of(y + size),
  ]);

  const annot = pdf.context.obj({
    Type:  PDFName.of('Annot'),
    Subtype: PDFName.of('Link'),
    Rect: rect,
    Border: [0, 0, 0],
    A: {
      Type: PDFName.of('Action'),
      S:    PDFName.of('URI'),
      URI:  PDFString.of(url),          // plain PDF string
    },
  });
  const annotRef = pdf.context.register(annot);

  /* 4. push to /Annots */
  const annKey = PDFName.of('Annots');
  let annArr   = page.node.lookup(annKey);
  if (!annArr) {
    annArr = pdf.context.obj([]);
    page.node.set(annKey, annArr);
  }
  annArr.push(annotRef);

  /* 5. return updated cursor */
  return y - (size + GAP*4);
}

export function addParagraph(
  txt,
  {
    size      = BODY_SZ,
    centered  = false,
    bold      = false,        // ← NEW
    font      = undefined,    // ← override if you want a custom PDFFont
    y         = A4[1] - MARGIN,
    ...box                     // xStart / xEnd live in here
  } = {}
) {
  if (!txt) return y;

  const { xStart, width } = bx(box);
  const useFont = font ?? (bold ? fontBold : fontReg);

  const lines = wrap(txt, width, useFont, size);
  const lh    = size + GAP;
  let yPos    = ensureSpace(y, lines.length * lh + GAP);

  lines.forEach(line => {
    const w = useFont.widthOfTextAtSize(line, size);
    const drawX = centered ? xStart + (width - w) / 2 : xStart;
    page.drawText(line, { x: drawX, y: yPos, size, font: useFont });
    yPos -= lh;
  });
  return yPos - GAP;
}


export function addBullet(txt, o = {}){
  if(!txt) return o.y ?? (A4[1]-MARGIN);
  const { size = BODY_SZ, indent = 12, y = A4[1]-MARGIN } = o;
  const { xStart, width } = bx(o);

  const lines = wrap(txt, width - indent, fontReg, size);
  const lh = size + GAP;
  let yPos = ensureSpace(y, lines.length * lh + GAP);

  page.drawText('•', { x: xStart, y: yPos, size, font: fontReg });
  page.drawText(lines[0], { x: xStart + indent, y: yPos, size, font: fontReg });
  yPos -= lh;
  for(let i=1;i<lines.length;i++){
    page.drawText(lines[i],{ x: xStart + indent, y: yPos, size, font: fontReg });
    yPos -= lh;
  }
  return yPos - GAP;
}

/** Draw an image and return the updated y‑cursor.
 *  Required:  bytes, widthPt.
 *  Optional:  y (cursor), xStart/xEnd, debug (bool)
 */
export async function addImage(bytes, o = {}) {
  const {
    widthPt,
    y       = A4[1] - MARGIN,
    debug   = false,
    ...box                    // xStart / xEnd live here
  } = o;

  const { xStart } = bx(box);
  if (!Number.isFinite(widthPt) || widthPt <= 0) return y;

  /* ---- embed ------------------------------------------------------- */
  let img;
  try {
    if (bytes[0] === 0x89)      img = await pdf.embedPng(bytes);
    else if (bytes[0] === 0xff) img = await pdf.embedJpg(bytes);
    else                        img = await pdf.embedSvg(bytes);
  } catch { return y; }

  if (!img.width || !img.height) return y;

  const hPt = (img.height / img.width) * widthPt;
  if (!Number.isFinite(hPt)) return y;

  /* ---- page‑break -------------------------------------------------- */
  let yPos = y;
  if (yPos - (hPt + GAP * 2) < MARGIN) yPos = newPage();

  /* ---- draw -------------------------------------------------------- */
  page.drawImage(img, {
    x: xStart,
    y: yPos - hPt,
    width: widthPt,
    height: hPt,
  });

  const yOut = yPos - (hPt + GAP * 4);

  return yOut;
}

// ── tiny word‑wrap ------------------------------------------------------
export function wrap(text, maxWidth, font, size){
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for(const w of words){
    const test = line ? `${line} ${w}` : w;
    if(font.widthOfTextAtSize(test, size) > maxWidth){
      if(line) lines.push(line);
      line = w;
    } else line = test;
  }
  if(line) lines.push(line);
  return lines;
}


/**
 * Draw “Label: ” in bold, then the rest in regular font on the same line.
 * Returns the updated y cursor.
 */
export function addBoldPrefixLine({ label, text, box, y }) {
  const size = BODY_SZ;
  const { xStart, width } = bx(box);

  /* 1. bold prefix */
  const prefix = `${label}: `;
  const prefixW = fontBold.widthOfTextAtSize(prefix, size);
  page.drawText(prefix, { x: xStart, y, size, font: fontBold });

  /* 2. wrap the remainder within (width - prefixW) */
  const remainderLines = wrap(text, width - prefixW, fontReg, size);
  const lh = size + GAP;
  let yPos = y;

  remainderLines.forEach((ln, i) => {
    const drawX = i === 0 ? xStart + prefixW : xStart;
    page.drawText(ln, { x: drawX, y: yPos, size, font: fontReg });
    if (i < remainderLines.length - 1) yPos -= lh;
  });
  return yPos - lh;      // gap after line
}