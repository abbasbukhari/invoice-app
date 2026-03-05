import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Capture the invoice preview element and download as PDF.
 * @param {string} elementId - The DOM id of the preview container
 * @param {string} filename - e.g. "INV-2026-001.pdf"
 */
export async function downloadInvoicePDF(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Preview element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvasAspect = canvas.height / canvas.width;
    const imgWidth = pageWidth;
    const imgHeight = pageWidth * canvasAspect;

    let yPos = 0;
    let remainingHeight = imgHeight;

    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        pdf.addPage();
        yPos = -pageHeight;
      }
    }

    pdf.save(filename || 'invoice.pdf');
  } catch (err) {
    console.error('PDF generation failed:', err);
    throw err;
  }
}
