
const { PdfReader } = require("pdfreader");
const fs = require("fs");

const pdfPath = "public/1.Startup or company registration.pdf";
let fullText = "";
let currentPage = 1;

new PdfReader().parseFileItems(pdfPath, (err, item) => {
  if (err) {
    console.error("❌ Error extracting PDF text:", err);
  } else if (!item) {
    // End of file
    console.log("=== PDF Text Extraction ===\n");
    console.log("Text content:\n");
    console.log(fullText);
    console.log("\n=== End of PDF Content ===");
    
    fs.writeFileSync("extracted-pdf-content.txt", fullText);
    console.log("\n✅ Content saved to extracted-pdf-content.txt");
  } else if (item.page) {
    currentPage = item.page;
    fullText += `--- Page ${currentPage} ---\n`;
  } else if (item.text) {
    fullText += item.text + " ";
  }
});

