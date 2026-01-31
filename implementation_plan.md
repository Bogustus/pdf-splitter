# PDF Splitter Implementation Plan

## Objective
Build a web-based application to split large PDF files into smaller, individual files. The app will be hosted on the user's PC and accessed by his wife on a Mac.

## Tech Stack
- **Frontend**: React (via Vite)
- **Styling**: Vanilla CSS (Modern, Responsive, Glassmorphism)
- **PDF Processing**: `pdf-lib` (Client-side processing for speed and privacy)
- **Language**: TypeScript

## Features
1.  **Drag and Drop Interface**: Easy file upload.
2.  **Visual Preview**: See the PDF pages (if possible) or list of pages.
3.  **Splitting Options**:
    -   Split by page (extract all pages).
    -   Split by range (custom ranges).
4.  **Download**: Zip file of split PDFs.
5.  **Responsive Design**: accessible on Desktop/Tablet.

## Implementation Steps
1.  **Project Initialization**:
    -   Setup Vite + React + TypeScript project.
    -   Clean up default files.
2.  **Styles Layout**:
    -   Create `index.css` with CSS variables for the theme (clean, modern, vibrant).
    -   Setup global layout.
3.  **Core Components**:
    -   `FileUploader`: Drag and drop zone.
    -   `PDFManager`: Main logic to load and manipulate PDF.
    -   `PagePreview`: Display pages/options.
4.  **PDF Logic**:
    -   Integrate `pdf-lib`.
    -   Implement `splitPDF` function.
5.  **Refinement**:
    -   Add animations.
    -   Ensure accessibility.
