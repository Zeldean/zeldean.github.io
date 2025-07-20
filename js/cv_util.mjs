/*
 * cv_util.mjs — shared helper library for building Dean van Zyl’s CV
 * -------------------------------------------------------------------
 * Import once in your Node script (main.js) **or** browser builder
 * (generate‑cv.js) and call `bindContext()` to give the helpers access
 * to your current pdf‑lib objects.
 *
 *   import {
 *     bindContext,
 *     newPage, addTitle, addSubtitle, addParagraph,
 *     addBullet, addImage
 *   } from './cv_util.mjs';
 *
 *   bindContext({ pdf, page, fontReg, fontBold, y });
 *   newPage();
 *   addTitle('Dean van Zyl', { centered:true });
 *
 * These helpers assume **points** as the unit (pdf‑lib default).
 */

// ── layout constants ----------------------------------------------------
export const A4          = [595.28, 841.89];   // width, height @ 72 DPI
export const MARGIN      = 40;                 // page margin (all sides)
export const BODY_SIZE   = 11;                 // normal text size
export const TITLE_SIZE  = 18;                 // big title size
export const SUB_SIZE    = 14;                 // section heading size
export const LINE_GAP    = 4;                  // extra gap between lines

// Context variables — bound at runtime via bindContext()
let pdf     = null;   // PDFDocument
let page    = null;   // current PDFPage
let fontReg = null;   // regular font (PDFFont)
let fontBold= null;   // bold font (PDFFont)
let y       = 0;      // cursor (number)

// Bind the shared context so helpers can work without extra params
export function bindContext(ctx){
  ({ pdf, page, fontReg, fontBold, y } = ctx);
}
export function setCursor(newY){ y = newY; }
export function getCursor(){ return y; }
export function setPage(pg){ page = pg; }
export function getPage(){ return page; }


// ── geometry helpers ----------------------------------------------------
export function newPage(){
  page = pdf.addPage(A4);
  y    = A4[1] - MARGIN;
}

export function ensureSpace(px){
  if (y - px < MARGIN) newPage();
}

// ── word‑wrap -----------------------------------------------------------
export function wrap(text, maxWidth, font, size){
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for(const w of words){
    const test = line ? `${line} ${w}` : w;
    if(font.widthOfTextAtSize(test, size) > maxWidth){
      if(line) lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if(line) lines.push(line);
  return lines;
}

// ── drawing primitives --------------------------------------------------
function drawLines(lines, x, size, font){
  const lh = size + LINE_GAP;
  ensureSpace(lines.length * lh);
  for(const ln of lines){
    page.drawText(ln, { x, y, size, font });
    y -= lh;
  }
}

export function addTitle(txt,{centered=false}={}){
  const w = fontBold.widthOfTextAtSize(txt, TITLE_SIZE);
  const x = centered ? (A4[0]-w)/2 : MARGIN;
  ensureSpace(TITLE_SIZE + LINE_GAP*2);
  page.drawText(txt, { x, y, size:TITLE_SIZE, font:fontBold });
  y -= TITLE_SIZE + LINE_GAP*2;
}

export function addSubtitle(txt){
  ensureSpace(SUB_SIZE + LINE_GAP*2);
  page.drawText(txt,{ x:MARGIN, y, size:SUB_SIZE, font:fontBold });
  y -= SUB_SIZE + LINE_GAP;
}

export function addParagraph(txt, size=BODY_SIZE){
  const maxW = A4[0] - 2*MARGIN;
  const lines = wrap(txt, maxW, fontReg, size);
  drawLines(lines, MARGIN, size, fontReg);
  y -= LINE_GAP; // extra gap after paragraph
}

export function addBullet(txt,size=BODY_SIZE){
  const indent = 12;
  const maxW = A4[0] - 2*MARGIN - indent;
  const lines = wrap(txt, maxW, fontReg, size);
  const lh = size + LINE_GAP;
  ensureSpace(lines.length * lh + lh);
  // first line with bullet mark
  page.drawText('•', { x:MARGIN, y, size, font:fontReg });
  page.drawText(lines[0], { x:MARGIN+indent, y, size, font:fontReg });
  y -= lh;
  // remaining wrapped lines
  for(let i=1;i<lines.length;i++){
    page.drawText(lines[i], { x:MARGIN+indent, y, size, font:fontReg });
    y -= lh;
  }
  y -= LINE_GAP; // gap after bullet
}

export async function addImage(bytes,widthPt){
  let img;
  if(bytes[0]===0x89)      img = await pdf.embedPng(bytes);   // PNG magic
  else if(bytes[0]===0xFF) img = await pdf.embedJpg(bytes);   // JPG magic
  else                     img = await pdf.embedSvg(bytes);   // assume SVG
  const heightPt = (img.height / img.width) * widthPt;
  ensureSpace(heightPt + LINE_GAP*2);
  page.drawImage(img,{ x:MARGIN, y:y-heightPt, width:widthPt, height:heightPt });
  y -= heightPt + LINE_GAP*2;
}

// ── convenience: centered text anywhere -------------------------------
export function addCentered(txt,size=BODY_SIZE,font=fontReg){
  const w = font.widthOfTextAtSize(txt,size);
  const x = (A4[0]-w)/2;
  ensureSpace(size+LINE_GAP);
  page.drawText(txt,{x,y,size,font});
  y -= size + LINE_GAP;
}
