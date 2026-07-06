
import * as pdfReader from 'pdfreader';
import fs from 'fs';

const pdfPath = './public/3.Digital_Essentials_and_Creative_Services.pdf';
let pages = [];
let currentPage = 0;
let lines = [];

new pdfReader.PdfReader().parseFileItems(pdfPath, function (err, item) {
  if (err) {
    console.error('Error reading PDF:', err);
    return;
  }
  if (!item) {
    // All done, write all pages to a file
    const content = pages.map((page, idx) => `--- Page ${idx + 1} ---\n${page}`).join('\n\n');
    fs.writeFileSync('extracted-digital-services.txt', content, 'utf8');
    console.log('Extraction complete! Content saved to extracted-digital-services.txt');
    return;
  }
  if (item.page) {
    if (lines.length > 0) {
      pages.push(lines.join(' '));
    }
    currentPage = item.page;
    lines = [];
  }
  if (item.text) {
    lines.push(item.text);
  }
});
