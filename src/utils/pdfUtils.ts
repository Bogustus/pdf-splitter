import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface SplitOptions {
  mode: 'all' | 'range';
  ranges?: string; // e.g. "1-5, 8, 11-13"
}

export const splitPdfAndZip = async (
  file: File, 
  options: SplitOptions = { mode: 'all' },
  onProgress?: (progress: number) => void
): Promise<void> => {
  const arrayBuffer = await file.arrayBuffer();
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  const zip = new JSZip();

  const folderName = file.name.replace(/\.pdf$/i, '') + '_split';
  const folder = zip.folder(folderName);

  if (!folder) throw new Error('Failed to create zip folder');

  // Determine which pages to extract (0-indexed)
  let pagesToExtract: number[] = [];

  if (options.mode === 'all') {
    pagesToExtract = Array.from({ length: totalPages }, (_, i) => i);
  } else if (options.mode === 'range' && options.ranges) {
    // Parse ranges
    pagesToExtract = parsePageRanges(options.ranges, totalPages);
  }

  const totalOps = pagesToExtract.length;
  
  for (let i = 0; i < totalOps; i++) {
    const pageIndex = pagesToExtract[i];
    
    // Create a new document for this page
    const newPdf = await PDFDocument.create();
    
    // Copy the page
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
    newPdf.addPage(copiedPage);
    
    const pdfBytes = await newPdf.save();
    
    // Naming: page_001.pdf
    const pageNum = pageIndex + 1;
    const pad = totalPages > 99 ? 3 : totalPages > 9 ? 2 : 1;
    const fileName = `page_${String(pageNum).padStart(pad, '0')}.pdf`;
    
    folder.file(fileName, pdfBytes);

    if (onProgress) {
        onProgress(Math.round(((i + 1) / totalOps) * 100));
    }
  }

  // Generate zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${folderName}.zip`);
};

// Helper to parse ranges like "1-3, 5" -> [0, 1, 2, 4]
const parsePageRanges = (rangeStr: string, maxPages: number): number[] => {
  const pages = new Set<number>();
  const parts = rangeStr.split(',');
  
  parts.forEach(part => {
    const cleaned = part.trim();
    if (cleaned.includes('-')) {
      const [start, end] = cleaned.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= maxPages) pages.add(i - 1);
        }
      }
    } else {
      const page = Number(cleaned);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        pages.add(page - 1);
      }
    }
  });
  
  return Array.from(pages).sort((a, b) => a - b);
};

export const getPdfDetails = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    return {
        pageCount: pdfDoc.getPageCount(),
        title: pdfDoc.getTitle(),
        author: pdfDoc.getAuthor()
    };
}
