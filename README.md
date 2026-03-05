# Invoice App

A mobile-friendly web app for creating and downloading professional invoices as PDF.

**Live:** [abbasbukhari.github.io/invoice-app](https://abbasbukhari.github.io/invoice-app/)

---

## Features

- **Company Setup** — Enter your company info and logo once, reused across all invoices
- **Invoice Builder** — Client details, matter/file reference, and dynamic service rows (Type, Date, Notes, Qty, Rate)
- **Live Preview** — See the invoice update in real time as you type
- **PDF Download** — One click exports a print-ready PDF named after your invoice number
- **Auto-calculations** — Subtotal, HST tax, and total calculate automatically
- **Auto-save** — Company info and current draft are saved in the browser (no account needed)
- **How to Use** — Built-in instructions page for non-technical users

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS v4
- jsPDF + html2canvas (PDF export)
- Browser LocalStorage (data persistence)

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

Hosted on GitHub Pages. Every push to `main` auto-deploys via GitHub Actions.

To deploy manually:

```bash
npm run build
```

The `dist/` folder is the production build.

---

## Project Structure

```
src/
  components/
    CompanySetup.jsx     # Company info, logo, payment settings
    InvoiceForm.jsx      # Invoice creation form with service rows
    InvoicePreview.jsx   # Live invoice preview (also used for PDF capture)
    ServiceRow.jsx       # Single service/expense line item
    HowToUse.jsx         # Step-by-step instructions page
  utils/
    storage.js           # LocalStorage helpers
    calculations.js      # Subtotal, tax, totals, date formatting
    pdfGenerator.js      # html2canvas + jsPDF export
  App.jsx                # Main layout, tabs, PDF download button
```

---

## Design

Matches the approved Google Sheets invoice template:

- **Black** — all text and labels
- **Red (#CC0000)** — "INVOICE" title, table header row, Total row, divider bar
- **White** — all backgrounds
- **Light Grey (#F2F2F2)** — alternating service row backgrounds
